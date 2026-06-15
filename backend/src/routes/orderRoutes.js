import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST process checkout
router.post('/', protect, async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Verify stock & prevent buying own products
        for (let item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }
            if (product.creatorId.toString() === req.user._id.toString()) {
                return res.status(400).json({ message: `Sellers cannot purchase their own products (${product.name}).` });
            }
            if (product.countInStock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.countInStock}` });
            }
        }

        // Create the order
        const order = new Order({
            user: req.user._id,
            items,
            shippingAddress,
            totalAmount,
            status: 'Pending'
        });

        const createdOrder = await order.save();

        // Deduct stock quantities
        for (let item of items) {
            const product = await Product.findById(item.product);
            product.countInStock -= item.quantity;
            await product.save();
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Order processing failed', error: error.message });
    }
});

// GET buyer orders
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name imageUrl')
            .sort({ createdAt: -1 }); 
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// GET seller dashboard (orders placed by others for the seller's products)
router.get('/sales', protect, async (req, res) => {
    try {
        // Find all products created by this user
        const sellerProducts = await Product.find({ creatorId: req.user._id }).select('_id');
        const sellerProductIds = sellerProducts.map(p => p._id);

        if (sellerProductIds.length === 0) return res.json([]);

        // Find orders containing any of those products
        const orders = await Order.find({ 'items.product': { $in: sellerProductIds } })
            .populate('items.product', 'name imageUrl price creatorId')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch sales dashboard' });
    }
});

// PUT update order tracking status (Only Seller allowed)
router.put('/:id/status', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Ensure the person updating the tracking is actually the seller of a product in this order
        const isSeller = order.items.some(item => 
            item.product && item.product.creatorId.toString() === req.user._id.toString()
        );

        if (!isSeller) {
            return res.status(403).json({ message: 'Not authorized. Only the seller can update tracking.' });
        }

        order.status = req.body.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order tracking', error: error.message });
    }
});

export default router;
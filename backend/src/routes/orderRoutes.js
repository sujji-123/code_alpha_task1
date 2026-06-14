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

        // 1. Verify stock before creating order
        for (let item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }
            if (product.countInStock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.countInStock}` });
            }
        }

        // 2. Create the order
        const order = new Order({
            user: req.user._id,
            items,
            shippingAddress,
            totalAmount
        });

        const createdOrder = await order.save();

        // 3. Deduct stock quantities
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

// GET user orders
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.product', 'name imageUrl');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

export default router;
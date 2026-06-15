import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const staticImageMap = {
    'Mobiles': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop',
    'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
    'Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    'Smart Watches': 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=800&auto=format&fit=crop',
    "Men's Clothing": 'https://images.unsplash.com/photo-1596755094514-f87e32f85e23?q=80&w=800&auto=format&fit=crop',
    "Women's Clothing": 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    'Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    'Face Wash': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop',
    'Makeup': 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800&auto=format&fit=crop',
    'Electronics': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
    'Fashion': 'https://images.unsplash.com/photo-1596755094514-f87e32f85e23?q=80&w=800&auto=format&fit=crop',
    'Beauty & Cosmetics': 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800&auto=format&fit=crop',
    'Default': 'https://placehold.co/600x600/f3f4f6/4b5563?text=No+Image+Available'
};

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 }); 
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error while fetching products' });
    }
});

// GET single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error while fetching product' });
    }
});

// POST create a new product (Protected - Requires User)
router.post('/', protect, async (req, res) => {
    try {
        const { name, brand, description, price, category, subCategory, countInStock, attributes, imageUrl } = req.body;
        
        const finalImageUrl = imageUrl || staticImageMap[subCategory] || staticImageMap[category] || staticImageMap['Default'];

        const product = new Product({
            name,
            brand,
            description,
            price,
            category,
            subCategory,
            countInStock: countInStock || 1,
            attributes: attributes || {},
            imageUrl: finalImageUrl,
            creatorId: req.user._id
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
});

// PUT refill stock (Protected - Only Creator can refill)
router.put('/:id/refill', protect, async (req, res) => {
    try {
        const { amount } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.creatorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized. Only the creator can refill this product.' });
        }

        product.countInStock += Number(amount);
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Failed to refill stock', error: error.message });
    }
});

export default router;
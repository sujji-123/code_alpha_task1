import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
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

// POST create a new product
router.post('/', async (req, res) => {
    try {
        const { name, description, price, category, countInStock } = req.body;
        
        // Safely format the name without using encodeURIComponent to prevent ReferenceErrors
        const formattedName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const formattedCategory = category.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        
        // Use a strict keyword search for highly relevant product images
        const imageUrl = `https://loremflickr.com/600/600/${formattedCategory},${formattedName}/all`;

        const product = new Product({
            name,
            description,
            price,
            category,
            countInStock: countInStock || 1,
            imageUrl
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
});

export default router;
import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create order (protected route)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { products } = req.body;
    let totalAmount = 0;
    const orderProducts = [];
    
    // Calculate total and get product details
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;
      
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    const order = await Order.create({
      user: req.userId,
      products: orderProducts,
      totalAmount
    });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders (protected route)
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("products.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
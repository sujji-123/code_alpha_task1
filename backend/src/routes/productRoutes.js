import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed initial products (run once)
router.post("/seed", async (req, res) => {
  const sampleProducts = [
    {
      name: "Smartphone X",
      price: 599,
      description: "Latest smartphone with amazing features",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
      category: "Electronics"
    },
    {
      name: "Laptop Pro",
      price: 999,
      description: "Powerful laptop for work and gaming",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
      category: "Electronics"
    },
    {
      name: "Running Shoes",
      price: 89,
      description: "Comfortable running shoes",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
      category: "Sports"
    },
    {
      name: "Coffee Mug",
      price: 15,
      description: "Ceramic coffee mug",
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300",
      category: "Home"
    },
    {
      name: "Headphones",
      price: 199,
      description: "Wireless noise-cancelling headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
      category: "Electronics"
    },
    {
      name: "Backpack",
      price: 49,
      description: "Durable laptop backpack",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300",
      category: "Accessories"
    }
  ];

  try {
    await Product.insertMany(sampleProducts);
    res.json({ message: "Products seeded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
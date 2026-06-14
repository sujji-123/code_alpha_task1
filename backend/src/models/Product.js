import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true, default: 'Generic' },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String }, // e.g., 'Mobile', 'Laptop'
    imageUrl: { type: String },
    countInStock: { type: Number, required: true, default: 0 },
    // Dynamic attributes mapping (e.g., { "RAM": "8GB", "Storage": "128GB", "Color": "Blue" })
    attributes: { type: Map, of: String },
    // Track who created it for stock management
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
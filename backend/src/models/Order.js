import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
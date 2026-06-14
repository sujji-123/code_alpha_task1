import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../services/api';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '', phone: '', email: '',
        street: '', city: '', state: '', country: '', zipCode: ''
    });

    const handleChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const orderItems = cart.map(item => ({
                product: item.id || item.product?._id, 
                quantity: item.quantity,
                price: item.price
            }));

            await api.post('/orders', {
                items: orderItems,
                totalAmount: getCartTotal(),
                shippingAddress
            });

            clearCart();
            alert('Order Placed Successfully!');
            navigate('/orders');
        } catch (error) {
            console.error("Checkout error:", error);
            alert(error.response?.data?.message || 'Failed to place order. Check stock availability.');
        } finally {
            setLoading(false);
        }
    };

    if (!cart || cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto mt-8 flex flex-col lg:flex-row gap-8 px-4">
            {/* Address Form */}
            <div className="lg:w-2/3 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Shipping Information</h2>
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input required type="text" name="fullName" onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                            <input required type="tel" name="phone" onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input required type="email" name="email" onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">House / Street Address</label>
                            <input required type="text" name="street" onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                            <input required type="text" name="city" onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                            <input required type="text" name="state" onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                            <input required type="text" name="country" onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode / Zip Code</label>
                            <input required type="text" name="zipCode" onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
                        </div>
                    </div>
                </form>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3 bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">Order Summary</h2>
                <div className="space-y-4 mb-6">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                            <span className="text-gray-600 truncate w-2/3">{item.quantity}x {item.name}</span>
                            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-4 flex justify-between items-center mb-8">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-extrabold text-indigo-600">${getCartTotal().toFixed(2)}</span>
                </div>
                <button 
                    form="checkout-form"
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 shadow-md transition-all disabled:bg-gray-400"
                >
                    {loading ? 'Processing...' : 'Place Order'}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useContext(CartContext);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const orderItems = cart.map(item => ({
                product: item.id, // Using the ID explicitly saved in the context
                quantity: item.quantity,
                price: item.price
            }));

            await api.post('/orders', { 
                items: orderItems, 
                totalAmount: getCartTotal() 
            });
            
            clearCart();
            navigate('/orders');
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("There was an issue processing your checkout.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (!Array.isArray(cart) || cart.length === 0) {
        return (
            <div className="text-center py-32 bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
                <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b border-gray-100 pb-6">Shopping Cart</h1>
            <div className="space-y-6">
                {cart.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-50 pb-6 group">
                        <div className="flex items-center space-x-6 w-full sm:w-auto">
                            <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} className="w-24 h-24 object-cover rounded-xl shadow-sm" />
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                <p className="text-indigo-600 font-semibold mt-1">${item.price}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">-</button>
                                <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 font-medium p-2">Remove</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 bg-gray-50 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <span className="text-gray-500 block mb-1">Order Total</span>
                    <span className="text-3xl font-extrabold text-gray-900">${getCartTotal().toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} disabled={isCheckingOut} className="mt-6 sm:mt-0 bg-gray-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-800 shadow-md transition-colors w-full sm:w-auto disabled:bg-gray-400">
                    {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>
            </div>
        </div>
    );
};

export default Cart;
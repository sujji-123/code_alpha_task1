import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const trackingSteps = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const fallbackImage = 'https://placehold.co/600x600/f3f4f6/4b5563?text=No+Image+Available';

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-xl text-gray-500">Loading your orders...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-32 bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
                <p className="text-gray-500 mb-8">When you place an order, it will appear here.</p>
                <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-6 mb-16">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b border-gray-100 pb-6">Track Your Orders</h1>
            <div className="space-y-12">
                {orders.map((order) => {
                    const currentStatusIndex = trackingSteps.indexOf(order.status || 'Pending');

                    return (
                        <div key={order._id} className="border border-gray-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                            <div className="flex flex-col md:flex-row justify-between mb-8 pb-6 border-b border-gray-100">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Order ID</p>
                                    <p className="text-gray-900 font-mono font-bold text-lg">{order._id}</p>
                                </div>
                                <div className="mt-4 md:mt-0 text-left md:text-right">
                                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Total Amount</p>
                                    <p className="text-2xl font-extrabold text-indigo-600">${order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="mb-10 px-4">
                                <div className="flex items-center justify-between relative">
                                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0 rounded-full"></div>
                                    <div 
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 z-0 rounded-full transition-all duration-500"
                                        style={{ width: `${(currentStatusIndex / (trackingSteps.length - 1)) * 100}%` }}
                                    ></div>

                                    {trackingSteps.map((step, index) => {
                                        const isCompleted = index <= currentStatusIndex;
                                        const isCurrent = index === currentStatusIndex;
                                        return (
                                            <div key={step} className="relative z-10 flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-colors duration-300 ${
                                                    isCompleted ? 'bg-green-500 border-green-200 text-white' : 'bg-white border-gray-200 text-gray-400'
                                                }`}>
                                                    {isCompleted ? '✓' : index + 1}
                                                </div>
                                                <p className={`mt-3 text-xs md:text-sm font-bold absolute top-8 whitespace-nowrap ${
                                                    isCurrent ? 'text-indigo-600' : (isCompleted ? 'text-gray-800' : 'text-gray-400')
                                                }`}>
                                                    {step}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 mt-16 space-y-4">
                                <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">Items in this shipment</h3>
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center bg-white border p-3 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 bg-white border rounded-lg overflow-hidden flex-shrink-0">
                                                <img 
                                                    src={item.product?.imageUrl || fallbackImage} 
                                                    onError={(e) => { e.target.src = fallbackImage; }}
                                                    alt={item.product?.name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{item.product?.name}</p>
                                                <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-gray-700">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Orders;
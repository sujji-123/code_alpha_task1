import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-xl text-gray-500">Loading your orders...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-32 bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
                <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
                <p className="text-gray-500 mb-8">When you place an order, it will appear here.</p>
                <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b border-gray-100 pb-6">Order History</h1>
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Order ID</p>
                                <p className="text-gray-900 font-mono mt-1">{order._id}</p>
                            </div>
                            <div className="mt-4 md:mt-0 text-left md:text-right">
                                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Status</p>
                                <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full">
                                    {order.status || 'Completed'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                            {item.product?.imageUrl ? (
                                                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Img</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{item.product?.name || 'Unknown Product'}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                <p className="text-2xl font-extrabold text-indigo-600">${order.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
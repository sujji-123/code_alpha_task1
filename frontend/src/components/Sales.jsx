import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    const trackingSteps = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const fallbackImage = 'https://placehold.co/600x600/f3f4f6/4b5563?text=No+Image+Available';

    const fetchSales = async () => {
        try {
            const response = await api.get('/orders/sales');
            setSales(response.data);
        } catch (error) {
            console.error("Error fetching sales", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            alert("Order tracking updated successfully!");
            fetchSales(); 
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status.");
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64 text-xl text-gray-500">Loading your store dashboard...</div>;

    if (sales.length === 0) {
        return (
            <div className="text-center py-32 bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No Sales Yet</h2>
                <p className="text-gray-500 mb-8">When a customer buys one of your published products, it will appear here.</p>
                <Link to="/add-product" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Publish More Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-6 mb-16">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-500 mb-8 pb-6 border-b">Manage orders placed by customers for your products.</p>
            
            <div className="space-y-8">
                {sales.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row gap-8">
                        
                        <div className="lg:w-2/3">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase font-semibold">Order ID: <span className="text-gray-900 font-mono">{order._id}</span></p>
                                    <p className="text-sm text-gray-500 uppercase font-semibold mt-1">Date: <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 uppercase font-semibold">Order Total</p>
                                    <p className="text-xl font-extrabold text-green-600">${order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-2 border-b pb-2">Shipping Details</h3>
                                <p className="text-sm"><span className="font-semibold">Buyer:</span> {order.shippingAddress?.fullName} ({order.user?.email})</p>
                                <p className="text-sm"><span className="font-semibold">Phone:</span> {order.shippingAddress?.phone}</p>
                                <p className="text-sm"><span className="font-semibold">Address:</span> {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state}, {order.shippingAddress?.zipCode}, {order.shippingAddress?.country}</p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-bold text-gray-800">Items Ordered</h3>
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 bg-white border rounded-lg p-2">
                                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                            <img 
                                                src={item.product?.imageUrl || fallbackImage} 
                                                onError={(e) => { e.target.src = fallbackImage; }}
                                                alt={item.product?.name || 'Product'} 
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm text-gray-900">{item.product?.name || 'Product Removed'}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-sm text-gray-700">${item.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-1/3 bg-indigo-50 rounded-xl p-6 border border-indigo-100 flex flex-col justify-center">
                            <h3 className="font-bold text-indigo-900 mb-4 text-center">Update Tracking Status</h3>
                            <div className="flex flex-col gap-4">
                                <select 
                                    className="w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 cursor-pointer font-semibold"
                                    value={order.status || 'Pending'}
                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                >
                                    {trackingSteps.map(step => (
                                        <option key={step} value={step}>{step}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-indigo-700 text-center">Changing this status will immediately notify the buyer on their tracking page.</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sales;
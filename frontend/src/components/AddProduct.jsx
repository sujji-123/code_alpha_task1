import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Electronics', // Default selected value
        countInStock: ''
    });
    const [loading, setLoading] = useState(false);

    // Categories for the dropdown menu
    const categories = [
        "Electronics",
        "Apparel",
        "Home & Kitchen",
        "Books",
        "Toys & Games",
        "Beauty & Health",
        "Automotive"
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/products', {
                ...formData,
                price: Number(formData.price),
                countInStock: Number(formData.countInStock)
            });
            alert('Product added successfully!');
            navigate('/'); 
        } catch (error) {
            console.error("Error adding product", error);
            alert("Failed to add product. Check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b border-gray-100 pb-4">Add New Product</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Wireless Headphones" />
                    </div>
                    
                    {/* The Category Dropdown Menu */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                        <div className="relative">
                            <select 
                                name="category" 
                                value={formData.category} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                        <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="99.99" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Units in Stock</label>
                        <input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="50" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Describe the product details..."></textarea>
                    </div>
                </div>
                
                <div className="mt-8">
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 shadow-md transition-all disabled:bg-gray-400">
                        {loading ? 'Adding Product...' : 'Publish Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
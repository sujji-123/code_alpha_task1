import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddProduct = () => {
    const navigate = useNavigate();
    
    // Product Templates System
    const templates = {
        'Electronics': {
            'Mobiles': ['RAM', 'Storage', 'Processor', 'Battery', 'Camera', 'Display Size', 'OS', 'Color', 'Warranty'],
            'Laptops': ['Processor', 'RAM', 'SSD/HDD', 'GPU', 'Display', 'Battery', 'Weight', 'Warranty'],
            'Headphones': ['Type', 'Connectivity', 'Battery Life', 'Noise Cancellation', 'Color'],
            'Smart Watches': ['Display', 'Battery', 'Sensors', 'Water Resistance', 'Strap Material']
        },
        'Fashion': {
            'Men\'s Clothing': ['Size', 'Fabric', 'Fit', 'Color', 'Care Instructions'],
            'Women\'s Clothing': ['Size', 'Fabric', 'Style', 'Color', 'Occasion'],
            'Shoes': ['Size', 'Material', 'Sole', 'Color', 'Style']
        },
        'Beauty & Cosmetics': {
            'Face Wash': ['Skin Type', 'Volume', 'Key Ingredients', 'Benefits'],
            'Makeup': ['Shade', 'Skin Type', 'Finish', 'Expiry Date']
        }
    };

    // Dummy Data Generators for Auto-Fill
    const dummyData = {
        'Mobiles': {
            name: 'Galaxy X Pro', brand: 'Samsung', price: '899.99', countInStock: '50',
            attributes: { 'RAM': '12GB', 'Storage': '256GB', 'Processor': 'Snapdragon 8 Gen 2', 'Battery': '5000mAh', 'Camera': '108MP + 12MP', 'Display Size': '6.8 inches', 'OS': 'Android 14', 'Color': 'Phantom Black', 'Warranty': '1 Year' }
        },
        'Laptops': {
            name: 'MacBook Air M3', brand: 'Apple', price: '1299.00', countInStock: '30',
            attributes: { 'Processor': 'Apple M3', 'RAM': '16GB', 'SSD/HDD': '512GB SSD', 'GPU': '10-core GPU', 'Display': '13.6-inch Liquid Retina', 'Battery': '18 hours', 'Weight': '1.24 kg', 'Warranty': '1 Year Apple Care' }
        },
        'Headphones': {
            name: 'WH-1000XM5', brand: 'Sony', price: '348.00', countInStock: '100',
            attributes: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth 5.2', 'Battery Life': '30 Hours', 'Noise Cancellation': 'Active (ANC)', 'Color': 'Silver' }
        },
        'Smart Watches': {
            name: 'Watch Series 9', brand: 'Apple', price: '399.00', countInStock: '45',
            attributes: { 'Display': 'Always-On Retina', 'Battery': '18 Hours', 'Sensors': 'ECG, Blood Oxygen', 'Water Resistance': '50m', 'Strap Material': 'Sport Band' }
        },
        'Men\'s Clothing': {
            name: 'Classic Oxford Shirt', brand: 'Ralph Lauren', price: '89.50', countInStock: '200',
            attributes: { 'Size': 'Large', 'Fabric': '100% Cotton', 'Fit': 'Regular Fit', 'Color': 'Light Blue', 'Care Instructions': 'Machine Wash Cold' }
        },
        'Women\'s Clothing': {
            name: 'Floral Summer Maxi', brand: 'Zara', price: '59.90', countInStock: '150',
            attributes: { 'Size': 'Medium', 'Fabric': 'Viscose', 'Style': 'Maxi Dress', 'Color': 'Red/White Floral', 'Occasion': 'Casual / Summer' }
        },
        'Shoes': {
            name: 'Air Force 1', brand: 'Nike', price: '110.00', countInStock: '80',
            attributes: { 'Size': 'US 10', 'Material': 'Leather', 'Sole': 'Rubber', 'Color': 'White', 'Style': 'Sneaker' }
        },
        'Face Wash': {
            name: 'Hydrating Cleanser', brand: 'CeraVe', price: '15.99', countInStock: '300',
            attributes: { 'Skin Type': 'Normal to Dry', 'Volume': '16 oz', 'Key Ingredients': 'Ceramides, Hyaluronic Acid', 'Benefits': 'Cleanses and Hydrates' }
        },
        'Makeup': {
            name: 'Luminous Silk Foundation', brand: 'Giorgio Armani', price: '69.00', countInStock: '60',
            attributes: { 'Shade': '5.5 Medium', 'Skin Type': 'All Skin Types', 'Finish': 'Radiant', 'Expiry Date': '12 Months after opening' }
        }
    };

    const categories = Object.keys(templates);

    const [formData, setFormData] = useState({
        name: '', brand: '', description: '', price: '', category: categories[0], subCategory: '', countInStock: ''
    });
    
    const [attributes, setAttributes] = useState({});
    const [loading, setLoading] = useState(false);

    // Auto-select first subcategory when category changes
    useEffect(() => {
        const subs = Object.keys(templates[formData.category]);
        setFormData(prev => ({ ...prev, subCategory: subs[0] }));
    }, [formData.category]);

    // Reset and build dynamic attributes form when subcategory changes
    useEffect(() => {
        if (formData.subCategory && templates[formData.category][formData.subCategory]) {
            const fields = templates[formData.category][formData.subCategory];
            const newAttrs = {};
            fields.forEach(field => newAttrs[field] = '');
            setAttributes(newAttrs);
            
            // Auto-generate a basic description if empty
            if (!formData.description) {
                setFormData(prev => ({
                    ...prev,
                    description: `Experience the latest ${formData.subCategory.slice(0, -1).toLowerCase()} from our premium collection. Built with high-quality materials and backed by our standard warranty.`
                }));
            }
        }
    }, [formData.subCategory, formData.category]);

    const handleMainChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAttributeChange = (e) => {
        setAttributes({ ...attributes, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const subCatDummy = dummyData[formData.subCategory];
            
            // Smart Auto-Fill Logic: If user left a field blank, fill it with dummy data. Otherwise, keep user's input.
            const finalName = formData.name.trim() || subCatDummy?.name || 'New Product';
            const finalBrand = formData.brand.trim() || subCatDummy?.brand || 'Generic Brand';
            const finalPrice = formData.price ? Number(formData.price) : Number(subCatDummy?.price || 99.99);
            const finalStock = formData.countInStock ? Number(formData.countInStock) : Number(subCatDummy?.countInStock || 10);
            const finalDescription = formData.description.trim() || `High quality ${formData.subCategory.toLowerCase()}`;

            // Process attributes: if an attribute is empty, try to get it from dummy data
            const finalAttributes = {};
            Object.keys(attributes).forEach(key => {
                finalAttributes[key] = attributes[key].trim() || (subCatDummy?.attributes && subCatDummy.attributes[key]) || 'N/A';
            });

            await api.post('/products', {
                name: finalName,
                brand: finalBrand,
                description: finalDescription,
                price: finalPrice,
                category: formData.category,
                subCategory: formData.subCategory,
                countInStock: finalStock,
                attributes: finalAttributes
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
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-8 mb-16">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Add New Product</h1>
            <p className="text-gray-500 mb-8 pb-4 border-b">Select a template. Leave fields blank to auto-fill with standard specifications.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Template Selection */}
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                    <h2 className="text-lg font-bold text-indigo-900 mb-4">1. Choose Template</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-indigo-800 mb-2">Category</label>
                            <select name="category" value={formData.category} onChange={handleMainChange} className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-indigo-800 mb-2">Product Type (Sub-Category)</label>
                            <select name="subCategory" value={formData.subCategory} onChange={handleMainChange} className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                                {Object.keys(templates[formData.category]).map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Basic Info */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">2. Core Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Title</label>
                            <input type="text" name="name" value={formData.name} onChange={handleMainChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl" placeholder="Leave blank to auto-fill" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                            <input type="text" name="brand" value={formData.brand} onChange={handleMainChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl" placeholder="Leave blank to auto-fill" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleMainChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl" placeholder="Leave blank to auto-fill" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Stock Quantity</label>
                            <input type="number" name="countInStock" value={formData.countInStock} onChange={handleMainChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl" placeholder="Leave blank to auto-fill" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleMainChange} rows="3" className="w-full px-4 py-3 bg-gray-50 border rounded-xl" placeholder="Leave blank to auto-fill"></textarea>
                        </div>
                    </div>
                </div>

                {/* 3. Dynamic Specifications */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">3. Specifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.keys(attributes).map(key => (
                            <div key={key}>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">{key}</label>
                                <input type="text" name={key} value={attributes[key]} onChange={handleAttributeChange} className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm" placeholder={`Leave blank to auto-fill`} />
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="pt-6 border-t">
                    <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 shadow-md transition-all">
                        {loading ? 'Publishing...' : 'Publish Product'}
                    </button>
                    <p className="text-sm text-gray-500 text-center mt-4">Relevant images and missing data will be generated automatically upon publishing.</p>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
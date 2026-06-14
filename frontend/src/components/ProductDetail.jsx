import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [refillAmount, setRefillAmount] = useState('');
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error("Error fetching product", error);
        }
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        navigate('/cart');
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/checkout');
    };

    const handleRefill = async () => {
        if (!refillAmount || isNaN(refillAmount) || Number(refillAmount) <= 0) return;
        try {
            await api.put(`/products/${id}/refill`, { amount: Number(refillAmount) });
            setRefillAmount('');
            fetchProduct(); // Refresh data to show new stock
            alert('Stock successfully refilled!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to refill stock.');
        }
    };

    if (!product) return <div className="flex justify-center items-center h-64">Loading...</div>;

    const outOfStock = product.countInStock === 0;
    const isCreator = user && product.creatorId === user._id;

    return (
        <div className="max-w-6xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-sm border mt-6 mb-16">
            <div className="flex flex-col md:flex-row gap-10">
                {/* Image Section */}
                <div className="md:w-5/12 flex justify-center items-start">
                    <img className="w-full max-w-md object-cover rounded-xl shadow-sm border border-gray-100" src={product.imageUrl} alt={product.name} />
                </div>
                
                {/* Details Section */}
                <div className="md:w-7/12 flex flex-col">
                    <div className="text-sm font-bold text-indigo-600 mb-2 uppercase tracking-wide">
                        {product.brand} • {product.subCategory || product.category}
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
                    <div className="text-3xl font-bold text-gray-900 mb-4 border-b pb-4">${product.price}</div>
                    
                    {/* Stock Status */}
                    <div className="mb-6">
                        {outOfStock ? (
                            <span className="text-red-600 font-bold bg-red-50 px-3 py-1 rounded-md">Currently Out of Stock</span>
                        ) : (
                            <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-md">In Stock ({product.countInStock} available)</span>
                        )}
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

                    {/* Specifications Table */}
                    {product.attributes && Object.keys(product.attributes).length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-3 border-b pb-2">Specifications</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                {Object.entries(product.attributes).map(([key, value]) => (
                                    value && (
                                        <div key={key} className="flex py-1 border-b border-gray-50">
                                            <span className="w-1/2 text-gray-500 font-medium">{key}</span>
                                            <span className="w-1/2 text-gray-900">{value}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Area */}
                    <div className="mt-auto pt-6 border-t flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                        {!outOfStock && (
                            <div className="flex items-center border rounded-xl overflow-hidden bg-gray-50">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-gray-600 hover:bg-gray-200">-</button>
                                <span className="px-4 py-3 font-bold bg-white">{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))} className="px-4 py-3 text-gray-600 hover:bg-gray-200">+</button>
                            </div>
                        )}
                        <button disabled={outOfStock} onClick={handleAddToCart} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-xl shadow-sm disabled:opacity-50">Add to Cart</button>
                        <button disabled={outOfStock} onClick={handleBuyNow} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-sm disabled:opacity-50">Buy Now</button>
                    </div>

                    {/* Inventory Management Panel (Only visible to creator) */}
                    {isCreator && (
                        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Admin Inventory Control</h4>
                            <div className="flex gap-2">
                                <input type="number" value={refillAmount} onChange={e => setRefillAmount(e.target.value)} placeholder="Units to add" className="px-3 py-2 border rounded-lg text-sm w-32" />
                                <button onClick={handleRefill} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black">Refill Stock</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
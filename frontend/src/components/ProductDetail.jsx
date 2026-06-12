import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const { addToCart } = useContext(CartContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-64 text-xl text-gray-500">Loading product details...</div>;
    if (!product) return <div className="flex justify-center items-center h-64 text-xl text-gray-500">Product not found.</div>;

    const handleAddToCart = () => {
        addToCart(product._id);
        navigate('/cart');
    };

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <div className="md:flex">
                <div className="md:w-1/2 p-8 flex justify-center items-center bg-gray-50">
                    <img 
                        className="w-full max-w-md object-cover rounded-lg shadow-sm" 
                        src={product.imageUrl || 'https://via.placeholder.com/500'} 
                        alt={product.name} 
                    />
                </div>
                <div className="p-10 md:w-1/2 flex flex-col justify-center">
                    <div className="uppercase tracking-wide text-xs font-bold text-indigo-600 mb-2">
                        {product.category || 'Apparel'}
                    </div>
                    <h1 className="text-4xl leading-tight font-extrabold text-gray-900 mb-4">
                        {product.name}
                    </h1>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        {product.description}
                    </p>
                    <div className="mt-auto border-t border-gray-100 pt-8 flex items-center justify-between">
                        <div>
                            <span className="text-sm text-gray-500 block mb-1">Price</span>
                            <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
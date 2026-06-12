import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProducts();
    }, []);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Featured Products</h1>
            </div>
            
            {/* Arrow-based Slider Section */}
            <div className="relative group mb-12">
                <button 
                    onClick={scrollLeft} 
                    className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 w-10 h-10 rounded-full shadow-lg text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                >
                    &lt;
                </button>
                
                <div 
                    ref={scrollRef}
                    className="flex overflow-x-hidden space-x-6 py-4 px-2" 
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {products.slice(0, 6).map((product) => (
                        <div key={product._id} className="min-w-[280px] w-[280px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <img 
                                src={product.imageUrl || 'https://via.placeholder.com/280x200?text=Product'} 
                                alt={product.name} 
                                className="w-full h-48 object-cover bg-gray-100"
                            />
                            <div className="p-5">
                                <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h2>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                                    <Link 
                                        to={`/product/${product._id}`} 
                                        className="text-sm bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-600 hover:text-white transition-colors"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={scrollRight} 
                    className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 w-10 h-10 rounded-full shadow-lg text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                >
                    &gt;
                </button>
            </div>
            
            {/* Standard Grid Section */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800">All Collection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <Link to={`/product/${product._id}`} key={product._id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                        <div className="overflow-hidden">
                            <img 
                                src={product.imageUrl || 'https://via.placeholder.com/300x250?text=Product'} 
                                alt={product.name} 
                                className="w-full h-56 object-cover bg-gray-100 group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-5 flex flex-col flex-grow justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h2>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                            </div>
                            <span className="text-xl font-bold text-gray-900">${product.price}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
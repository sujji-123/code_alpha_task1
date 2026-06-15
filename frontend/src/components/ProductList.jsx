import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const scrollRef = useRef(null);
    const categoryScrollRef = useRef(null);

    const searchQuery = searchParams.get('search') || '';
    const activeCategory = searchParams.get('category') || 'For You';

    const filterCategories = [
        'For You', 
        'Electronics', 'Mobiles', 'Laptops', 'Headphones', 'Smart Watches', 
        'Fashion', "Men's Clothing", "Women's Clothing", 'Shoes', 
        'Beauty & Cosmetics', 'Face Wash', 'Makeup'
    ];

    const fallbackImage = 'https://placehold.co/600x600/f3f4f6/4b5563?text=No+Image+Available';

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

    const scrollLeft = (ref) => ref.current?.scrollBy({ left: -320, behavior: 'smooth' });
    const scrollRight = (ref) => ref.current?.scrollBy({ left: 320, behavior: 'smooth' });

    const handleCategoryClick = (category) => {
        const params = new URLSearchParams(searchParams);
        if (category === 'For You') {
            params.delete('category');
        } else {
            params.set('category', category);
        }
        navigate(`/?${params.toString()}`);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesCategory = true;
        if (activeCategory !== 'For You') {
            matchesCategory = 
                product.category.toLowerCase().includes(activeCategory.toLowerCase()) || 
                (product.subCategory && product.subCategory.toLowerCase().includes(activeCategory.toLowerCase()));
        }

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="w-full mb-16">
            
            <div className="relative flex items-center bg-white shadow-sm rounded-xl mb-8 border border-gray-100 px-2 py-3">
                <button 
                    onClick={() => scrollLeft(categoryScrollRef)} 
                    className="z-10 bg-white border border-gray-200 w-8 h-8 rounded-full shadow flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all font-bold"
                >
                    &lt;
                </button>
                
                <div 
                    ref={categoryScrollRef}
                    className="flex overflow-x-hidden space-x-6 px-4 no-scrollbar items-center flex-grow" 
                >
                    {filterCategories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className={`whitespace-nowrap pb-1 font-semibold transition-colors border-b-2 ${
                                activeCategory === cat 
                                ? 'text-indigo-600 border-indigo-600' 
                                : 'text-gray-600 border-transparent hover:text-indigo-500'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => scrollRight(categoryScrollRef)} 
                    className="z-10 bg-white border border-gray-200 w-8 h-8 rounded-full shadow flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all font-bold"
                >
                    &gt;
                </button>
            </div>

            {searchQuery && (
                <p className="text-gray-600 mb-6">Showing results for <span className="font-bold text-gray-900">"{searchQuery}"</span></p>
            )}

            {!searchQuery && activeCategory === 'For You' && (
                <>
                    <div className="flex justify-between items-end mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Featured Products</h1>
                    </div>
                    
                    <div className="relative group mb-12">
                        <button 
                            onClick={() => scrollLeft(scrollRef)} 
                            className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 w-10 h-10 rounded-full shadow-lg text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100 font-bold"
                        >
                            &lt;
                        </button>
                        
                        <div 
                            ref={scrollRef}
                            className="flex overflow-x-hidden space-x-6 py-4 px-2 no-scrollbar" 
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {products.slice(0, 6).map((product) => (
                                <div key={product._id} className="min-w-[280px] w-[280px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                                    <img 
                                        src={product.imageUrl || fallbackImage} 
                                        onError={(e) => { e.target.src = fallbackImage; }}
                                        alt={product.name} 
                                        className="w-full h-48 object-cover bg-gray-100"
                                    />
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wide">{product.brand || product.category}</div>
                                        <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h2>
                                        <div className="flex justify-between items-center mt-auto pt-4">
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
                            onClick={() => scrollRight(scrollRef)} 
                            className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 w-10 h-10 rounded-full shadow-lg text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100 font-bold"
                        >
                            &gt;
                        </button>
                    </div>
                </>
            )}
            
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
                {activeCategory === 'For You' ? 'All Collection' : `${activeCategory} Collection`}
            </h2>
            
            {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-500 text-lg">No products found for your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <Link to={`/product/${product._id}`} key={product._id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                            <div className="overflow-hidden">
                                <img 
                                    src={product.imageUrl || fallbackImage} 
                                    onError={(e) => { e.target.src = fallbackImage; }}
                                    alt={product.name} 
                                    className="w-full h-56 object-cover bg-gray-100 group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-5 flex flex-col flex-grow justify-between">
                                <div>
                                    <div className="text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wide">{product.brand || product.category}</div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h2>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                                </div>
                                <span className="text-xl font-bold text-gray-900">${product.price}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
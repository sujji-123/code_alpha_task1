import React, { useContext, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            navigate(`/`);
        }
    };

    let cartItemCount = 0;
    try {
        if (Array.isArray(cart)) {
            cartItemCount = cart.reduce((total, item) => total + (Number(item?.quantity) || 0), 0);
        } else if (cart && typeof cart === 'object' && Array.isArray(cart.items)) {
            cartItemCount = cart.items.reduce((total, item) => total + (Number(item?.quantity) || 0), 0);
        }
    } catch (error) {
        cartItemCount = 0;
    }

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-3 md:py-0 gap-4 md:gap-0">
                    <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-wide flex-shrink-0">
                        ShopHub
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="w-full max-w-md flex mx-4">
                        <input 
                            type="text" 
                            placeholder="Search products, brands and more..." 
                            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition-colors">
                            Search
                        </button>
                    </form>

                    <div className="flex items-center space-x-6 flex-shrink-0">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium hidden sm:block">Home</Link>
                        {user ? (
                            <>
                                <Link to="/add-product" className="text-gray-600 hover:text-indigo-600 font-medium text-sm sm:text-base">List Item</Link>
                                <Link to="/sales" className="text-gray-600 hover:text-indigo-600 font-medium text-sm sm:text-base border-l pl-4 border-gray-300">Store Sales</Link>
                                <Link to="/orders" className="text-gray-600 hover:text-indigo-600 font-medium text-sm sm:text-base">My Orders</Link>
                                <Link to="/cart" className="text-gray-600 hover:text-indigo-600 font-medium relative flex items-center">
                                    Cart
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                                
                                <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 py-1 pl-1 pr-4 rounded-full ml-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm hidden lg:block">
                                        {user.name}
                                    </span>
                                </div>

                                <button 
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-red-600 font-medium transition-colors ml-2"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
                                <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 shadow-md transition-colors">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Ultra-safe check to prevent "reduce is not a function" errors
    // This handles both the correct array structure and prevents crashes if the data is corrupted
    let cartItemCount = 0;
    if (Array.isArray(cart)) {
        cartItemCount = cart.reduce((total, item) => total + (item?.quantity || 0), 0);
    } else if (cart && Array.isArray(cart.items)) {
        cartItemCount = cart.items.reduce((total, item) => total + (item?.quantity || 0), 0);
    }

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-wide">
                        ShopHub
                    </Link>
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">Home</Link>
                        {user ? (
                            <>
                                <Link to="/add-product" className="text-gray-600 hover:text-indigo-600 font-medium">Add Product</Link>
                                <Link to="/orders" className="text-gray-600 hover:text-indigo-600 font-medium">Orders</Link>
                                <Link to="/cart" className="text-gray-600 hover:text-indigo-600 font-medium relative flex items-center">
                                    Cart
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                                
                                {/* User Profile Badge */}
                                <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 py-1 pl-1 pr-4 rounded-full ml-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm hidden sm:block">
                                        {user.name}
                                    </span>
                                </div>

                                <button 
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-red-600 font-medium transition-colors ml-4"
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
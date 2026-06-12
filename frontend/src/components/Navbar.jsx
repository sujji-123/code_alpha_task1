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

    // Safely calculate total items in the cart array
    const cartItemCount = Array.isArray(cart) 
        ? cart.reduce((total, item) => total + item.quantity, 0) 
        : 0;

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
                                <Link to="/orders" className="text-gray-600 hover:text-indigo-600 font-medium">Orders</Link>
                                <Link to="/cart" className="text-gray-600 hover:text-indigo-600 font-medium relative flex items-center">
                                    Cart
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-red-600 font-medium transition-colors"
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
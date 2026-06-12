import React, { createContext, useState, useContext, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  
  // Load initial cart safely
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setCart(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Cart data corrupted, resetting...", error);
      localStorage.removeItem('cart');
      setCart([]);
    }
  }, []);
  
  // Save cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const currentCart = Array.isArray(prevCart) ? prevCart : [];
      const existingItemIndex = currentCart.findIndex(item => item.id === product._id);
      
      if (existingItemIndex >= 0) {
        const newCart = [...currentCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + quantity
        };
        return newCart;
      }
      return [...currentCart, { ...product, id: product._id, quantity }];
    });
  };
  
  const removeFromCart = (productId) => {
    setCart(prevCart => (Array.isArray(prevCart) ? prevCart : []).filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => {
      const currentCart = Array.isArray(prevCart) ? prevCart : [];
      return currentCart.map(item => item.id === productId ? { ...item, quantity } : item);
    });
  };
  
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };
  
  const getCartTotal = () => {
    const currentCart = Array.isArray(cart) ? cart : [];
    return currentCart.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0);
  };
  
  return (
    <CartContext.Provider value={{
      cart: Array.isArray(cart) ? cart : [],
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
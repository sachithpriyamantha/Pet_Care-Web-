import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);
  

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {

      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {

        return prevCart.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {

        return [...prevCart, { ...product, quantity: quantity }];
      }
    });
    

    setIsCartOpen(true);
    

    setTimeout(() => {
      setIsCartOpen(false);
    }, 3000);
  };
  

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };
  

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item._id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };
  

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.some(item => item._id === product._id);
    
    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item._id !== product._id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };
  

  const isProductInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };
  
  const value = {
    cart,
    wishlist,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleWishlist,
    isProductInWishlist,
    toggleCart,
    getTotalItems,
    getTotalPrice
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
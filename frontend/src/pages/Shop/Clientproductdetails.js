import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaShoppingCart, FaMinus, FaPlus, FaHeart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const Clientproductdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
 
  const { 
    addToCart, 
    toggleWishlist, 
    isProductInWishlist
  } = useCart();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details. Please try again.');
        setLoading(false);
        console.error('Error fetching product:', err);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(value, product?.stockQuantity || 1));
    setQuantity(newQuantity);
  };
  
  const handleAddToCart = () => {
    if (!product || product.stockQuantity <= 0) return;
    
    setAddingToCart(true);
    

    addToCart(product, quantity);
    

    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      setAddingToCart(false);
    }, 2000);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-lg mb-4">Product not found</p>
        <button 
          onClick={() => navigate('/shop')} 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }
  
  const isOutOfStock = product.stockQuantity <= 0;
  const isInWishlist = product._id ? isProductInWishlist(product._id) : false;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
      >
        <FaArrowLeft className="mr-2" /> Back to Products
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="h-96 bg-gray-200 flex items-center justify-center overflow-hidden relative">
              <img 
                src={product.imageUrl || 'https://via.placeholder.com/600x600?text=No+Image'} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FaHeart className={isInWishlist ? "text-red-500" : "text-gray-400"} size={18} />
              </button>
            </div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-2xl font-bold text-indigo-700">${product.price.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center mb-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isOutOfStock 
                  ? 'bg-red-100 text-red-800' 
                  : product.stockQuantity <= 5 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
              }`}>
                {isOutOfStock 
                  ? 'Out of Stock' 
                  : product.stockQuantity <= 5 
                    ? `Low Stock: ${product.stockQuantity} left` 
                    : 'In Stock'}
              </div>
              {product.petType && (
                <div className="ml-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  For {product.petType}
                </div>
              )}
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            {!isOutOfStock && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Quantity</h2>
                <div className="flex items-center">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={quantity <= 1}
                  >
                    <FaMinus className={quantity <= 1 ? "text-gray-400" : "text-gray-600"} />
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1" 
                    max={product.stockQuantity}
                    className="w-16 border-t border-b border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 py-2"
                  />
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-r focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={quantity >= product.stockQuantity}
                  >
                    <FaPlus className={quantity >= product.stockQuantity ? "text-gray-400" : "text-gray-600"} />
                  </button>
                </div>
              </div>
            )}
            
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingToCart}
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                addedToCart
                  ? 'bg-green-500'
                  : isOutOfStock 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
              }`}
            >
              {addedToCart 
                ? '✓ Added to Cart!' 
                : (
                  <>
                    <FaShoppingCart className="mr-2" />
                    {addingToCart 
                      ? 'Adding...' 
                      : isOutOfStock 
                        ? 'Out of Stock' 
                        : 'Add to Cart'}
                  </>
                )
              }
            </button>
            
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h2>
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-600">Product ID</div>
                  <div className="text-gray-900">{product._id}</div>
                  
                  <div className="text-gray-600">Category</div>
                  <div className="text-gray-900">{product.category}</div>
                  
                  {product.petType && (
                    <>
                      <div className="text-gray-600">Pet Type</div>
                      <div className="text-gray-900">{product.petType}</div>
                    </>
                  )}
                  
                  <div className="text-gray-600">Stock Quantity</div>
                  <div className="text-gray-900">{product.stockQuantity}</div>
                  
                  {product.createdAt && (
                    <>
                      <div className="text-gray-600">Added On</div>
                      <div className="text-gray-900">{new Date(product.createdAt).toLocaleDateString()}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clientproductdetails;
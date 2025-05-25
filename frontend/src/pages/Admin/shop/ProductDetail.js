import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaBox, FaEdit, FaPaw, FaRegStar, FaShoppingCart, FaStar, FaTag, FaTrash } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        navigate('/');
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleAddToCart = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };


  const getPetTypeIcon = (petType) => {
    switch(petType) {
      case 'Dog': return '🐕';
      case 'Cat': return '🐈';
      case 'Bird': return '🐦';
      case 'Fish': return '🐠';
      case 'Small Animal': return '🐹';
      case 'Reptile': return '🦎';
      default: return '🐾';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-semibold text-gray-700">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md" role="alert">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
          <p className="mt-2">Please try again later or contact support if the problem persists.</p>
          <Link to="/products" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800">
            <FaArrowLeft className="mr-2" />
            Return to products
          </Link>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md" role="alert">
          <p className="font-medium">Product not found</p>
          <p className="mt-2">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800">
            <FaArrowLeft className="mr-2" />
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-fadeIn">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {quantity} {quantity === 1 ? 'item' : 'items'} added to cart
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb & Navigation */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-1 text-sm">
            <li>
              <Link to="/" className="text-gray-500 hover:text-indigo-600">Home</Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link to="/" className="text-gray-500 hover:text-indigo-600">Products</Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-indigo-600 font-medium truncate">{product.name}</li>
          </ol>
        </nav>
        
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors duration-150">
          <FaArrowLeft className="mr-2" />
          Back to all products
        </Link>
        
        {/* Product Details Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-2/5 bg-gray-100 flex items-center justify-center p-4">
              <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                    <div className="text-7xl mb-4">🐾</div>
                    <p className="text-lg">No image available</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="md:w-3/5 p-6 md:p-8">
              <div className="flex flex-col h-full">
                {/* Header Section */}
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                    <span className="text-2xl font-bold text-indigo-600">${parseFloat(product.price).toFixed(2)}</span>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      <FaTag className="mr-1" /> {product.category}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <FaPaw className="mr-1" /> {getPetTypeIcon(product.petType)} {product.petType}
                    </span>
                    
                    {/* Stock Status */}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                      ${product.stockQuantity <= 0 ? 'bg-red-100 text-red-800' : 
                        product.stockQuantity < 5 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      <FaBox className="mr-1" />
                      {product.stockQuantity <= 0 
                        ? 'Out of Stock' 
                        : product.stockQuantity < 5 
                          ? `Low Stock (${product.stockQuantity})` 
                          : `In Stock (${product.stockQuantity})`}
                    </span>
                  </div>
                  
                  {/* Rating */}
                  <div className="mb-6">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaRegStar />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">Based on 24 reviews</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                  
                  {/* Quantity Selector & Add to Cart */}
                  {product.stockQuantity > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h2>
                      <div className="flex items-center">
                        <button 
                          onClick={decreaseQuantity}
                          disabled={quantity <= 1}
                          className="w-10 h-10 rounded-l border border-gray-300 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <div className="w-12 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                          {quantity}
                        </div>
                        <button 
                          onClick={increaseQuantity}
                          disabled={quantity >= product.stockQuantity}
                          className="w-10 h-10 rounded-r border border-gray-300 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                        
                        <button 
                          onClick={handleAddToCart}
                          className="ml-4 flex-grow flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                        >
                          <FaShoppingCart className="mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Product Meta & Actions */}
                <div className="mt-auto pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-gray-500">
                      <p>Product ID: {product._id}</p>
                      <p>Added on {new Date(product.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Link 
                        to={`/edit/${product._id}`} 
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                      >
                        <FaEdit className="mr-1.5" />
                        Edit
                      </Link>
                      
                      <button 
                        onClick={handleDelete} 
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                      >
                        <FaTrash className="mr-1.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Product Information */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Product Features */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>High-quality materials for durability</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Designed for comfort and safety of your pet</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Easy to clean and maintain</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Complies with all pet safety standards</span>
              </li>
            </ul>
          </div>
          
          {/* Shipping Information */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping & Returns</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <svg className="h-6 w-6 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <div>
                  <h3 className="font-medium">Free Shipping</h3>
                  <p className="text-sm">On orders over $35. Standard delivery 3-5 business days.</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="h-6 w-6 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
                <div>
                  <h3 className="font-medium">30-Day Returns</h3>
                  <p className="text-sm">Return unused items within 30 days for a full refund.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
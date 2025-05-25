import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaShoppingCart, FaTimes } from 'react-icons/fa';
import ClientProductCard from './ClientProductCard';
import { useCart } from '../../context/CartContext';
import Cart from '../../components/Cart';

const ClientProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('featured');
  
  const { addToCart, toggleCart, getTotalItems } = useCart();
  const backgroundImage = 'https://images.unsplash.com/photo-1552053831-71594a27632d';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist(wishlist.some(item => item._id === product._id) 
      ? wishlist.filter(item => item._id !== product._id)
      : [...wishlist, product]
    );
  };

  const getFilteredProducts = () => {
    let filtered = products.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    switch(sortBy) {
      case 'priceLowHigh': filtered.sort((a, b) => a.price - b.price); break;
      case 'priceHighLow': filtered.sort((a, b) => b.price - a.price); break;
      case 'newest': filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
    }

    if (activeTab === 'featured') filtered = filtered.filter(p => p.stock > 10);
    if (activeTab === 'bestsellers') filtered = filtered.filter(p => p.price > 50);
    if (activeTab === 'new') filtered = filtered.slice(0, 5);

    return filtered.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'All' || product.category === filter || product.petType === filter;
      return matchesSearch && matchesFilter;
    });
  };

  const filteredProducts = getFilteredProducts();
  const categories = ['All', 'Food', 'Toys', 'Accessories', 'Health', 'Grooming', 'Other'];
  const petTypes = ['All', 'Dog', 'Cat', 'Bird', 'Fish', 'Small Animal', 'Reptile', 'Other'];

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="h-48 bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-full animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-400 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <FaTimes className="text-red-400 text-xl" />
            <h3 className="text-lg font-medium text-red-800">{error}</h3>
          </div>
          <p className="text-red-700">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-fixed" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold text-gray-800"
            >
              Premium Pet Collection
            </motion.h1>
            <p className="text-gray-600">{products.length} luxury items available</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg"
            onClick={toggleCart}
          >
            <FaShoppingCart />
            <span>Cart</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {getTotalItems()}
              </span>
            )}
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                <FaFilter className="text-gray-600" />
                <span>Filters</span>
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="featured">Featured</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Price Range</h4>
                    <div className="relative pt-4">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Category</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map(category => (
                        <label key={category} className="flex items-center gap-2 p-2 bg-white rounded-lg border hover:border-indigo-300">
                          <input
                            type="checkbox"
                            checked={filter === category}
                            onChange={() => setFilter(category)}
                            className="form-checkbox h-4 w-4 text-indigo-600"
                          />
                          {category}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Pet Type</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {petTypes.map(petType => (
                        <label key={petType} className="flex items-center gap-2 p-2 bg-white rounded-lg border hover:border-indigo-300">
                          <input
                            type="checkbox"
                            checked={filter === petType}
                            onChange={() => setFilter(petType)}
                            className="form-checkbox h-4 w-4 text-indigo-600"
                          />
                          {petType}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilter('All');
                      setPriceRange([0, 1000]);
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Products Grid */}
        {loading ? (
          <SkeletonLoader />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center p-12 bg-white/90 rounded-2xl shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="h-48 w-48 bg-gray-100 rounded-full mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('All');
                  setPriceRange([0, 1000]);
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ClientProductCard
                    product={product}
                    onAddToCart={() => addToCart(product)}
                    onToggleWishlist={() => toggleWishlist(product)}
                    isInWishlist={wishlist.some(item => item._id === product._id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Cart />
    </div>
  );
};

export default ClientProductList;
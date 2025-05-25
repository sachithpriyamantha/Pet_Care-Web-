import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaFilter, FaPlus, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Dialog } from '@headlessui/react';
import { FiX } from 'react-icons/fi';
import { ImSpinner8 } from 'react-icons/im';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || product.category === filter || product.petType === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', 'Food', 'Toys', 'Accessories', 'Health', 'Grooming', 'Other'];
  const petTypes = ['All', 'Dog', 'Cat', 'Bird', 'Fish', 'Small Animal', 'Reptile', 'Other'];

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center" 
           style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)' }}>
        <div className="backdrop-blur-sm bg-black/30 w-full h-full flex items-center justify-center">
          <div className="bg-white/90 p-8 rounded-2xl shadow-xl flex flex-col items-center">
            <ImSpinner8 className="animate-spin text-4xl text-indigo-600 mb-4" />
            <p className="text-xl font-semibold text-gray-700">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center" 
           style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1552053831-71594a27632d)' }}>
        <div className="backdrop-blur-sm bg-black/30 w-full h-full flex items-center justify-center">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-8 rounded-2xl shadow-xl max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold">{error}</h3>
            </div>
            <p className="text-gray-700">Please try again later or contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" 
         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1552053831-71594a27632d)' }}>
      <div className="backdrop-blur-sm bg-black/30 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Content Container */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Pet Products Collection
              </h1>
              <Link 
                to="/add" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <FaPlus className="mr-2" /> Add New Product
              </Link>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400 text-lg" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center justify-center px-6 py-3 border border-gray-200 rounded-xl bg-white/50 hover:bg-gray-50/80 transition-colors"
              >
                <FaFilter className="mr-2 text-gray-600" /> 
                <span className="text-gray-700">Filters</span>
              </button>
            </div>

            {/* Results Count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              {filter !== 'All' && (
                <button 
                  onClick={() => setFilter('All')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <FiX className="w-4 h-4" />
                  Clear filters
                </button>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-gray-50/50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="mt-4 text-xl font-medium text-gray-500">No products found</p>
                <p className="mt-2 text-gray-500">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    onDelete={() => handleDelete(product._id)} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter Modal */}
        <Dialog
          open={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <Dialog.Panel className="relative bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-2xl font-bold">Filter Products</Dialog.Title>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setFilter(category)}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        filter === category 
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Pet Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {petTypes.map(petType => (
                    <button
                      key={petType}
                      onClick={() => setFilter(petType)}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        filter === petType 
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {petType}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductList;
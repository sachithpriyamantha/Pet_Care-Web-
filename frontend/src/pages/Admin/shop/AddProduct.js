import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Other',
    price: '',
    description: '',
    imageUrl: '',
    stockQuantity: '',
    petType: 'Other'
  });

  const { name, category, price, description, imageUrl, stockQuantity, petType } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!name || !price || !description || !stockQuantity) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity)
      };

      await axios.post('http://localhost:5000/api/products', productData);
      setLoading(false);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding product');
      setLoading(false);
      console.error('Error adding product:', err);
    }
  };

  // Handle drag events for image upload
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, imageUrl: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, imageUrl: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const categories = ['Food', 'Toys', 'Accessories', 'Health', 'Grooming', 'Other'];
  const petTypes = ['Dog', 'Cat', 'Bird', 'Fish', 'Small Animal', 'Reptile', 'Other'];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1594149929911-78975a43d4f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Pets background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Add New Product
          </h1>
          <p className="mt-3 max-w-md mx-auto text-xl text-indigo-200 sm:mt-5 sm:text-2xl sm:max-w-3xl">
            Expand your pet store inventory with amazing products
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-8 flex items-start">
            <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-bold">Validation Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20"
        >
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Name */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  className="peer h-12 w-full border-b-2 border-gray-300/70 bg-transparent text-white placeholder-transparent focus:border-indigo-400 focus:outline-none"
                  placeholder="Product Name"
                  required
                />
                <label 
                  htmlFor="name" 
                  className="absolute left-0 -top-3.5 text-indigo-100 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300/80 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-100 peer-focus:text-sm"
                >
                  Product Name <span className="text-red-400">*</span>
                </label>
                {name && (
                  <div className="text-xs text-indigo-100 mt-1">
                    {name.length}/50 characters
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="relative">
                <div className="flex items-center">
                  <span className="absolute text-indigo-100">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={price}
                    onChange={handleChange}
                    className="peer h-12 w-full pl-6 border-b-2 border-gray-300/70 bg-transparent text-white placeholder-transparent focus:border-indigo-400 focus:outline-none"
                    placeholder="Price"
                    min="0"
                    step="0.01"
                    required
                  />
                  <label 
                    htmlFor="price" 
                    className="absolute left-6 -top-3.5 text-indigo-100 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300/80 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-100 peer-focus:text-sm"
                  >
                    Price <span className="text-red-400">*</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category */}
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={handleChange}
                  className="w-full h-12 border-b-2 border-gray-300/70 bg-gray-900/30 text-white focus:border-indigo-400 focus:outline-none rounded-t-lg px-2"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                  ))}
                </select>
                <label 
                  htmlFor="category" 
                  className="absolute -top-3.5 left-0 text-indigo-100 text-sm"
                >
                  Category
                </label>
              </div>

              {/* Pet Type */}
              <div className="relative">
                <select
                  id="petType"
                  name="petType"
                  value={petType}
                  onChange={handleChange}
                  className="w-full h-12 border-b-2 border-gray-300/70 bg-gray-900/30 text-white focus:border-indigo-400 focus:outline-none rounded-t-lg px-2"
                >
                  {petTypes.map(type => (
                    <option key={type} value={type} className="bg-gray-800">{type}</option>
                  ))}
                </select>
                <label 
                  htmlFor="petType" 
                  className="absolute -top-3.5 left-0 text-indigo-100 text-sm"
                >
                  Pet Type
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Stock Quantity */}
              <div className="relative">
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  value={stockQuantity}
                  onChange={handleChange}
                  className="peer h-12 w-full border-b-2 border-gray-300/70 bg-transparent text-white placeholder-transparent focus:border-indigo-400 focus:outline-none"
                  placeholder="Stock Quantity"
                  min="0"
                  required
                />
                <label 
                  htmlFor="stockQuantity" 
                  className="absolute left-0 -top-3.5 text-indigo-100 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300/80 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-100 peer-focus:text-sm"
                >
                  Stock Quantity <span className="text-red-400">*</span>
                </label>
              </div>

              {/* Image URL */}
              <div className="relative">
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={imageUrl}
                  onChange={handleChange}
                  className="peer h-12 w-full border-b-2 border-gray-300/70 bg-transparent text-white placeholder-transparent focus:border-indigo-400 focus:outline-none"
                  placeholder="Image URL"
                />
                <label 
                  htmlFor="imageUrl" 
                  className="absolute left-0 -top-3.5 text-indigo-100 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300/80 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-100 peer-focus:text-sm"
                >
                  Image URL
                </label>
              </div>
            </div>

            {/* Image Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${isDragging ? 'border-indigo-400 bg-indigo-900/20' : 'border-gray-300/30'}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden" 
                accept="image/*"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-indigo-100">
                  {isDragging ? 'Drop image here' : 'Drag & drop product image or click to browse'}
                </p>
                <p className="text-sm text-indigo-200/70">Supports JPG, PNG, WEBP (Max 5MB)</p>
              </div>
            </div>

            {/* Image Preview */}
            {(imageUrl) && (
              <div className="mt-4 flex flex-col items-center">
                <p className="text-indigo-100 mb-2">Image Preview:</p>
                <div className="relative group">
                  <img 
                    src={imageUrl} 
                    alt="Product preview" 
                    className="h-40 w-40 object-cover rounded-lg border-2 border-white/20 group-hover:border-indigo-400 transition-all"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=No+Image'} 
                  />
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, imageUrl: ''})}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="relative">
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={handleChange}
                className="peer h-32 w-full border-b-2 border-gray-300/70 bg-transparent text-white placeholder-transparent focus:border-indigo-400 focus:outline-none pt-4 resize-none"
                placeholder="Product Description"
                required
              ></textarea>
              <label 
                htmlFor="description" 
                className="absolute left-0 -top-3.5 text-indigo-100 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300/80 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-100 peer-focus:text-sm"
              >
                Description <span className="text-red-400">*</span>
              </label>
              {description && (
                <div className="text-xs text-indigo-100 mt-1 text-right">
                  {description.length}/500 characters
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-8 py-6 bg-gray-900/30 border-t border-white/10 flex flex-col sm:flex-row-reverse justify-between">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Product...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </span>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="w-full sm:w-auto mt-3 sm:mt-0 px-6 py-3 border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
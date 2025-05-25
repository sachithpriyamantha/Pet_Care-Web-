import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaTag, FaCube, FaPaw } from 'react-icons/fa';

const ProductCard = ({ product, onDelete }) => {
  const { _id, name, description, price, imageUrl, category, petType, stockQuantity } = product;


  const productImage = imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
  

  const formattedPrice = parseFloat(price).toFixed(2);
  

  let stockStatus;
  let stockStatusClass;
  
  if (stockQuantity <= 0) {
    stockStatus = 'Out of Stock';
    stockStatusClass = 'bg-red-100 text-red-800';
  } else if (stockQuantity < 5) {
    stockStatus = 'Low Stock';
    stockStatusClass = 'bg-yellow-100 text-yellow-800';
  } else {
    stockStatus = 'In Stock';
    stockStatusClass = 'bg-green-100 text-green-800';
  }


  const getPetTypeIcon = () => {
    switch(petType) {
      case 'Dog':
        return '🐕';
      case 'Cat':
        return '🐈';
      case 'Bird':
        return '🐦';
      case 'Fish':
        return '🐠';
      case 'Small Animal':
        return '🐹';
      case 'Reptile':
        return '🦎';
      default:
        return '🐾';
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
      {/* Product Image with Link to Details */}
      <Link to={`/admin/product/${_id}`} className="block">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img 
            src={productImage} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
          />
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatusClass}`}>
              {stockStatus}
            </span>
          </div>
        </div>
      </Link>
      
      {/* Product Details */}
      <Link to={`/admin/product/${_id}`} className="block p-4 hover:bg-gray-50 transition-colors duration-150">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{name}</h2>
          <span className="text-lg font-bold text-indigo-600">${formattedPrice}</span>
        </div>
        
        <div className="mt-2 flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
            <FaTag className="mr-1" /> {category}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
            <FaPaw className="mr-1" /> {getPetTypeIcon()} {petType}
          </span>
        </div>
        
        <p className="mt-3 text-sm text-gray-600 line-clamp-3">{description}</p>
        
        <div className="mt-4 text-sm text-gray-500 flex items-center">
          <FaCube className="mr-1" /> 
          <span>{stockQuantity} {stockQuantity === 1 ? 'item' : 'items'} in stock</span>
        </div>
      </Link>
      
      {/* Action Buttons */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-between">
        <Link 
          to={`/edit/${_id}`} 
          className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
        >
          <FaEdit className="mr-1" /> Edit
        </Link>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(_id);
          }}
          className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
        >
          <FaTrash className="mr-1" /> Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
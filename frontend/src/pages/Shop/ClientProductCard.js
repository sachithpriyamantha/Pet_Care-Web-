import React from 'react';
import { FaShoppingCart, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ClientProductCard = ({ product, onAddToCart }) => {
  const { _id, name, description, price, imageUrl, category, petType, stock } = product;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        <img 
          src={imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={name}
          className="w-full h-48 object-cover"
        />
        {stock <= 0 && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded text-xs font-bold">
            Out of Stock
          </div>
        )}
        {stock > 0 && stock <= 5 && (
          <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 m-2 rounded text-xs font-bold">
            Low Stock: {stock} left
          </div>
        )}
        <div className="absolute bottom-0 left-0 bg-gray-800 bg-opacity-70 text-white px-2 py-1 m-2 rounded text-xs">
          {category}
        </div>
        <div className="absolute bottom-0 right-0 bg-blue-600 bg-opacity-70 text-white px-2 py-1 m-2 rounded text-xs">
          For {petType}
        </div>
      </div>
      
      <div className="p-4">
        <h2 className="font-bold text-lg text-gray-800 mb-2">{name}</h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="text-lg font-semibold text-indigo-700">${price.toFixed(2)}</span>
          
          <div className="flex space-x-2">
            <Link 
              to={`/clientproduct/${_id}`}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
            >
              <FaInfoCircle className="mr-1" /> Details
            </Link>
            
            <button
              onClick={onAddToCart}
              disabled={stock <= 0}
              className={`inline-flex items-center px-3 py-1 border border-transparent rounded text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150
                ${stock <= 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'}`}
            >
              <FaShoppingCart className="mr-1" /> 
              {stock <= 0 ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProductCard;
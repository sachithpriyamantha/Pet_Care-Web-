import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const paymentsPerPage = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('/api/payments');
        setPayments(response.data);
        setFilteredPayments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch payments');
        setLoading(false);
        console.error('Error fetching payments:', err);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    let result = payments;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(payment => 
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.cardHolderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.cardNumber.includes(searchTerm) ||
        payment.billingAddress.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.billingAddress.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredPayments(result);
    setCurrentPage(1);
  }, [searchTerm, payments, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 text-gray-400" />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="ml-1 text-indigo-600" /> 
      : <FaSortDown className="ml-1 text-indigo-600" />;
  };

  // Calculate pagination
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  // Calculate summary data
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const uniqueCustomers = [...new Set(payments.map(payment => payment.cardHolderName))].length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading payment records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
          <p className="font-medium">{error}</p>
          <p className="mt-2">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-gray-900 opacity-50 z-0"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1583337130417-3346a1be7dee)' }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-white mb-6">Payment Records</h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white bg-opacity-90 rounded-xl shadow-md p-6 backdrop-filter backdrop-blur-sm">
            <h3 className="text-lg font-medium text-gray-500">Total Payments</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">{payments.length}</p>
          </div>
          <div className="bg-white bg-opacity-90 rounded-xl shadow-md p-6 backdrop-filter backdrop-blur-sm">
            <h3 className="text-lg font-medium text-gray-500">Total Revenue</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-white bg-opacity-90 rounded-xl shadow-md p-6 backdrop-filter backdrop-blur-sm">
            <h3 className="text-lg font-medium text-gray-500">Unique Customers</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">{uniqueCustomers}</p>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white bg-opacity-90 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Payments Table */}
        <div className="bg-white bg-opacity-90 rounded-xl shadow-md overflow-hidden backdrop-filter backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 bg-opacity-90">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('orderId')}
                  >
                    <div className="flex items-center">
                      Order ID
                      {getSortIcon('orderId')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('cardHolderName')}
                  >
                    <div className="flex items-center">
                      Cardholder
                      {getSortIcon('cardHolderName')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Card Number
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('amount')}
                  >
                    <div className="flex items-center">
                      Amount
                      {getSortIcon('amount')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billing Address
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Date
                      {getSortIcon('createdAt')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.cardHolderName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      •••• •••• •••• {payment.cardNumber.slice(-4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="line-clamp-1">
                        {payment.billingAddress.street}, {payment.billingAddress.city}, {payment.billingAddress.state} {payment.billingAddress.zipCode}, {payment.billingAddress.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No payment records found.</p>
            </div>
          ) : (
            <div className="px-6 py-4 bg-gray-50 bg-opacity-90 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstPayment + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastPayment, filteredPayments.length)}
                </span>{' '}
                of <span className="font-medium">{filteredPayments.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingBookings, setProcessingBookings] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, [refreshKey]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/bookings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBookings(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {

    const confirmMessage = status === 'accepted'
      ? 'Are you sure you want to accept this booking?'
      : 'Are you sure you want to reject this booking?';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {

      setProcessingBookings(prev => ({ ...prev, [bookingId]: true }));
      setError('');

      const response = await axios.post(
        `http://localhost:5000/api/admin/bookings/${bookingId}/status`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );


      setBookings(prevBookings =>
        prevBookings.map(booking =>
          (booking._id === bookingId || booking.id === bookingId)
            ? { ...booking, status }
            : booking
        )
      );


      const message = `Booking ${status === 'accepted' ? 'accepted' : 'rejected'} successfully`;
      setSuccessMessage(response.data.message || message);


      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (err) {
      console.error('Error updating booking:', err.response?.data || err.message);
      setError(err.response?.data?.message || `Failed to ${status} booking`);
    } finally {

      setProcessingBookings(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  
  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(booking => booking.status === filterStatus);

  const refreshData = () => {
    setRefreshKey(oldKey => oldKey + 1); 
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583337130417-3346a1be7dee')" }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Pet Bookings Dashboard
              </h1>
              <p className="mt-2 text-gray-600">Manage all pet care appointments</p>
            </div>

            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center"
                >
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800">{successMessage}</span>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center"
                >
                  <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-xl border-gray-200 py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Bookings</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={refreshData}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16 space-y-4">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-gray-600">Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-gray-50/50 rounded-xl"
              >
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-500">
                  No {filterStatus !== 'all' ? filterStatus : ''} bookings found
                </p>
              </motion.div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Pet Name', 'Owner', 'Date', 'Services', 'Status', 'Actions'].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider sticky top-0 bg-gray-50 backdrop-blur-sm"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <motion.tr
                        key={booking._id || booking.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50/30 transition-colors"
                      >
                        {/* Table cells remain the same, but with updated styling */}
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {booking.petName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {booking.userId ? (
                            <div>
                              <div className="font-medium">{booking.userId.username || 'No name'}</div>
                              <div className="text-sm text-gray-500">{booking.userId.email}</div>
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {booking.preferredDate
                            ? new Date(booking.preferredDate).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {booking.services && booking.services.length > 0
                            ? booking.services.map((service, index) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-50 text-blue-800 text-xs px-2.5 py-1 rounded-full mr-1 mb-1"
                              >
                                {service}
                              </span>
                            ))
                            : 'No services'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(booking.status)}`}>
                            {booking.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2 whitespace-nowrap">
                          {/* Updated action buttons with modern styling */}
                          {(!booking.status || booking.status === 'pending') && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusUpdate(booking._id || booking.id, 'accepted')}
                                disabled={processingBookings[booking._id || booking.id]}
                                className={`flex items-center px-3 py-1.5 rounded-lg transition-all ${processingBookings[booking._id || booking.id]
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-green-50 text-green-800 hover:bg-green-100'
                                  }`}
                              >
                                {processingBookings[booking._id || booking.id] ? (
                                  <>
                                    <span className="inline-block h-3 w-3 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                                    Accept
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(booking._id || booking.id, 'rejected')}
                                disabled={processingBookings[booking._id || booking.id]}
                                className={`flex items-center px-3 py-1.5 rounded-lg transition-all ${processingBookings[booking._id || booking.id]
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-red-50 text-red-800 hover:bg-red-100'
                                  }`}
                              >
                                {processingBookings[booking._id || booking.id] ? (
                                  <>
                                    <span className="inline-block h-3 w-3 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <XCircleIcon className="h-4 w-4 mr-1.5" />
                                    Reject
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                          {/* Status indicators */}
                          {(booking.status === 'accepted' || booking.status === 'rejected') && (
                            <span className="flex items-center text-sm">
                              {booking.status === 'accepted' ? (
                                <>
                                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1.5" />
                                  Confirmed
                                </>
                              ) : (
                                <>
                                  <XCircleIcon className="h-4 w-4 text-red-500 mr-1.5" />
                                  Declined
                                </>
                              )}
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              Showing {filteredBookings.length} {filterStatus !== 'all' ? filterStatus : ''} booking{filteredBookings.length !== 1 ? 's' : ''}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ScissorsIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import BookingModal from '../components/BookingModal';
import { motion } from 'framer-motion';

const CaregiverCards = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('experience-desc');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCaregivers();
  }, []);

  const fetchCaregivers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/caregivers');
      setCaregivers(response.data);
      
      const uniqueSpecializations = [...new Set(response.data.map(caregiver => 
        caregiver.specialization))];
      setSpecializations(uniqueSpecializations);
    } catch (err) {
      console.error('Error fetching caregivers:', err);
      setError('Failed to load caregivers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (caregiver, event) => {
    if (event) {
      event.preventDefault();
    }
    
    if (!user) return navigate('/login');
    
    setSelectedCaregiver(caregiver);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = (booking) => {
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 3000);
  };

  const filteredCaregivers = caregivers.filter(caregiver => {

    const matchesSpecialization = !selectedSpecialization || 
      caregiver.specialization === selectedSpecialization;
    

    const matchesSearch = !searchTerm ||
      caregiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caregiver.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSpecialization && matchesSearch;
  });


  const sortedCaregivers = [...filteredCaregivers].sort((a, b) => {
    switch (sortOption) {
      case 'experience-desc':
        return b.experience - a.experience;
      case 'experience-asc':
        return a.experience - b.experience;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'rating-desc':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });


  const checkAvailability = (caregiver) => {
    if (availabilityFilter === 'all') return true;

    return Math.random() > 0.5;
  };

  const availableCaregivers = sortedCaregivers.filter(checkAvailability);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" 
         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)' }}>
      <div className="min-h-screen backdrop-blur-sm bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Expert Pet Caregivers
            </motion.h1>
            <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
              Discover our trusted professionals dedicated to your pet's wellbeing
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search caregivers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Specialization Dropdown */}
              <div className="relative">
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full pl-3 pr-10 py-3 bg-white/80 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <FunnelIcon className="w-5 h-5 absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Availability Filter */}
              <div className="relative">
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full pl-3 pr-10 py-3 bg-white/80 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Availability</option>
                  <option value="available">Available Today</option>
                  <option value="week">Available This Week</option>
                </select>
                <CheckCircleIcon className="w-5 h-5 absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort Options */}
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full pl-3 pr-10 py-3 bg-white/80 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="experience-desc">Experience: High to Low</option>
                  <option value="experience-asc">Experience: Low to High</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                  <option value="rating-desc">Rating: High to Low</option>
                </select>
                <ScissorsIcon className="w-5 h-5 absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-center gap-3 text-red-700">
                <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-6 h-96" />
                ))}
              </div>
            ) : availableCaregivers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCaregivers.map((caregiver) => (
                  <motion.div 
                    key={caregiver._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
                  >
                    <div className="relative h-64 overflow-hidden">
                      {caregiver.profileImage ? (
                        <img 
                          src={caregiver.profileImage} 
                          alt={caregiver.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                      {caregiver.isNew && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                          New
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{caregiver.name}</h3>
                        <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                          <span className="text-yellow-700 text-sm font-medium">
                            ★ {caregiver.rating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                          <span className="font-medium">{caregiver.specialization}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ScissorsIcon className="w-5 h-5 text-purple-500" />
                          <span>{caregiver.experience} years experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <span>{caregiver.location || 'Remote'}</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button 
                          onClick={(e) => handleBookClick(caregiver, e)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-6 rounded-xl font-medium hover:shadow-lg transition-all"
                        >
                          Book Session
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-xl bg-gray-50/50">
                <div className="max-w-md mx-auto">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h3 className="mt-4 text-xl font-medium text-gray-900">No caregivers found</h3>
                  <p className="mt-2 text-gray-600">Try adjusting your search filters</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedSpecialization('');
                      setAvailabilityFilter('all');
                    }}
                    className="mt-6 px-6 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && selectedCaregiver && (
          <Dialog
            open={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <Dialog.Panel className="relative bg-white rounded-2xl p-8 max-w-xl w-full">
              <BookingModal
                caregiver={selectedCaregiver}
                onClose={() => setShowBookingModal(false)}
                onBookingSuccess={handleBookingSuccess}
              />
            </Dialog.Panel>
          </Dialog>
        )}

        {/* Success Toast */}
        {bookingSuccess && (
          <div className="fixed bottom-6 right-6 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            <span>Booking confirmed! Check your email for details</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaregiverCards;
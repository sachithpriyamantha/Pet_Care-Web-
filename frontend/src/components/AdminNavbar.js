import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link to="/admin/dashboard" className="text-white text-2xl font-extrabold tracking-tight">
              Admin Dashboard
            </Link>
            <div className="hidden md:flex items-center space-x-6">
            <Link
                to="/admin/dashboard"
                className="text-gray-200 hover:text-white transition-colors duration-300 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/admin/bookings"
                className="text-gray-200 hover:text-white transition-colors duration-300 text-sm font-medium"
              >
                Bookings
              </Link>
              <Link
                to="/admin/emergencies"
                className="text-gray-200 hover:text-white transition-colors duration-300 text-sm font-medium"
              >
                Emergencies
              </Link>
              <Link
                to="/products"
                className="text-gray-200 hover:text-white transition-colors duration-300 text-sm font-medium"
              >
                Products
              </Link>
              <Link
                to="/admin/payment"
                className="text-gray-200 hover:text-white transition-colors duration-300 text-sm font-medium"
              >
                Payments
              </Link>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-200 font-medium">{user?.username || 'Admin'}</span>
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
              <span className="text-gray-800 font-semibold text-lg">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 text-sm font-medium"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-200 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/admin/bookings"
                className="text-gray-200 hover:text-white transition-colors duration-300 text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                Bookings
              </Link>
              <Link
                to="/admin/caregivebooking"
                className="text-gray-200 hover:text-white transition-colors duration-300 text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                Caregiver Bookings
              </Link>
              <Link
                to="/admin/emergencies"
                className="text-gray-200 hover:text-white transition-colors duration-300 text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                Emergencies
              </Link>
              <Link
                to="/admin/caregiverform"
                className="text-gray-200 hover:text-white transition-colors duration-300 text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                Caregivers
              </Link>
              <Link
                to="/admin/trainingadmin"
                className="text-gray-200 hover:text-white transition-colors duration-300 text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                Trainers
              </Link>
              <Link
                to="/admin/pregnancyadmin"
                className="text-gray-200 hover:text-white transition-colors duration-300 text-sm font-medium py-2"
                onClick={toggleMobileMenu}
 PHAI              >
                Pregnant Pets
              </Link>
              <Link
                to="/products"
                className="text-gray-200 hover:text-white transition-colors duration-300 text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                Products
              </Link>
              <Link
                to="/admin/payment"
                className="text-gray-200 hover:text-white transition-colors duration-300 text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                Payments
              </Link>
              <div className="flex items-center space-x-4 py-2">
                <span className="text-gray-200 font-medium">{user?.username || 'Admin'}</span>
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
                  <span className="text-gray-800 font-semibold text-lg">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 text-sm font-medium text-left"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
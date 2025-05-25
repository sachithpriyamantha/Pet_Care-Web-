import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { 
  FiUser, FiMail, FiPhone, FiBriefcase, FiClock,
  FiEdit, FiTrash, FiPlus, FiX, FiAlertCircle,
  FiCheckCircle, FiUpload, FiSave
} from 'react-icons/fi';
import { ImSpinner8 } from 'react-icons/im';

const CaregiverForm = ({ caregiver, onSuccess }) => {
  const [formData, setFormData] = useState(caregiver || {
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    profileImage: null
  });
  const [previewImage, setPreviewImage] = useState(caregiver?.profileImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [caregivers, setCaregivers] = useState([]);
  const [isEditing, setIsEditing] = useState(!!caregiver);
  const [caregiverToEdit, setCaregiverToEdit] = useState(caregiver || null);
  const [loadingCaregivers, setLoadingCaregivers] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [caregiverToDelete, setCaregiverToDelete] = useState(null);

  useEffect(() => {
    fetchCaregivers();
  }, []);

  const fetchCaregivers = async () => {
    try {
      setLoadingCaregivers(true);
      const response = await axios.get('/api/caregivers');
      setCaregivers(response.data);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
      setError('Failed to fetch caregivers. Please refresh the page.');
    } finally {
      setLoadingCaregivers(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.name === 'experience' ? parseInt(e.target.value) || '' : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }
      setFormData({ ...formData, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      experience: '',
      profileImage: null
    });
    setPreviewImage(null);
    setIsEditing(false);
    setCaregiverToEdit(null);
  };

  const handleEditCaregiver = (caregiver) => {
    setFormData({
      name: caregiver.name,
      email: caregiver.email,
      phone: caregiver.phone,
      specialization: caregiver.specialization,
      experience: caregiver.experience,
      profileImage: null
    });
    setPreviewImage(caregiver.profileImage);
    setIsEditing(true);
    setCaregiverToEdit(caregiver);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteConfirmation = (caregiver) => {
    setCaregiverToDelete(caregiver);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!caregiverToDelete) return;
    
    try {
      setDeleteLoading(caregiverToDelete._id);
      await axios.delete(`/api/caregivers/${caregiverToDelete._id}`);
      await fetchCaregivers();
      setSuccessMessage('Caregiver deleted successfully!');
      
      if (caregiverToEdit?._id === caregiverToDelete._id) {
        resetForm();
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting caregiver:', error);
      setError('Failed to delete caregiver. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeleteLoading(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    }

    try {
      if (isEditing && caregiverToEdit?._id) {
        await axios.patch(`/api/caregivers/${caregiverToEdit._id}`, data);
        setSuccessMessage('Caregiver updated successfully!');
      } else {
        await axios.post('/api/caregivers', data);
        setSuccessMessage('Caregiver created successfully!');
        resetForm();
      }
      
      fetchCaregivers();
      if (typeof onSuccess === 'function') onSuccess();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'An error occurred while saving the caregiver');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setSuccessMessage('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" 
         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)' }}>
      <div className="min-h-screen backdrop-blur-sm bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8">
            {/* Caregiver Form Section */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 transition-all hover:shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Edit Caregiver' : 'New Caregiver Profile'}
                </h2>
                {isEditing && (
                  <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                )}
              </div>

              {(error || successMessage) && (
                <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${
                  error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                }`}>
                  {error ? (
                    <FiAlertCircle className="flex-shrink-0 w-6 h-6" />
                  ) : (
                    <FiCheckCircle className="flex-shrink-0 w-6 h-6" />
                  )}
                  <span>{error || successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 transition-colors cursor-pointer overflow-hidden">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-500 p-4">
                          <FiUpload className="w-12 h-12 mb-4" />
                          <p className="text-lg font-medium text-center">
                            Drag & drop or click to upload
                          </p>
                          <p className="text-sm">PNG, JPG (max 2MB)</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl peer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=" "
                        />
                        <label className="absolute top-3 left-4 px-1 text-gray-500 bg-white transition-all 
                          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600">
                          <span className="flex items-center gap-2">
                            <FiUser className="w-4 h-4" />
                            Full Name
                          </span>
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl peer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=" "
                        />
                        <label className="absolute top-3 left-4 px-1 text-gray-500 bg-white transition-all 
                          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600">
                          <span className="flex items-center gap-2">
                            <FiMail className="w-4 h-4" />
                            Email Address
                          </span>
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl peer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=" "
                        />
                        <label className="absolute top-3 left-4 px-1 text-gray-500 bg-white transition-all 
                          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600">
                          <span className="flex items-center gap-2">
                            <FiPhone className="w-4 h-4" />
                            Phone Number
                          </span>
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl peer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=" "
                        />
                        <label className="absolute top-3 left-4 px-1 text-gray-500 bg-white transition-all 
                          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600">
                          <span className="flex items-center gap-2">
                            <FiBriefcase className="w-4 h-4" />
                            Specialization
                          </span>
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          required
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl peer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=" "
                        />
                        <label className="absolute top-3 left-4 px-1 text-gray-500 bg-white transition-all 
                          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600">
                          <span className="flex items-center gap-2">
                            <FiClock className="w-4 h-4" />
                            Years of Experience
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg 
                          transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <ImSpinner8 className="animate-spin w-5 h-5" />
                        ) : (
                          <>
                            <FiSave className="w-5 h-5" />
                            {isEditing ? 'Update Profile' : 'Create Profile'}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Caregivers List Section */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Care Team Members</h2>
              
              {loadingCaregivers ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-6 h-48" />
                  ))}
                </div>
              ) : caregivers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">No caregivers found</div>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add the first caregiver →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {caregivers.map((caregiver) => (
                    <div key={caregiver._id} className="group bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {caregiver.profileImage ? (
                            <img 
                              src={caregiver.profileImage} 
                              alt={caregiver.name}
                              className="w-20 h-20 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center">
                              <FiUser className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{caregiver.name}</h3>
                          <div className="space-y-1.5 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <FiMail className="w-4 h-4" />
                              <span>{caregiver.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiPhone className="w-4 h-4" />
                              <span>{caregiver.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {caregiver.specialization}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiClock className="w-4 h-4" />
                                {caregiver.experience} years
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditCaregiver(caregiver)}
                              className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                            >
                              <FiEdit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteConfirmation(caregiver)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                            >
                              <FiTrash className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Dialog
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <Dialog.Panel className="relative bg-white rounded-2xl p-8 max-w-md w-full">
            <Dialog.Title className="text-2xl font-bold mb-4">
              Confirm Deletion
            </Dialog.Title>
            <Dialog.Description className="text-gray-600 mb-6">
              Are you sure you want to delete {caregiverToDelete?.name}? This action cannot be undone.
            </Dialog.Description>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400"
              >
                {deleteLoading ? (
                  <ImSpinner8 className="animate-spin inline-block mr-2" />
                ) : null}
                {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>
    </div>
  );
};

export default CaregiverForm;
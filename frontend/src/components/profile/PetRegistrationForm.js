import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PawPrint, Calendar, Camera, Tag, Weight, Heart, Cake, User, Droplet, Shield, Stethoscope, AlertTriangle, X } from 'lucide-react';
import axios from 'axios';

const PetRegistrationForm = () => {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age: '',
    weight: '',
    gender: 'male',
    color: '',
    microchipNumber: '',
    allergies: '',
    medicalConditions: '',
    dietaryRequirements: '',
    vetName: '',
    vetPhone: '',
    ownerName: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const backgroundImage = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const petFormData = new FormData();
      Object.keys(formData).forEach(key => {
        petFormData.append(key, formData[key]);
      });

      if (birthDate) petFormData.append('birthDate', birthDate);

      const response = await axios.post(
        'http://localhost:5000/api/pets',
        petFormData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data) {
        setShowAlert(true);
        
        setTimeout(() => {
          setShowAlert(false);
          navigate('/pets');
        }, 3000);
      }
    } catch (error) {
      console.error('Error registering pet:', error);
      alert('Failed to register pet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed py-12"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Alert Notification */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg flex items-center">
            <span className="flex-grow">Pet registered successfully! 🎉</span>
            <button
              onClick={() => setShowAlert(false)}
              className="ml-4 text-green-700 hover:text-green-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-2xl backdrop-blur-lg bg-opacity-90 border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Register Your Pet
          </h2>
          <p className="text-gray-500">Complete your pet's profile for personalized care</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Upload Section */}
            <div className="w-full lg:w-1/3">
              <div className="group relative h-72 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-purple-300 transition-all">
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <label
                  htmlFor="image"
                  className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-4"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Pet preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <div className="p-4 bg-white rounded-full shadow-lg mb-4">
                        <Camera className="w-8 h-8 text-purple-600" />
                      </div>
                      <p className="text-gray-500 text-center">
                        Drag & drop or <span className="text-purple-600">browse</span> pet photo
                      </p>
                      <span className="text-sm text-gray-400 mt-2">JPEG, PNG (Max 5MB)</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Basic Information */}
            <div className="w-full lg:w-2/3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Owner Name */}
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User className="w-5 h-5 mr-2 text-purple-600" />
                    Owner Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>

                {/* Pet Name */}
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <PawPrint className="w-5 h-5 mr-2 text-purple-600" />
                    Pet Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>

                {/* Species */}
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Tag className="w-5 h-5 mr-2 text-purple-600" />
                    Species
                  </label>
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    {['dog', 'cat', 'bird', 'fish', 'reptile', 'small_mammal', 'other'].map(option => (
                      <option key={option} value={option} className="capitalize">
                        {option.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Breed */}
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Shield className="w-5 h-5 mr-2 text-purple-600" />
                    Breed
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Heart className="w-5 h-5 mr-2 text-purple-600" />
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                {/* Birth Date */}
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Cake className="w-5 h-5 mr-2 text-purple-600" />
                    Birth Date
                  </label>
                  <DatePicker
                    selected={birthDate}
                    onChange={date => setBirthDate(date)}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    maxDate={new Date()}
                    placeholderText="Select birth date"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Weight */}
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Weight className="w-5 h-5 mr-2 text-purple-600" />
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>

                {/* Color */}
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Droplet className="w-5 h-5 mr-2 text-purple-600" />
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Health Information Section */}
          <div className="bg-blue-50 rounded-2xl p-6 space-y-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-blue-800">Health Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Allergies */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Allergies</label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  rows="3"
                  placeholder="List any known allergies..."
                />
              </div>

              {/* Medical Conditions */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                <textarea
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  rows="3"
                  placeholder="Any existing medical conditions..."
                />
              </div>

              {/* Dietary Requirements */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Dietary Requirements</label>
                <textarea
                  name="dietaryRequirements"
                  value={formData.dietaryRequirements}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  rows="3"
                  placeholder="Special dietary needs..."
                />
              </div>

              {/* Microchip Number */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Microchip #</label>
                <input
                  type="text"
                  name="microchipNumber"
                  value={formData.microchipNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Enter microchip number..."
                />
              </div>
            </div>
          </div>

          {/* Veterinary Information Section */}
          <div className="bg-purple-50 rounded-2xl p-6 space-y-6">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-purple-800">Veterinary Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Veterinarian Name</label>
                <input
                  type="text"
                  name="vetName"
                  value={formData.vetName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Dr. Smith"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Veterinarian Phone</label>
                <input
                  type="text"
                  name="vetPhone"
                  value={formData.vetPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 w-full md:w-auto"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering...</span>
                </div>
              ) : (
                'Complete Registration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetRegistrationForm;
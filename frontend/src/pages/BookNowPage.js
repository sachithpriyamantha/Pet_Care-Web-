import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { CheckCircleIcon, ScissorsIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';

const GroomingAppointmentPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const [appointment, setAppointment] = useState({
    petName: '',
    petType: 'dog',
    breed: '',
    ageGroup: 'adult',
    petSize: 'medium',
    services: [],
    preferredDate: new Date(),
    timeSlot: 'morning',
    urgency: 'routine',
    specialRequests: '',
    medicalInfo: ''
  });

  const servicesList = [
    'Bath & Blow Dry',
    'Haircut / Trimming',
    'Nail Clipping',
    'Ear Cleaning',
    'Teeth Brushing',
    'Flea/Tick Treatment',
    'Deshedding Treatment'
  ];

  const timeSlots = ['morning', 'afternoon', 'evening'];
  const backgroundImage = 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    try {
      const response = await axios.post('/api/bookings', {
        ...appointment,
        userId: user._id
      });

      if (response.status === 201) {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Appointment request failed');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-transparent-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Confirmed!</h2>
          <p className="text-gray-600">Your grooming session has been scheduled.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Success Alert */}
      <Transition
        show={showAlert}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed top-4 right-4 z-50"
      >
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow-lg flex items-center">
          <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
          <span className="text-green-800 flex-grow">Appointment booked successfully!</span>
          <button 
            onClick={() => setShowAlert(false)}
            className="ml-4 text-green-600 hover:text-green-800"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </Transition>

      <div className="relative max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <ScissorsIcon className="h-14 w-14 text-pink-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Premium Grooming Booking
            </h1>
            <p className="mt-2 text-gray-600">Pamper your pet with our luxury grooming experience</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg flex items-center">
              <XMarkIcon className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Pet Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Pet Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent py-3 px-4"
                  value={appointment.petName}
                  onChange={(e) => setAppointment({ ...appointment, petName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pet Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={appointment.petType}
                  onChange={(e) => setAppointment({ ...appointment, petType: e.target.value })}
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Breed</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={appointment.breed}
                  onChange={(e) => setAppointment({ ...appointment, breed: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Age Group</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={appointment.ageGroup}
                  onChange={(e) => setAppointment({ ...appointment, ageGroup: e.target.value })}
                >
                  <option value="puppy">Puppy</option>
                  <option value="adult">Adult</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pet Size</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={appointment.petSize}
                  onChange={(e) => setAppointment({ ...appointment, petSize: e.target.value })}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            {/* Grooming Services */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Select Services</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesList.map((service) => (
                  <label 
                    key={service} 
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      appointment.services.includes(service)
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={appointment.services.includes(service)}
                      onChange={(e) => {
                        const services = e.target.checked
                          ? [...appointment.services, service]
                          : appointment.services.filter(s => s !== service);
                        setAppointment({ ...appointment, services });
                      }}
                      className="h-5 w-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="ml-3 text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

             {/* Appointment Preferences */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
                <DatePicker
                  selected={appointment.preferredDate}
                  onChange={(date) => setAppointment({ ...appointment, preferredDate: date })}
                  minDate={new Date()}
                  className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent py-3 px-4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={appointment.timeSlot}
                  onChange={(e) => setAppointment({ ...appointment, timeSlot: e.target.value })}
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot.charAt(0).toUpperCase() + slot.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Urgency</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={appointment.urgency}
                  onChange={(e) => setAppointment({ ...appointment, urgency: e.target.value })}
                >
                  <option value="routine">Routine</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Special Instructions or Requests</label>
              <textarea
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={appointment.specialRequests}
                onChange={(e) => setAppointment({ ...appointment, specialRequests: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Allergies or Medical Conditions</label>
              <textarea
                rows="2"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={appointment.medicalInfo}
                onChange={(e) => setAppointment({ ...appointment, medicalInfo: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Confirm Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroomingAppointmentPage;

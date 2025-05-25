import React, { useState, useEffect } from "react";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaUserMd,
  FaAmbulance,
  FaFirstAid,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const EmergencyContactPage = () => {
  const [emergencyType, setEmergencyType] = useState("medical");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    petName: "",
    petType: "",
    emergencyDetails: "",
    contactNumber: "",
    location: "",
  });
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setIsAuthenticated(true);
        } else {
          const response = await axios.get("/api/auth/current-user", {
            withCredentials: true
          });
          if (response.data) {
            setIsAuthenticated(true);
            if (response.data.token) {
              localStorage.setItem('authToken', response.data.token);
            }
          }
        }
      } catch (error) {
        console.log("Not authenticated:", error);
        setIsAuthenticated(false);
      }
    };

    const loadEmergencyContacts = async () => {
      try {
        const response = await axios.get("/api/emergency-contacts");
        setEmergencyContacts(response.data);
      } catch (error) {
        console.error("Failed to load emergency contacts:", error);
        setMessage({
          text: "Failed to load emergency contacts. Please try again later.",
          type: "error"
        });
      }
    };

    checkAuth();
    loadEmergencyContacts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
  
    try {
      const response = await axios.post(
        "/api/emergency",
        {
          ...formData,
          emergencyType
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
  
      Swal.fire({
        icon: 'success',
        title: 'Request Submitted!',
        text: 'Emergency request submitted successfully! Help is on the way.',
      });
  
      setFormData({
        petName: "",
        petType: "",
        emergencyDetails: "",
        contactNumber: "",
        location: "",
      });
    } catch (error) {
      console.error("Error submitting emergency:", error);
  
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: error.response?.data?.message || "Failed to submit emergency request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const savedFormData = localStorage.getItem('emergencyFormData');
    const savedEmergencyType = localStorage.getItem('emergencyType');
    
    if (savedFormData && isAuthenticated) {
      setFormData(JSON.parse(savedFormData));
      if (savedEmergencyType) {
        setEmergencyType(savedEmergencyType);
      }
      

      localStorage.removeItem('emergencyFormData');
      localStorage.removeItem('emergencyType');
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="text-2xl" />
            <h1 className="text-xl md:text-2xl font-bold">
              PET EMERGENCY CONTACTS
            </h1>
          </div>
          <div className="hidden md:block">
            <p className="font-medium">
              For immediate assistance, call{" "}
              <span className="font-bold">(555) EMERGENCY</span>
            </p>
          </div>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Status Message */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message.type === "error" ? (
                <FaExclamationCircle className="flex-shrink-0" />
              ) : (
                <FaCheckCircle className="flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Emergency Tabs */}
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <div className="w-full md:w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gray-100 p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  Emergency Request Form
                </h2>
              </div>
              <div className="p-6">
                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setEmergencyType("medical")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                      emergencyType === "medical"
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <FaUserMd className="inline mr-2" /> Medical
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmergencyType("accident")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                      emergencyType === "accident"
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <FaAmbulance className="inline mr-2" /> Accident
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmergencyType("other")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                      emergencyType === "other"
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <FaExclamationTriangle className="inline mr-2" /> Other
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="petName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Pet's Name
                      </label>
                      <input
                        type="text"
                        id="petName"
                        name="petName"
                        value={formData.petName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="petType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Pet Type
                      </label>
                      <select
                        id="petType"
                        name="petType"
                        value={formData.petType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">Select pet type</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="emergencyDetails"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Emergency Details
                      </label>
                      <textarea
                        id="emergencyDetails"
                        name="emergencyDetails"
                        value={formData.emergencyDetails}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Describe the emergency situation..."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contactNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your Contact Number
                      </label>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="+1 (___) ___-____"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Location
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Enter your address or location"
                        />
                        <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2 ${
                          isSubmitting
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          isAuthenticated ? "Request Emergency Assistance" : "Login & Submit Request"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="w-full md:w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gray-100 p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  Emergency Contacts
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {emergencyContacts.length > 0 ? (
                    emergencyContacts.map((contact, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="bg-red-100 p-3 rounded-full">
                            {contact.type.includes("Poison") ? (
                              <FaExclamationTriangle className="text-red-600 text-xl" />
                            ) : contact.type.includes("First Aid") ? (
                              <FaFirstAid className="text-red-600 text-xl" />
                            ) : contact.type.includes("Ambulance") ? (
                              <FaAmbulance className="text-red-600 text-xl" />
                            ) : (
                              <FaUserMd className="text-red-600 text-xl" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">
                              {contact.type}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <FaPhone className="text-red-600" />
                              <a
                                href={`tel:${contact.phone}`}
                                className="text-red-600 font-medium hover:underline"
                              >
                                {contact.phone}
                              </a>
                            </div>
                            <p className="text-gray-600 mt-1">
                              {contact.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Loading emergency contacts...
                    </div>
                  )}
                </div>

                {/* Emergency Tips */}
                <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    Emergency First Aid Tips
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Stay calm and assess the situation</li>
                    <li>Keep your pet warm and quiet</li>
                    <li>Don't give human medication unless instructed</li>
                    <li>
                      If poisoned, bring the substance container if possible
                    </li>
                    <li>
                      For bleeding, apply gentle pressure with clean cloth
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Clinics Map */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
            <div className="bg-gray-100 p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Nearby Emergency Clinics
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FaMapMarkerAlt className="mx-auto text-4xl text-red-500 mb-2" />
                  <p className="text-gray-600">
                    Map of nearby emergency veterinary clinics would display here
                  </p>
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    View Full Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactPage;
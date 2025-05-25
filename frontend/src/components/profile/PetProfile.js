
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PawPrint, Calendar, Weight, Heart, Cake, Tag, AlertCircle, Utensils, Phone } from 'lucide-react';
import axios from 'axios';

const PetProfile = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/pets/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPet(response.data);
      } catch (err) {
        console.error('Error fetching pet:', err);
        setError('Failed to load pet information');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Unknown';
    
    const birth = new Date(birthDate);
    const now = new Date();
    
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }
    
    if (years === 0) {
      return `${months} months`;
    } else if (months === 0) {
      return `${years} years`;
    } else {
      return `${years} years, ${months} months`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/pets/register" className="text-purple-600 hover:underline">Register a new pet</Link>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">Pet not found</p>
        <Link to="/pets/register" className="text-purple-600 hover:underline">Register a new pet</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Top Banner */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500"></div>
          <div className="absolute bottom-0 transform translate-y-1/2 left-6 md:left-10 border-4 border-white rounded-full shadow-lg">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-full overflow-hidden">
              {pet.image ? (
                <img 
                  src={`http://localhost:5000/${pet.image}`} 
                  alt={pet.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-100">
                  <PawPrint className="w-12 h-12 text-purple-500" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="pt-16 md:pt-20 px-6 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
              <div className="flex items-center mt-1 text-gray-600">
                <Tag className="w-4 h-4 mr-1" />
                <span className="capitalize">{pet.species}</span>
                {pet.breed && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{pet.breed}</span>
                  </>
                )}
              </div>
            </div>
            
            <Link 
              to={`/pets/${pet._id}/edit`}
              className="mt-4 md:mt-0 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Edit Profile
            </Link>
          </div>
          
          {/* Pet Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center text-purple-600">
                <Cake className="w-5 h-5 mr-2" />
                <span className="font-medium">Age</span>
              </div>
              <p className="mt-1 text-gray-700">
                {pet.birthDate ? calculateAge(pet.birthDate) : 'Not specified'}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center text-purple-600">
                <Weight className="w-5 h-5 mr-2" />
                <span className="font-medium">Weight</span>
              </div>
              <p className="mt-1 text-gray-700">
                {pet.weight ? `${pet.weight} kg` : 'Not specified'}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center text-purple-600">
                <Heart className="w-5 h-5 mr-2" />
                <span className="font-medium">Gender</span>
              </div>
              <p className="mt-1 text-gray-700 capitalize">
                {pet.gender || 'Not specified'}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center text-purple-600">
                <PawPrint className="w-5 h-5 mr-2" />
                <span className="font-medium">Color</span>
              </div>
              <p className="mt-1 text-gray-700">
                {pet.color || 'Not specified'}
              </p>
            </div>
          </div>
          
          {/* Health Information */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Health Information</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center text-purple-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Allergies</span>
                </div>
                <p className="mt-1 text-gray-700">
                  {pet.allergies || 'None reported'}
                </p>
              </div>
              
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center text-purple-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Medical Conditions</span>
                </div>
                <p className="mt-1 text-gray-700">
                  {pet.medicalConditions || 'None reported'}
                </p>
              </div>
              
              <div className="p-4">
                <div className="flex items-center text-purple-600">
                  <Utensils className="w-5 h-5 mr-2" />
                  <span className="font-medium">Dietary Requirements</span>
                </div>
                <p className="mt-1 text-gray-700">
                  {pet.dietaryRequirements || 'None reported'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Veterinary Information */}
          {(pet.vetName || pet.vetPhone) && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">Veterinary Information</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                {pet.vetName && (
                  <div className="mb-3">
                    <div className="font-medium text-gray-700">Veterinarian</div>
                    <p className="text-gray-700">{pet.vetName}</p>
                  </div>
                )}
                
                {pet.vetPhone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-purple-600" />
                    <p className="text-gray-700">{pet.vetPhone}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetProfile;
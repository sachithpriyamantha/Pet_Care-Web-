import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusCircle,
  PawPrint,
  Search,
  Tag,
  Heart,
  Cake,
  Trash2,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPets();
  }, [user]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/pets", {
        withCredentials: true,
      });

      if (user) {
        const userPets = response.data.filter(
          (pet) => pet.ownerName === user.username
        );
        setPets(userPets);
      } else {
        setPets([]);
      }
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError("Failed to load your pets");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (e, petId, petName) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete ${petName}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/pets/${petId}`, {
          withCredentials: true,
        });

        Swal.fire({
          title: "Deleted!",
          text: `${petName} has been removed.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchPets();
      } catch (error) {
        console.error("Error deleting pet:", error);

        Swal.fire({
          title: "Error!",
          text: "Failed to delete pet. Please try again.",
          icon: "error",
          confirmButtonColor: "#9333ea",
        });
      }
    }
  };

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Link to="/pets/register" className="text-purple-600 hover:underline">
          Register a new pet
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-amber-600 mb-4">Please log in to view your pets</p>
        <Link to="/login" className="text-purple-600 hover:underline">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-4 md:mb-0">
          Your Pets
        </h1>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search pets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <Link
            to="/pets/register"
            className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Pet
          </Link>
        </div>
      </div>

      {pets.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
            <PawPrint className="h-10 w-10 text-purple-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No pets registered yet
          </h3>
          <p className="mt-2 text-gray-500">
            Start by adding your first pet to your profile.
          </p>
          <div className="mt-6">
            <Link
              to="/pets/register"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Register Your Pet
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <div
              key={pet._id}
              className="relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-transform hover:shadow-md"
            >
              <Link to={`/pets/${pet._id}`} className="block h-full">
                <div className="h-48 bg-gray-200 relative">
                  {pet.image ? (
                    <img
                      src={`http://localhost:5000/${pet.image}`}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image load error:", pet.image);
                        e.target.onerror = null;
                        e.target.src = "";
                        e.target.parentNode.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-purple-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 text-purple-300">
                              <path d="M2 12c0 3.31 2.69 6 6 6 5.4 0 5.4-8 10.8-8 3.31 0 6 2.69 6 6"></path>
                              <path d="M5 3c1.1 1.66 1.1 3.34 0 5"></path>
                              <path d="M19 21c1.1-1.66 1.1-3.34 0-5"></path>
                            </svg>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-100">
                      <PawPrint className="w-16 h-16 text-purple-300" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h2 className="text-xl font-bold text-white">{pet.name}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-purple-600" />
                      <span className="capitalize text-gray-700">
                        {pet.species}
                      </span>
                    </div>
                    {pet.breed && (
                      <span className="text-gray-500 text-sm">{pet.breed}</span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <Heart className="w-4 h-4 mr-2 text-pink-500" />
                    <span className="capitalize">
                      {pet.gender || "Unknown"}
                    </span>

                    {pet.birthDate && (
                      <>
                        <span className="mx-2">•</span>
                        <Cake className="w-4 h-4 mr-1" />
                        <span>
                          {new Date(pet.birthDate).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>

              {/* Delete button */}
              <button
                onClick={(e) => handleDeletePet(e, pet._id, pet.name)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                title="Delete pet"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetList;

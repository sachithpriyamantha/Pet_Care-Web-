import React, { useState, useEffect } from "react";
import {
  FaSyringe,
  FaBell,
  FaCalendarAlt,
  FaPlus,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { MdPets } from "react-icons/md";

const VaccinationPage = () => {
  const [pets, setPets] = useState([
    { id: 1, name: "Max", type: "Dog", breed: "Golden Retriever" },
    { id: 2, name: "Luna", type: "Cat", breed: "Siamese" },
  ]);

  const [selectedPet, setSelectedPet] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVaccination, setNewVaccination] = useState({
    name: "",
    date: "",
    nextDueDate: "",
    notes: "",
  });


  useEffect(() => {
    if (selectedPet) {
      const sampleData = {
        1: [
          {
            id: 1,
            name: "Rabies",
            date: "2023-01-15",
            nextDueDate: "2024-01-15",
            administeredBy: "Dr. Smith",
          },
          {
            id: 2,
            name: "Distemper",
            date: "2023-03-20",
            nextDueDate: "2024-03-20",
            administeredBy: "Dr. Johnson",
          },
        ],
        2: [
          {
            id: 3,
            name: "Feline Leukemia",
            date: "2023-02-10",
            nextDueDate: "2024-02-10",
            administeredBy: "Dr. Wilson",
          },
        ],
      };
      setVaccinations(sampleData[selectedPet.id] || []);
    }
  }, [selectedPet]);

  const handleAddVaccination = () => {
    if (newVaccination.name && newVaccination.date) {
      setVaccinations([
        ...vaccinations,
        {
          ...newVaccination,
          id: vaccinations.length + 1,
          administeredBy: "You",
        },
      ]);
      setNewVaccination({ name: "", date: "", nextDueDate: "", notes: "" });
      setIsModalOpen(false);
    }
  };

  const deleteVaccination = (id) => {
    setVaccinations(vaccinations.filter((vaccine) => vaccine.id !== id));
  };

  const upcomingVaccinations = vaccinations.filter((vaccine) => {
    const dueDate = new Date(vaccine.nextDueDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return dueDate <= thirtyDaysFromNow && dueDate >= today;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FaSyringe className="text-3xl text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Vaccination Tracker
          </h1>
        </div>

        {/* Pet Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MdPets className="text-blue-500" /> Select Pet
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => setSelectedPet(pet)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPet?.id === pet.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <h3 className="font-bold text-lg">{pet.name}</h3>
                <p className="text-gray-600">
                  {pet.breed} {pet.type}
                </p>
              </div>
            ))}
          </div>
        </div>

        {selectedPet ? (
          <div className="space-y-8">
            {/* Upcoming Vaccinations */}
            {upcomingVaccinations.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaBell className="text-yellow-600" /> Upcoming Vaccinations
                </h2>
                <div className="space-y-4">
                  {upcomingVaccinations.map((vaccine) => (
                    <div
                      key={vaccine.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-yellow-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{vaccine.name}</h3>
                          <p className="text-gray-600">
                            Due:{" "}
                            {new Date(vaccine.nextDueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vaccination Records */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">Vaccination Records</h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FaPlus /> Add Record
                </button>
              </div>

              {vaccinations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vaccine
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Next Due
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Administered By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vaccinations.map((vaccine) => (
                        <tr key={vaccine.id}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {vaccine.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(vaccine.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {new Date(
                                vaccine.nextDueDate
                              ).toLocaleDateString()}
                              {new Date(vaccine.nextDueDate) < new Date() && (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                  Overdue
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {vaccine.administeredBy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-blue-600 hover:text-blue-800 mr-3">
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteVaccination(vaccine.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No vaccination records found for {selectedPet.name}.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FaSyringe className="text-5xl mx-auto" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              Select a pet to view vaccination records
            </h3>
            <p className="text-gray-500">
              Choose from your registered pets above
            </p>
          </div>
        )}
      </div>

      {/* Add Vaccination Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">Add Vaccination Record</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vaccine Name*
                </label>
                <input
                  type="text"
                  value={newVaccination.name}
                  onChange={(e) =>
                    setNewVaccination({
                      ...newVaccination,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Rabies, Distemper"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Administered*
                </label>
                <input
                  type="date"
                  value={newVaccination.date}
                  onChange={(e) =>
                    setNewVaccination({
                      ...newVaccination,
                      date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Due Date
                </label>
                <input
                  type="date"
                  value={newVaccination.nextDueDate}
                  onChange={(e) =>
                    setNewVaccination({
                      ...newVaccination,
                      nextDueDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newVaccination.notes}
                  onChange={(e) =>
                    setNewVaccination({
                      ...newVaccination,
                      notes: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Any additional notes..."
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVaccination}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationPage;

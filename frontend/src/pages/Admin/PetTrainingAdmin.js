import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ImSpinner8 } from "react-icons/im";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const PetTrainingAdmin = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPrograms = async () => {
    try {
      const res = await axios.get("/api/training");
      setPrograms(res.data);
    } catch (err) {
      setError("Failed to load training programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleDelete = async (id, title) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${title}" training program. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/training/${id}`);

          fetchPrograms();

          Swal.fire(
            "Deleted!",
            "The training program has been deleted.",
            "success"
          );
        } catch (err) {
          Swal.fire("Error!", "Failed to delete training program.", "error");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <ImSpinner8 className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba')",
      }}
    >
      <div className="max-w-6xl mx-auto p-6 bg-white bg-opacity-50 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Pet Training Programs</h1>
          <Link
            to="/admin/trainingform"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
          >
            <span className="mr-1">+</span> Add New Training
          </Link>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div
              key={program._id}
              className="bg-white p-6 rounded-xl shadow-lg relative"
            >
              {/* Delete button */}
              <button
                onClick={() => handleDelete(program._id, program.title)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors duration-200"
                aria-label="Delete program"
              >
                <FaTrash />
              </button>

              <h3 className="text-xl font-bold mb-2">{program.title}</h3>
              <p className="text-gray-600 mb-4">{program.description}</p>
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {program.difficulty}
                </span>
                <div className="text-right">
                  <p className="text-lg font-bold">${program.price}</p>
                  <p className="text-sm text-gray-600">{program.duration}</p>
                </div>
              </div>

              {/* Video display section */}
              {program.videos && program.videos.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Training Videos:</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {program.videos.map((video, index) => {
                      const filename = video.path.split(/[\\/]/).pop();
                      return (
                        <div key={index} className="bg-gray-100 p-3 rounded-lg">
                          <video controls className="w-full rounded-lg">
                            <source
                              src={`/uploads/videos/${filename}`}
                              type={video.mimetype}
                            />
                            Your browser does not support the video tag.
                          </video>
                          <p className="mt-2 text-sm">{video.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PetTrainingAdmin;

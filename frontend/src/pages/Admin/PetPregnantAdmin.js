import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { 
  ImSpinner8,
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiAlertTriangle,
  FiCheckCircle,
  FiCalendar,
  FiClipboard
} from 'react-icons/fi';

const PetPregnantAdmin = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/pregnancy');
      setPrograms(res.data);
    } catch (err) {
      setError('Failed to load pregnancy programs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrograms(); }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/pregnancy/${id}`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchPrograms();
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete the program');
    }
  };

  const TrimesterProgress = ({ trimester }) => {
    const progress = Math.min((trimester / 3) * 100, 100);
    return (
      <div className="relative pt-2">
        <div className="flex justify-between text-sm font-medium mb-1">
          <span>Trimester {trimester}</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-600 transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" 
         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)' }}>
      <div className="min-h-screen backdrop-blur-sm bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FiClipboard className="w-8 h-8 text-purple-600" />
                  Pregnancy Care Programs
                </h1>
                <Link
                  to="/admin/pregnancyform"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <FiPlus className="w-5 h-5" />
                  Add New Program
                </Link>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-center gap-3 text-red-700">
                  <FiAlertTriangle className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-6 h-64" />
                  ))}
                </div>
              ) : programs.length === 0 ? (
                <div className="text-center py-12 rounded-xl bg-gray-50">
                  <FiAlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No pregnancy programs found</p>
                  <Link
                    to="/admin/pregnancyform"
                    className="inline-block px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    Create First Program
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {programs.map((program) => (
                    <div key={program._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow relative">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/pregnancy/${program._id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <FiEdit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setSelectedProgram(program)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                          {program.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-3">{program.description}</p>
                        
                        <div className="space-y-4">
                          <TrimesterProgress trimester={program.trimester} />
                          
                          <div className="flex items-center gap-3 text-gray-600">
                            <FiCalendar className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium">{program.duration}</span>
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
          open={!!selectedProgram}
          onClose={() => setSelectedProgram(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <Dialog.Panel className="relative bg-white rounded-2xl p-8 max-w-md w-full">
            <Dialog.Title className="text-2xl font-bold mb-4">
              Delete Program
            </Dialog.Title>
            <Dialog.Description className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedProgram?.title}"? This action cannot be undone.
            </Dialog.Description>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedProgram?._id);
                  setSelectedProgram(null);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                Confirm Delete
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-50 text-green-700 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in">
            <FiCheckCircle className="w-5 h-5" />
            Program deleted successfully
          </div>
        )}
      </div>
    </div>
  );
};

export default PetPregnantAdmin;
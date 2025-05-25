import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiSave,
  FiX,
  FiBook,
  FiFileText,
  FiCalendar,
  FiClock,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';
import { ImSpinner8 } from 'react-icons/im';

const PregnancyProgramForm = ({ onSuccess }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trimester: 'first',
    duration: '4 weeks'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchProgram = async () => {
        try {
          const res = await axios.get(`/api/pregnancy/${id}`);
          setFormData(res.data);
        } catch (err) {
          setError('Failed to load program data');
        } finally {
          setIsFetching(false);
        }
      };
      fetchProgram();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (id) {
        await axios.put(`/api/pregnancy/${id}`, formData);
        setSuccessMessage('Program updated successfully!');
      } else {
        await axios.post('/api/pregnancy', formData);
        setSuccessMessage('Program created successfully!');
      }
      
      setTimeout(() => {
        onSuccess?.();
        navigate('/admin/pregnancy');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving program');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ImSpinner8 className="animate-spin text-4xl text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" 
         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)' }}>
      <div className="min-h-screen backdrop-blur-sm bg-black/30 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-2xl">
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {id ? 'Edit Program' : 'New Pregnancy Program'}
              </h2>
              <button 
                onClick={() => navigate('/admin/pregnancy')} 
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {(error || successMessage) && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
              }`}>
                {error ? <FiAlertCircle /> : <FiCheckCircle />}
                <span>{error || successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl peer focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder=" "
                />
                <label className="absolute top-3 left-4 px-1 text-gray-500 bg-white transition-all 
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                  peer-focus:-top-2 peer-focus:text-sm peer-focus:text-purple-600 flex items-center gap-2">
                  <FiBook className="w-4 h-4" />
                  Title *
                </label>
              </div>

              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl h-32 peer focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder=" "
                />
                <label className="absolute top-3 left-4 px-1 text-gray-500 bg-white transition-all 
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                  peer-focus:-top-2 peer-focus:text-sm peer-focus:text-purple-600 flex items-center gap-2">
                  <FiFileText className="w-4 h-4" />
                  Description *
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <select
                    name="trimester"
                    value={formData.trimester}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl appearance-none peer focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="first">First Trimester</option>
                    <option value="second">Second Trimester</option>
                    <option value="third">Third Trimester</option>
                  </select>
                  <label className="absolute top-3 left-4 px-1 text-gray-500 bg-white transition-all 
                    peer-focus:-top-2 peer-focus:text-sm peer-focus:text-purple-600 flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    Trimester *
                  </label>
                  <div className="pointer-events-none absolute right-4 top-4">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl appearance-none peer focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="4 weeks">4 Weeks Program</option>
                    <option value="8 weeks">8 Weeks Program</option>
                    <option value="12 weeks">12 Weeks Program</option>
                  </select>
                  <label className="absolute top-3 left-4 px-1 text-gray-500 bg-white transition-all 
                    peer-focus:-top-2 peer-focus:text-sm peer-focus:text-purple-600 flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    Duration *
                  </label>
                  <div className="pointer-events-none absolute right-4 top-4">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium 
                    hover:shadow-lg transition-all flex items-center justify-center gap-2
                    disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <ImSpinner8 className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      <FiSave className="w-5 h-5" />
                      {id ? 'Update Program' : 'Create Program'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PregnancyProgramForm;
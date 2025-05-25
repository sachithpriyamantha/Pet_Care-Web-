import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ImSpinner8 } from 'react-icons/im';
import { FiAlertTriangle, FiCalendar, FiClock } from 'react-icons/fi';

const PregnancyProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get('/api/pregnancy');
        setPrograms(res.data);
      } catch (err) {
        setError('Failed to load pregnancy programs');
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const TrimesterProgress = ({ trimester }) => {
    const progress = Math.min((trimester / 3) * 100, 100);
    return (
      <div className="relative pt-2">
        <div className="flex justify-between text-sm font-medium mb-1">
          <span className="capitalize">Trimester {trimester}</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500" 
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
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FiCalendar className="w-8 h-8 text-purple-600" />
                Pregnancy Care Programs
              </h1>
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
                  <p className="text-gray-500">No pregnancy programs available at the moment</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {programs.map((program) => (
                    <div key={program._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                          {program.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-3">{program.description}</p>
                        
                        <TrimesterProgress trimester={program.trimester} />
                        
                        <div className="flex items-center gap-3 text-gray-600">
                          <FiClock className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-medium">{program.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PregnancyProgramPage;
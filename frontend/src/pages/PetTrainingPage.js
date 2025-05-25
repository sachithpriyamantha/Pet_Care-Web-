import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ImSpinner8 } from 'react-icons/im';

const PetTrainingPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get('/api/training');
        setPrograms(res.data);
      } catch (err) {
        setError('Failed to load training programs');
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <ImSpinner8 className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Pet Training Programs</h1>
      
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program._id} className="bg-white p-6 rounded-xl shadow-lg">
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
  );
};

export default PetTrainingPage;
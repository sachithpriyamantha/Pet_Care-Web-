import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ImSpinner8 } from 'react-icons/im';
import { FiSave, FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

const TrainingProgramForm = ({ program, onSuccess }) => {
  const [formData, setFormData] = useState(program || {
    title: '',
    description: '',
    duration: '',
    difficulty: 'beginner',
    videos: []
  });
  const [newVideos, setNewVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 2);
    setNewVideos(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files)
      .filter(file => file.type.startsWith('video/'))
      .slice(0, 2);
    setNewVideos(files);
  };

  const removeVideo = (index) => {
    setNewVideos(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('difficulty', formData.difficulty);
      
      if (formData.videos && formData.videos.length > 0) {
        formDataToSend.append('existingVideos', JSON.stringify(formData.videos));
      }
      
      newVideos.forEach((video) => {
        formDataToSend.append('videos', video);
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };

      if (program?._id) {
        await axios.put(`/api/training/${program._id}`, formDataToSend, config);
      } else {
        await axios.post('/api/training', formDataToSend, config);
      }
      
      onSuccess?.();
      navigate('/admin/trainingadmin');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving program');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">
                {program?._id ? 'Edit Program' : 'New Training Program'}
              </h2>
              <button
                onClick={() => navigate('/admin/training')}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200 text-white"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-100"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg h-32 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Duration</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    required
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="" className="bg-gray-800">Select duration</option>
                    <option value="4 weeks" className="bg-gray-800">4 weeks</option>
                    <option value="6 weeks" className="bg-gray-800">6 weeks</option>
                    <option value="8 weeks" className="bg-gray-800">8 weeks</option>
                    <option value="12 weeks" className="bg-gray-800">12 weeks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="beginner" className="bg-gray-800">Beginner</option>
                    <option value="intermediate" className="bg-gray-800">Intermediate</option>
                    <option value="advanced" className="bg-gray-800">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Training Videos (Max 2)</label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`mt-2 flex justify-center px-6 pt-10 pb-12 border-2 border-dashed rounded-xl transition-all duration-200 ${
                    isDragging 
                      ? 'border-blue-400 bg-blue-500/10' 
                      : 'border-white/30 hover:border-white/50'
                  }`}
                >
                  <div className="space-y-3 text-center">
                    <FiUpload className={`mx-auto h-10 w-10 ${
                      isDragging ? 'text-blue-400' : 'text-white/50'
                    } transition-colors duration-200`} />
                    <div className="flex flex-col sm:flex-row text-sm text-white/70 justify-center items-center space-y-2 sm:space-y-0 sm:space-x-1">
                      <label
                        htmlFor="videos"
                        className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none transition-colors duration-200"
                      >
                        <span>Click to upload videos</span>
                        <input
                          id="videos"
                          name="videos"
                          type="file"
                          multiple
                          accept="video/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="text-white/60">or drag and drop</p>
                    </div>
                    <p className="text-xs text-white/50">
                      MP4, MOV, AVI up to 100MB each
                    </p>
                  </div>
                </div>

                {/* Display existing videos */}
                {formData.videos?.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6"
                  >
                    <h4 className="text-sm font-medium mb-3 text-white/80">Current Videos:</h4>
                    <ul className="space-y-3">
                      {formData.videos.map((video, index) => (
                        <motion.li 
                          key={`existing-${index}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10"
                        >
                          <span className="text-sm text-white/90 truncate">{video.name}</span>
                          <button
                            type="button"
                            onClick={() => removeExistingVideo(index)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                          >
                            <FiTrash2 />
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Display newly selected videos */}
                {newVideos.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6"
                  >
                    <h4 className="text-sm font-medium mb-3 text-white/80">New Videos to Upload:</h4>
                    <ul className="space-y-3">
                      {newVideos.map((video, index) => (
                        <motion.li 
                          key={`new-${index}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between bg-blue-500/10 p-3 rounded-lg border border-blue-500/20"
                        >
                          <span className="text-sm text-white/90 truncate">
                            {video.name} ({(video.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                          <button
                            type="button"
                            onClick={() => removeVideo(index)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                          >
                            <FiTrash2 />
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className={`w-full px-6 py-3 rounded-xl flex items-center gap-2 justify-center ${
                  isLoading 
                    ? 'bg-blue-600/70 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400'
                } text-white font-medium shadow-lg transition-all duration-200`}
              >
                {isLoading ? (
                  <ImSpinner8 className="animate-spin" />
                ) : (
                  <FiSave className="w-5 h-5" />
                )}
                Save Program
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrainingProgramForm;
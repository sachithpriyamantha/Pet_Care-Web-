import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ImSpinner8 } from 'react-icons/im';
import { FiSave, FiX, FiUpload, FiTrash2 } from 'react-icons/fi';

const TrainingProgramForm = ({ program, onSuccess }) => {
  const [formData, setFormData] = useState(program || {
    title: '',
    description: '',
    duration: '',
    price: '',
    difficulty: 'beginner',
    videos: []
  });
  const [newVideos, setNewVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 2); 
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
      formDataToSend.append('price', formData.price);
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {program?._id ? 'Edit Program' : 'New Training Program'}
        </h2>
        <button
          onClick={() => navigate('/admin/trainingadmin')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            className="w-full p-2 border rounded-lg h-32"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              required
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select duration</option>
              <option value="4 weeks">4 weeks</option>
              <option value="6 weeks">6 weeks</option>
              <option value="8 weeks">8 weeks</option>
              <option value="12 weeks">12 weeks</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
              min="0"
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
            className="w-full p-2 border rounded-lg"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Training Videos (Max 2)</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="videos"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload videos</span>
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
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                MP4, MOV, AVI up to 100MB each
              </p>
            </div>
          </div>

          {/* Display existing videos */}
          {formData.videos?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Current Videos:</h4>
              <ul className="space-y-2">
                {formData.videos.map((video, index) => (
                  <li key={`existing-${index}`} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm truncate">{video.name}</span>
                    <button
                      type="button"
                      onClick={() => removeExistingVideo(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Display newly selected videos */}
          {newVideos.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">New Videos to Upload:</h4>
              <ul className="space-y-2">
                {newVideos.map((video, index) => (
                  <li key={`new-${index}`} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                    <span className="text-sm truncate">
                      {video.name} ({(video.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 justify-center w-full"
        >
          {isLoading ? <ImSpinner8 className="animate-spin" /> : <FiSave />}
          Save Program
        </button>
      </form>
    </div>
  );
};

export default TrainingProgramForm;
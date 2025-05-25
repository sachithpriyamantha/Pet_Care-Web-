import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ReplyList from './ReplyList';
import { MessageSquare, Send, Edit, Trash2, Image, X} from 'lucide-react';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);


  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setCurrentUser(res.data);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/community/posts');
      setPosts(res.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreate = async () => {
    if (!content.trim() && !selectedImage) return;
    
    setIsLoading(true);
    try {

      const formData = new FormData();
      formData.append('content', content);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      await axios.post('/api/community/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setContent('');
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await axios.delete(`/api/community/posts/${postId}`);

      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const startEditing = (post) => {
    setEditingPost(post._id);
    setEditContent(post.content);
  };

  const cancelEditing = () => {
    setEditingPost(null);
    setEditContent('');
  };

  const saveEdit = async (postId) => {
    if (!editContent.trim()) return;
    
    try {
      await axios.put(`/api/community/posts/${postId}`, { content: editContent });

      setPosts(posts.map(post => 
        post._id === postId ? { ...post, content: editContent } : post
      ));
      setEditingPost(null);
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
  }, []);


  const isPostOwner = (post) => {
    return currentUser && post.user._id === currentUser._id;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-blue-800">Pet Community</h2>
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
            S
          </div>
        </div>
      </div>
      
      {/* Create Post Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100 transition-all hover:shadow-xl">
        <div className="flex space-x-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            S
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something about your pet!"
            className="flex-1 p-3 bg-blue-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none text-gray-700 placeholder-blue-300"
          />
        </div>
        
        {/* Image preview area */}
        {imagePreview && (
          <div className="relative mb-4 ml-12">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="h-48 rounded-xl object-cover shadow-sm" 
            />
            <button 
              onClick={removeSelectedImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        <div className="flex justify-between items-center ml-12">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              ref={fileInputRef}
              id="image-upload"
            />
            <label 
              htmlFor="image-upload"
              className="cursor-pointer flex items-center text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 py-2 px-3 rounded-lg"
            >
              <Image size={18} className="mr-2" />
              <span className="text-sm font-medium">Add Photo</span>
            </label>
          </div>
          
          <button 
            onClick={handleCreate}
            disabled={isLoading || (!content.trim() && !selectedImage)}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-all disabled:bg-blue-300 disabled:shadow-none"
          >
            <Send size={16} className="mr-2" />
            Share Post
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      {isLoading && posts.length === 0 ? (
        <div className="flex justify-center my-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-blue-600">Loading community posts...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post._id} className="bg-white rounded-2xl shadow-md p-6 transition-all hover:shadow-lg border border-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {post.user.username.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-800">{post.user.username}</h4>
                    <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
                
                {/* Only show edit/delete buttons for post owner */}
                {isPostOwner(post) && (
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => startEditing(post)} 
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-full"
                      title="Edit post"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(post._id)} 
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors hover:bg-red-50 rounded-full"
                      title="Delete post"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {editingPost === post._id ? (
                <div className="mb-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-3 bg-blue-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none text-gray-700 mb-3"
                  />
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={cancelEditing}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => saveEdit(post._id)}
                      className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
              )}
              
              {post.image && (
                <div className="mb-4">
                  <img src={post.image} alt="Post image" className="rounded-xl w-full h-auto shadow-sm" />
                </div>
              )}
              
              
              
              <ReplyList postId={post._id} />
            </div>
          ))}

          {posts.length === 0 && !isLoading && (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-4">
                  <MessageSquare size={32} />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-6">Be the first to share something with the community!</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-all">
                  Create First Post
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>

  );
}
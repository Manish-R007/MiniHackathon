import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { issuesAPI } from '../../services/api';
import { BUILDINGS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const IssueForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: {
      building: '',
      room: '',
      floor: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [characterAnim, setCharacterAnim] = useState({ title: 0, description: 0 });
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Intersection Observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Character counter animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setCharacterAnim({
        title: formData.title.length,
        description: formData.description.length
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [formData.title.length, formData.description.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.building.trim()) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (formData.title.length > 100) {
      setError('Title must be less than 100 characters');
      setIsLoading(false);
      return;
    }

    if (formData.description.length > 500) {
      setError('Description must be less than 500 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await issuesAPI.create(formData);
      
      if (response.data.success) {
        setSuccess('Issue reported successfully! It has been automatically categorized and assigned.');
        setFormData({
          title: '',
          description: '',
          location: {
            building: '',
            room: '',
            floor: ''
          }
        });
        
        // Redirect to my issues after 2 seconds
        setTimeout(() => {
          navigate('/my-issues');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to report issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'from-red-500 to-pink-600';
    if (percentage >= 75) return 'from-orange-500 to-red-500';
    if (percentage >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-500';
  };

  return (
    <div 
      ref={formRef}
      className={`min-h-screen py-8 px-4 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Enhanced Main Card */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-500">
          
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full translate-x-1/2 translate-y-1/2 opacity-20 animate-pulse animation-delay-2000"></div>
          
          {/* Glass Effect Container */}
          <div className="relative glass-effect border border-white/20 rounded-3xl overflow-hidden backdrop-blur-sm">
            
            {/* Header Section */}
            <div className="relative p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
              {/* Floating particles */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full animate-bounce"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/20 rounded-full animate-bounce animation-delay-1000"></div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <span className="text-2xl">🚨</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                    !
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Report Campus Issue</h1>
                  <p className="text-blue-100 opacity-90">Quickly report disruptions for fast resolution</p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              {/* Status Messages */}
              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-800">Attention Required</h3>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200/50 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white animate-pulse">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800">Success!</h3>
                      <p className="text-green-700 text-sm">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title Field */}
                <div className="group">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm mr-3">
                      📝
                    </span>
                    Issue Title *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl text-lg font-medium placeholder-gray-400"
                      placeholder="Brief description of the issue (e.g., Projector not working in Room 101)"
                      maxLength={100}
                      required
                    />
                    {/* Animated Character Counter */}
                    <div className="absolute bottom-3 right-4">
                      <div className={`text-xs font-semibold bg-gradient-to-r ${getProgressColor(characterAnim.title, 100)} bg-clip-text text-transparent transition-all duration-500`}>
                        {characterAnim.title}/100
                      </div>
                      <div className="w-16 h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getProgressColor(characterAnim.title, 100)} rounded-full transition-all duration-500`}
                          style={{ width: `${(characterAnim.title / 100) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Field */}
                <div className="group">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm mr-3">
                      📄
                    </span>
                    Detailed Description *
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl resize-none placeholder-gray-400 leading-relaxed"
                      placeholder="Please provide detailed information about the issue, including any error messages, specific location details, and when the issue started..."
                      maxLength={500}
                      required
                    />
                    {/* Animated Character Counter */}
                    <div className="absolute bottom-3 right-4">
                      <div className={`text-xs font-semibold bg-gradient-to-r ${getProgressColor(characterAnim.description, 500)} bg-clip-text text-transparent transition-all duration-500`}>
                        {characterAnim.description}/500
                      </div>
                      <div className="w-16 h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getProgressColor(characterAnim.description, 500)} rounded-full transition-all duration-500`}
                          style={{ width: `${(characterAnim.description / 500) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Fields */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm mr-3">
                      📍
                    </span>
                    Location Details
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Building/Department */}
                    <div className="transform transition-all duration-300 hover:scale-105">
                      <label htmlFor="building" className="block text-xs font-medium text-gray-500 mb-2">
                        Department *
                      </label>
                      <div className="relative">
                        <select
                          id="building"
                          name="location.building"
                          value={formData.location.building}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                          required
                        >
                          <option value="">Select Department</option>
                          {BUILDINGS.map(building => (
                            <option key={building} value={building}>
                              {building}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Floor */}
                    <div className="transform transition-all duration-300 hover:scale-105">
                      <label htmlFor="floor" className="block text-xs font-medium text-gray-500 mb-2">
                        Floor
                      </label>
                      <input
                        type="text"
                        id="floor"
                        name="location.floor"
                        value={formData.location.floor}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="e.g., 2nd Floor"
                      />
                    </div>

                    {/* Room */}
                    <div className="transform transition-all duration-300 hover:scale-105">
                      <label htmlFor="room" className="block text-xs font-medium text-gray-500 mb-2">
                        Room Number
                      </label>
                      <input
                        type="text"
                        id="room"
                        name="location.room"
                        value={formData.location.room}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="e.g., Room 201"
                      />
                    </div>
                  </div>
                </div>

                {/* Enhanced Auto-categorization info */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg animate-pulse">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        Smart Auto-Processing
                      </h3>
                      <div className="text-sm text-blue-700 space-y-2">
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                          Automatic categorization based on content
                        </p>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse animation-delay-500"></span>
                          Intelligent priority assignment
                        </p>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse animation-delay-1000"></span>
                          Instant department routing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200/50">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    disabled={isLoading}
                    className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center space-x-2">
                      <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      <span>Cancel</span>
                    </span>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" variant="premium" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <span className="text-lg">🚀</span>
                        <span>Report Issue</span>
                      </span>
                    )}
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Success animation overlay */}
                    {success && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl animate-pulse"></div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="fixed top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-pulse animation-delay-1000"></div>
        <div className="fixed bottom-20 right-10 w-1 h-1 bg-purple-400 rounded-full opacity-30 animate-bounce animation-delay-1500"></div>
      </div>

      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        .animation-delay-1500 {
          animation-delay: 1500ms;
        }
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
};

export default IssueForm;
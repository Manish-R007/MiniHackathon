import { useState } from 'react';
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
  const navigate = useNavigate();

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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Report a Micro-Disruption</h2>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{success}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Issue Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="Brief description of the issue (e.g., Projector not working in Room 101)"
              maxLength={100}
              required
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {formData.title.length}/100 characters
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input resize-none"
              placeholder="Please provide detailed information about the issue, including any error messages, specific location details, and when the issue started..."
              maxLength={500}
              required
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {formData.description.length}/500 characters
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
                Building *
              </label>
              <select
                id="building"
                name="location.building"
                value={formData.location.building}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Building</option>
                {BUILDINGS.map(building => (
                  <option key={building} value={building}>
                    {building}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                Floor
              </label>
              <input
                type="text"
                id="floor"
                name="location.floor"
                value={formData.location.floor}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 2nd Floor"
              />
            </div>

            <div>
              <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
                Room Number
              </label>
              <input
                type="text"
                id="room"
                name="location.room"
                value={formData.location.room}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Room 201"
              />
            </div>
          </div>

          {/* Auto-categorization info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Automatic Processing
                </h3>
                <div className="mt-1 text-sm text-blue-700">
                  <p>Your issue will be automatically categorized, prioritized, and assigned to the appropriate department based on the content of your report.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Report Issue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueForm;
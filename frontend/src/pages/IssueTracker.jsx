import { useState, useEffect } from 'react';
import { issuesAPI } from '../services/api';
import IssueCard from '../components/dashboard/IssueCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const IssueTracker = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchUserIssues();
  }, []);

  const fetchUserIssues = async () => {
    try {
      setIsLoading(true);
      const response = await issuesAPI.getMyIssues();
      
      if (response.data.success) {
        setIssues(response.data.data.issues);
      }
    } catch (error) {
      setError('Failed to fetch your issues');
      console.error('Error fetching user issues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssueUpdate = async (issueId, updateData) => {
    try {
      const response = await issuesAPI.update(issueId, updateData);
      if (response.data.success) {
        setIssues(prev => 
          prev.map(issue => 
            issue._id === issueId ? response.data.data.issue : issue
          )
        );
      }
    } catch (error) {
      console.error('Error updating issue:', error);
      throw error;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-600 text-lg mb-2">{error}</div>
              <button 
                onClick={fetchUserIssues}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reported Issues</h1>
          <p className="text-gray-600">Track the status of issues you've reported</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner size="lg" />
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No issues reported yet</div>
            <p className="text-gray-500 mb-4">
              You haven't reported any issues. When you do, they'll appear here.
            </p>
            <button
              onClick={() => window.location.href = '/submit-issue'}
              className="btn btn-primary"
            >
              Report Your First Issue
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {issues.map(issue => (
              <IssueCard
                key={issue._id}
                issue={issue}
                onUpdate={handleIssueUpdate}
                userRole={user.role}
                userDepartment={user.department}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueTracker;
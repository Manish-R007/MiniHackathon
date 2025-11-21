import { useState, useEffect } from 'react';
import { issuesAPI } from '../../services/api';
import IssueCard from './IssueCard';
import IssueFilters from './IssueFilters';
import LoadingSpinner from '../common/LoadingSpinner';

const StaffDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    department: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchIssues();
    fetchStats();
  }, [filters, pagination.current]);

  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      const params = {
        ...filters,
        page: pagination.current,
        limit: 10
      };
      
      // Remove 'all' values from filters
      Object.keys(params).forEach(key => {
        if (params[key] === 'all') {
          delete params[key];
        }
      });

      const response = await issuesAPI.getAll(params);
      
      if (response.data.success) {
        setIssues(response.data.data.issues);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      setError('Failed to fetch issues');
      console.error('Error fetching issues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await issuesAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSearchChange = (search) => {
    setFilters(prev => ({ ...prev, search }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, current: newPage }));
  };

  const handleIssueUpdate = async (issueId, updateData) => {
    try {
      const response = await issuesAPI.update(issueId, updateData);
      if (response.data.success) {
        // Update local state
        setIssues(prev => 
          prev.map(issue => 
            issue._id === issueId ? response.data.data.issue : issue
          )
        );
        // Refresh stats
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating issue:', error);
      throw error;
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">{error}</div>
          <button 
            onClick={fetchIssues}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{stats.totalIssues || 0}</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Issues</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalIssues || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{stats.pendingIssues || 0}</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingIssues || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{stats.inProgressIssues || 0}</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.inProgressIssues || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{stats.resolvedIssues || 0}</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.resolvedIssues || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <IssueFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        userRole={user.role}
      />

      {/* Issues List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner size="lg" />
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No issues found</div>
            <p className="text-gray-500">
              {filters.status !== 'all' || filters.search ? 
                'Try adjusting your filters or search terms.' : 
                'No issues have been reported yet.'}
            </p>
          </div>
        ) : (
          <>
            {issues.map(issue => (
              <IssueCard
                key={issue._id}
                issue={issue}
                onUpdate={handleIssueUpdate}
                userRole={user.role}
                userDepartment={user.department}
              />
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={pagination.current === 1}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-700">
                  Page {pagination.current} of {pagination.pages}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={pagination.current === pagination.pages}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
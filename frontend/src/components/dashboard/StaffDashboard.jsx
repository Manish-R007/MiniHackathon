import { useState, useEffect, useRef } from 'react';
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
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [issuesLoaded, setIssuesLoaded] = useState(false);
  
  // Safe user parsing with error handling
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
      console.error('Error parsing user data:', error);
      return {};
    }
  };

  const user = getUser();
  const dashboardRef = useRef(null);

  useEffect(() => {
    fetchIssues();
    fetchStats();
  }, [filters, pagination.current]);

  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      setIssuesLoaded(false);
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
        setTimeout(() => setIssuesLoaded(true), 100);
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
        setTimeout(() => setStatsLoaded(true), 300);
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

  const getProgressPercentage = () => {
    const total = stats.totalIssues || 1;
    const resolved = stats.resolvedIssues || 0;
    return Math.round((resolved / total) * 100);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20"> {/* Added pt-20 for header spacing */}
        <div className="text-center glass-effect rounded-3xl p-8 shadow-2xl shadow-red-500/10 border border-red-200/50 backdrop-blur-sm">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchIssues}
            className="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Try Again</span>
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="space-y-8 mt-8"> {/* Added mt-8 for header spacing */}
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50 shadow-lg backdrop-blur-sm">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
            👋
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user.name || 'User'}!
            </h1>
            <p className="text-gray-600 text-sm">
              Here's what's happening with campus issues today.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 ${
        statsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {[
          { 
            label: 'Total Issues', 
            value: stats.totalIssues || 0, 
            icon: '📊', 
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-blue-100/50',
            description: 'All reported issues'
          },
          { 
            label: 'Pending', 
            value: stats.pendingIssues || 0, 
            icon: '⏳', 
            gradient: 'from-yellow-500 to-amber-500',
            bgGradient: 'from-yellow-50 to-yellow-100/50',
            description: 'Awaiting action'
          },
          { 
            label: 'In Progress', 
            value: stats.inProgressIssues || 0, 
            icon: '🚧', 
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-purple-100/50',
            description: 'Currently being worked on'
          },
          { 
            label: 'Resolved', 
            value: stats.resolvedIssues || 0, 
            icon: '✅', 
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-50 to-green-100/50',
            description: 'Successfully completed'
          }
        ].map((stat, index) => (
          <div 
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.bgGradient} rounded-2xl border border-white/50 backdrop-blur-sm`}></div>
            
            {/* Animated Border */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10`}></div>
            <div className="absolute inset-[1px] bg-white rounded-2xl -z-10"></div>

            {/* Card Content */}
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.description}</p>
                </div>
                
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/80 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Progress bar for resolved issues */}
              {stat.label === 'Resolved' && stats.totalIssues > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{getProgressPercentage()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </div>
        ))}
      </div>

      {/* Enhanced Filters */}
      <div className={`transition-all duration-700 delay-300 ${
        statsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <IssueFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          userRole={user.role}
        />
      </div>

      {/* Enhanced Issues List */}
      <div className={`space-y-6 transition-all duration-700 delay-500 ${
        issuesLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner 
              size="xl" 
              variant="cosmic" 
              text="Loading issues..." 
              className="mb-4"
            />
            <p className="text-gray-500 text-sm animate-pulse">
              Gathering campus disruption data...
            </p>
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-16 glass-effect rounded-3xl border border-gray-200/50 shadow-lg backdrop-blur-sm">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.927-6-2.445M12 6V4m0 0V4m0 0H8m4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              {filters.status !== 'all' || filters.search ? 
                'No matching issues found' : 
                'No issues reported yet'
              }
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {filters.status !== 'all' || filters.search ? 
                'Try adjusting your filters or search terms to see more results.' : 
                'When issues are reported, they will appear here for you to manage.'
              }
            </p>
            {(filters.status !== 'all' || filters.search) && (
              <button
                onClick={() => handleFilterChange({
                  status: 'all',
                  priority: 'all',
                  category: 'all',
                  department: 'all',
                  search: ''
                })}
                className="group inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Clear All Filters</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  📋
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Campus Issues
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Showing {issues.length} of {pagination.total} issue{pagination.total !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex space-x-2">
                <button 
                  onClick={fetchIssues}
                  className="group p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  title="Refresh issues"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Issues Grid */}
            <div className="space-y-6">
              {issues.map((issue, index) => (
                <div
                  key={issue._id}
                  className="transform transition-all duration-500 hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <IssueCard
                    issue={issue}
                    onUpdate={handleIssueUpdate}
                    userRole={user.role}
                    userDepartment={user.department}
                  />
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8 pt-6 border-t border-gray-200/50">
                <button
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={pagination.current === 1}
                  className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Previous</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/50">
                  <span className="text-sm font-semibold text-gray-700">
                    Page
                  </span>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold text-sm">
                    {pagination.current}
                  </span>
                  <span className="text-sm text-gray-500">
                    of {pagination.pages}
                  </span>
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={pagination.current === pagination.pages}
                  className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="flex items-center space-x-2">
                    <span>Next</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating decorative elements */}
      <div className="fixed top-20 right-10 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-pulse animation-delay-1000"></div>
      <div className="fixed bottom-20 left-10 w-1 h-1 bg-purple-400 rounded-full opacity-30 animate-bounce animation-delay-1500"></div>
    </div>
  );
};

export default StaffDashboard;
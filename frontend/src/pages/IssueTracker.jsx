import { useState, useEffect, useRef } from 'react';
import { issuesAPI } from '../services/api';
import IssueCard from '../components/dashboard/IssueCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const IssueTracker = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, resolved: 0 });
  const containerRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchUserIssues();
  }, []);

  // Calculate stats when issues change
  useEffect(() => {
    if (issues.length > 0) {
      const total = issues.length;
      const active = issues.filter(issue => 
        ['pending', 'in-progress', 'assigned'].includes(issue.status)
      ).length;
      const resolved = issues.filter(issue => 
        ['resolved', 'closed'].includes(issue.status)
      ).length;
      
      setStats({ total, active, resolved });
    }
  }, [issues]);

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

  const getProgressPercentage = () => {
    return stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center glass-effect rounded-3xl p-8 shadow-2xl shadow-red-500/10 border border-red-200/50 backdrop-blur-sm max-w-md w-full mx-4">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Issues</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchUserIssues}
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
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl animate-float-medium animation-delay-2000"></div>
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `particle-float ${6 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        {/* Enhanced Header */}
        <div className="text-center mb-12 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="glass-effect rounded-3xl border border-white/20 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 backdrop-blur-sm overflow-hidden p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-2xl">
                    📋
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                    {stats.total}
                  </div>
                </div>
                <div className="text-left">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    My Issue Tracker
                  </h1>
                  <p className="text-gray-600 text-lg mt-2">
                    Monitor all your reported campus disruptions
                  </p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="hidden lg:flex space-x-3">
                <button
                  onClick={() => window.location.href = '/submit-issue'}
                  className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">🚀</span>
                    <span>Report New Issue</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <button
                  onClick={fetchUserIssues}
                  className="group p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  title="Refresh issues"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            {issues.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {[
                  { label: 'Total Issues', value: stats.total, color: 'from-blue-500 to-cyan-500', icon: '📊' },
                  { label: 'Active', value: stats.active, color: 'from-orange-500 to-red-500', icon: '🔄' },
                  { label: 'Resolved', value: stats.resolved, color: 'from-green-500 to-emerald-500', icon: '✅' }
                ].map((stat, index) => (
                  <div 
                    key={stat.label}
                    className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className={`bg-gradient-to-r ${stat.bgGradient || 'from-gray-50 to-gray-100/50'} rounded-2xl border border-white/50 backdrop-blur-sm p-4`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-lg shadow-lg`}>
                          {stat.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Progress Bar */}
            {issues.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Resolution Progress</span>
                  <span>{getProgressPercentage()}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Quick Action */}
        <div className="lg:hidden mb-6 flex justify-center">
          <button
            onClick={() => window.location.href = '/submit-issue'}
            className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-full max-w-sm"
          >
            <span className="flex items-center justify-center space-x-2">
              <span className="text-lg">🚀</span>
              <span>Report New Issue</span>
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner 
              size="xl" 
              variant="cosmic" 
              text="Loading your issues..." 
              className="mb-4"
            />
            <p className="text-gray-500 text-sm animate-pulse">
              Gathering your reported issues...
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
              No Issues Reported Yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't reported any campus disruptions yet. When you report issues, 
              they will appear here with real-time status updates and progress tracking.
            </p>
            <button
              onClick={() => window.location.href = '/submit-issue'}
              className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center space-x-2">
                <span className="text-xl">🎯</span>
                <span>Report Your First Issue</span>
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Issues Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  🔧
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Your Reported Issues
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {issues.length} issue{issues.length !== 1 ? 's' : ''} tracked
                  </p>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
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

            {/* Summary Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Auto-refresh enabled</span>
                </div>
                <button
                  onClick={fetchUserIssues}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 mt-2 sm:mt-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh Now</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }

        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }

        @keyframes particle-float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          33% { 
            transform: translateY(-15px) translateX(10px);
            opacity: 0.6;
          }
          66% { 
            transform: translateY(10px) translateX(-5px);
            opacity: 0.4;
          }
        }

        .animate-float-slow {
          animation: float-slow 25s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 20s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
};

export default IssueTracker;
import { useState, useEffect, useRef } from 'react';
import { ISSUE_STATUS, ISSUE_PRIORITIES, ISSUE_CATEGORIES, DEPARTMENTS } from '../../utils/constants';

const IssueFilters = ({ filters, onFilterChange, onSearchChange, userRole }) => {
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const searchTimeoutRef = useRef(null);
  const containerRef = useRef(null);

  // Calculate active filter count
  useEffect(() => {
    const count = Object.keys(filters).reduce((acc, key) => {
      if (key !== 'search' && filters[key] !== 'all') acc++;
      return acc;
    }, 0) + (localSearch ? 1 : 0);
    setActiveFilterCount(count);
  }, [filters, localSearch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 300);
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      status: 'all',
      priority: 'all',
      category: 'all',
      department: 'all'
    });
    setLocalSearch('');
    onSearchChange('');
  };

  const hasActiveFilters = activeFilterCount > 0;

  const getFilterIcon = (filterType) => {
    switch (filterType) {
      case 'status': return '🔄';
      case 'priority': return '⚡';
      case 'category': return '📁';
      case 'department': return '🏢';
      case 'search': return '🔍';
      default: return '⚙️';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden transition-all duration-500"
    >
      {/* Main Filter Card */}
      <div className="glass-effect border border-white/20 rounded-2xl shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-500 backdrop-blur-sm">
        
        {/* Header with Expand/Collapse */}
        <div 
          className="flex items-center justify-between p-6 cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                🔧
              </div>
              {activeFilterCount > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                  {activeFilterCount}
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Issue Filters
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {hasActiveFilters 
                  ? `${activeFilterCount} active filter${activeFilterCount !== 1 ? 's' : ''}`
                  : 'Filter and search issues'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Active Filters Preview */}
            {hasActiveFilters && (
              <div className="hidden md:flex items-center space-x-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (key === 'search' || value === 'all') return null;
                  
                  let label = '';
                  if (key === 'status') label = ISSUE_STATUS[value]?.label;
                  else if (key === 'priority') label = ISSUE_PRIORITIES[value]?.label;
                  else if (key === 'category') label = ISSUE_CATEGORIES[value];
                  else if (key === 'department') label = DEPARTMENTS[value];
                  
                  return (
                    <span 
                      key={key}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                    >
                      {getFilterIcon(key)} {label}
                    </span>
                  );
                })}
                {localSearch && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                    🔍 Search: {localSearch.substring(0, 15)}{localSearch.length > 15 ? '...' : ''}
                  </span>
                )}
              </div>
            )}

            {/* Expand/Collapse Button */}
            <button className="group relative w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-110">
              <div className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Expandable Content - FIXED: Better height management */}
        <div className={`overflow-hidden transition-all duration-500 ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 pb-6 border-t border-gray-200/50 pt-6">
            
            {/* FIXED: Better layout structure */}
            <div className="space-y-6">
              
              {/* Enhanced Search - FIXED: Full width */}
              <div className="w-full">
                <div className="relative group">
                  <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                      🔍
                    </span>
                    Search Issues
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      value={localSearch}
                      onChange={handleSearchChange}
                      placeholder="Search by title, description, or location..."
                      className="w-full px-4 py-3 pl-12 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl text-gray-900 placeholder-gray-500"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    {localSearch && (
                      <button
                        onClick={() => {
                          setLocalSearch('');
                          onSearchChange('');
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Filters Grid - FIXED: Better responsive layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div className="group">
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="w-5 h-5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                      🔄
                    </span>
                    Status
                  </label>
                  <div className="relative">
                    <select
                      id="status"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-4 py-3 pr-10 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl appearance-none cursor-pointer text-gray-900"
                    >
                      <option value="all">All Status</option>
                      {Object.entries(ISSUE_STATUS).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Priority Filter */}
                <div className="group">
                  <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                      ⚡
                    </span>
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      id="priority"
                      value={filters.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                      className="w-full px-4 py-3 pr-10 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl appearance-none cursor-pointer text-gray-900"
                    >
                      <option value="all">All Priority</option>
                      {Object.entries(ISSUE_PRIORITIES).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="group">
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                      📁
                    </span>
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-4 py-3 pr-10 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-lg hover:shadow-xl appearance-none cursor-pointer text-gray-900"
                    >
                      <option value="all">All Categories</option>
                      {Object.entries(ISSUE_CATEGORIES).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Department Filter - Only for admin/staff */}
                {(userRole === 'admin' || userRole === 'staff') && (
                  <div className="group">
                    <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                        🏢
                      </span>
                      Department
                    </label>
                    <div className="relative">
                      <select
                        id="department"
                        value={filters.department}
                        onChange={(e) => handleFilterChange('department', e.target.value)}
                        className="w-full px-4 py-3 pr-10 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl appearance-none cursor-pointer text-gray-900"
                      >
                        <option value="all">All Departments</option>
                        {Object.entries(DEPARTMENTS).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons and Quick Filters - FIXED: Better layout */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200/50">
                
                {/* Enhanced Clear Filters Button */}
                {hasActiveFilters && (
                  <div className="flex">
                    <button
                      onClick={clearFilters}
                      className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                    >
                      <span>Clear All Filters</span>
                      <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                )}

                {/* Quick Filter Chips */}
                <div className="flex flex-wrap gap-2">
                  <div className="text-xs font-semibold text-gray-500 mr-2 flex items-center">Quick filters:</div>
                  {[
                    { key: 'status', value: 'pending', label: 'Pending', icon: '⏳' },
                    { key: 'status', value: 'in-progress', label: 'In Progress', icon: '🚧' },
                    { key: 'priority', value: 'high', label: 'High Priority', icon: '🔴' },
                    { key: 'priority', value: 'critical', label: 'Critical', icon: '🚨' },
                  ].map((filter) => (
                    <button
                      key={`${filter.key}-${filter.value}`}
                      onClick={() => handleFilterChange(filter.key, filter.value)}
                      className="inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 shadow-sm border border-blue-200"
                    >
                      <span className="mr-1">{filter.icon}</span>
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 animate-ping animation-delay-1000"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full opacity-0 animate-pulse animation-delay-500"></div>

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
        
        /* Ensure select options are visible */
        select {
          color: #1f2937;
        }
        
        select option {
          padding: 8px 12px;
          background: white;
          color: #1f2937;
        }
        
        /* Improve input visibility */
        input::placeholder {
          color: #6b7280;
        }
        
        input:focus {
          outline: none;
          ring: 2px;
        }
      `}</style>
    </div>
  );
};

export default IssueFilters;
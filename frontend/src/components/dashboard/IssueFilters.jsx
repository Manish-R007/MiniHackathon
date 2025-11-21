import { useState } from 'react';
import { ISSUE_STATUS, ISSUE_PRIORITIES, ISSUE_CATEGORIES, DEPARTMENTS } from '../../utils/constants';

const IssueFilters = ({ filters, onFilterChange, onSearchChange, userRole }) => {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    // Debounce search
    setTimeout(() => {
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

  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.priority !== 'all' || 
    filters.category !== 'all' || 
    filters.department !== 'all' ||
    localSearch;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        {/* Search */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Issues
          </label>
          <input
            type="text"
            id="search"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search by title, description, or location..."
            className="input"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              {Object.entries(ISSUE_STATUS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="input"
            >
              <option value="all">All Priority</option>
              {Object.entries(ISSUE_PRIORITIES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input"
            >
              <option value="all">All Categories</option>
              {Object.entries(ISSUE_CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Department Filter - Only for admin */}
          {(userRole === 'admin' || userRole === 'staff') && (
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                id="department"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="input"
              >
                <option value="all">All Departments</option>
                {Object.entries(DEPARTMENTS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div>
            <button
              onClick={clearFilters}
              className="btn btn-secondary whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueFilters;
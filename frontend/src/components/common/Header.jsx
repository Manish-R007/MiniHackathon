import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Add logout animation
    const button = document.activeElement;
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }, 150);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  const getRoleDisplay = (role, department) => {
    if (role === 'staff' && department) {
      return `Staff - ${department}`;
    }
    return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'from-purple-500 to-pink-500';
      case 'staff': return 'from-blue-500 to-cyan-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/submit-issue', label: 'Report Issue', icon: '🚨' },
    { path: '/my-issues', label: 'My Issues', icon: '📋' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border-b border-white/20' 
        : 'bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b border-gray-200/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => navigate('/dashboard')}
          >
            <div className="flex-shrink-0 relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-white font-bold text-lg">⚡</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Campus Disruption System
              </h1>
              <p className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Quick issue resolution
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 group ${
                  isActiveRoute(item.path)
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-lg hover:shadow-gray-500/10'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                
                {/* Active indicator */}
                {isActiveRoute(item.path) && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-lg"></div>
                )}
                
                {/* Hover effect */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isActiveRoute(item.path) ? 'opacity-100' : ''
                }`}></div>
              </button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Role Badge */}
            <div className={`hidden sm:block px-3 py-1 rounded-full bg-gradient-to-r ${getRoleColor(user.role)} text-white text-xs font-semibold shadow-lg transform transition-all duration-300 hover:scale-105`}>
              {getRoleDisplay(user.role, user.department)}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/80 shadow-lg shadow-gray-500/10 hover:shadow-gray-500/20 transition-all duration-300 hover:scale-110"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className={`w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}></span>
                <span className={`w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}></span>
              </div>
            </button>

            {/* User Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-2xl bg-white/80 shadow-lg shadow-gray-500/10 hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 group"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                    <span className="text-white font-bold text-lg">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-900">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user.email || 'user@campus.edu'}</p>
                </div>
                
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-blue-500/20 border border-white/20 overflow-hidden transform origin-top-right transition-all duration-300 scale-95 animate-in fade-in slide-in-from-top-5">
                  {/* User Info Header */}
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-bold text-lg">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{user.name || 'User'}</p>
                        <p className="text-white/80 text-xs">{user.email || 'user@campus.edu'}</p>
                        <div className="mt-1 px-2 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm inline-block">
                          {getRoleDisplay(user.role, user.department)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Items */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-200">
                        📊
                      </div>
                      <span className="font-medium">Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate('/my-issues');
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full p-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all duration-200">
                        📋
                      </div>
                      <span className="font-medium">My Issues</span>
                    </button>

                    <div className="border-t border-gray-200/50 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full p-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <span className="font-medium">Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-white/20 shadow-2xl shadow-blue-500/20 animate-in fade-in slide-in-from-top-5 duration-300"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navItems.map((item, index) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full p-4 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 ${
                    isActiveRoute(item.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-lg'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {isActiveRoute(item.path) && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
              
              {/* User Info in Mobile Menu */}
              <div className="p-4 mt-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{user.name || 'User'}</p>
                    <p className="text-gray-500 text-xs">{getRoleDisplay(user.role, user.department)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background Blur Overlay for Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
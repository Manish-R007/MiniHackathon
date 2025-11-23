import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { DEPARTMENTS } from '../utils/constants';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const containerRef = useRef(null);

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

  // Password strength calculator
  useEffect(() => {
    const calculateStrength = (password) => {
      let strength = 0;
      if (password.length >= 6) strength += 25;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      return Math.min(strength, 100);
    };

    setPasswordStrength(calculateStrength(formData.password));
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear department when role changes to student
    if (name === 'role' && value === 'student') {
      setFormData(prev => ({
        ...prev,
        department: ''
      }));
    }
    
    setError('');
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (formData.role === 'staff' && !formData.department) {
      setError('Department is required for staff members');
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await authAPI.register(submitData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Add success animation before redirect
        const button = e.target.querySelector('button[type="submit"]');
        if (button) {
          button.classList.add('success-animation');
        }
        
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'from-red-500 to-red-600';
    if (passwordStrength < 50) return 'from-orange-500 to-yellow-500';
    if (passwordStrength < 75) return 'from-yellow-500 to-amber-500';
    return 'from-green-500 to-emerald-600';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full translate-x-1/2 translate-y-1/2 opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-cyan-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-pink-300 rounded-full opacity-40 animate-bounce animation-delay-1000"></div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className={`max-w-md w-full space-y-8 transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}>
        
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center text-white text-2xl shadow-2xl shadow-green-500/30 transform transition-all duration-500 hover:scale-110 hover:rotate-3">
              🎓
            </div>
            {/* Outer glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl blur-xl opacity-30 -z-10 animate-pulse"></div>
            {/* Floating dots */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-ping animation-delay-700"></div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Join Campus Network
          </h1>
          <p className="text-gray-600 text-lg">
            Create your account to start reporting issues
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-green-600 hover:text-emerald-600 transition-colors duration-300 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Enhanced Form Card */}
        <div className="glass-effect border border-white/20 rounded-3xl shadow-2xl shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-500 backdrop-blur-sm overflow-hidden">
          
          {/* Animated Header Bar */}
          <div className="h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 animate-gradient-x"></div>
          
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Enhanced Error Message */}
              {error && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white animate-pulse">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-800">Registration Issue</h3>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Enhanced Name Field */}
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                      👤
                    </span>
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={() => handleBlur('name')}
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl placeholder-gray-400 ${
                        isFocused.name 
                          ? 'border-blue-500 ring-2 ring-blue-500/20' 
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {/* Animated focus indicator */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ${
                      isFocused.name ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}></div>
                  </div>
                </div>

                {/* Enhanced Email Field */}
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                      📧
                    </span>
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={() => handleBlur('email')}
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl placeholder-gray-400 ${
                        isFocused.email 
                          ? 'border-purple-500 ring-2 ring-purple-500/20' 
                          : 'border-gray-300 hover:border-purple-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {/* Animated focus indicator */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ${
                      isFocused.email ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}></div>
                  </div>
                </div>

                {/* Enhanced Role Field */}
                <div className="group">
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                      🎯
                    </span>
                    Role *
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      onFocus={() => handleFocus('role')}
                      onBlur={() => handleBlur('role')}
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl appearance-none cursor-pointer ${
                        isFocused.role 
                          ? 'border-orange-500 ring-2 ring-orange-500/20' 
                          : 'border-gray-300 hover:border-orange-300'
                      }`}
                      required
                    >
                      <option value="student">Student</option>
                      <option value="staff">Staff Member</option>
                      <option value="admin">Administrator</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {/* Animated focus indicator */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300 ${
                      isFocused.role ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}></div>
                  </div>
                </div>

                {/* Enhanced Department Field */}
                {(formData.role === 'staff' || formData.role === 'admin') && (
                  <div className="group">
                    <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                        🏢
                      </span>
                      Department *
                    </label>
                    <div className="relative">
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        onFocus={() => handleFocus('department')}
                        onBlur={() => handleBlur('department')}
                        className={`w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl appearance-none cursor-pointer ${
                          isFocused.department 
                            ? 'border-green-500 ring-2 ring-green-500/20' 
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                        required
                      >
                        <option value="">Select Department</option>
                        {Object.entries(DEPARTMENTS).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {/* Animated focus indicator */}
                      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-300 ${
                        isFocused.department ? 'w-full opacity-100' : 'w-0 opacity-0'
                      }`}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                      This determines which issues you can access and manage
                    </p>
                  </div>
                )}

                {/* Enhanced Password Field */}
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                      🔒
                    </span>
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => handleFocus('password')}
                      onBlur={() => handleBlur('password')}
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl placeholder-gray-400 ${
                        isFocused.password 
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                          : 'border-gray-300 hover:border-indigo-300'
                      }`}
                      placeholder="Enter your password (min. 6 characters)"
                      minLength={6}
                    />
                    {/* Animated focus indicator */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 ${
                      isFocused.password ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}></div>
                  </div>
                  
                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Password strength</span>
                        <span className={`font-semibold bg-gradient-to-r ${getPasswordStrengthColor()} bg-clip-text text-transparent`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getPasswordStrengthColor()} rounded-full transition-all duration-500`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                    Password must be at least 6 characters long
                  </p>
                </div>

                {/* Enhanced Confirm Password Field */}
                <div className="group">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                      ✅
                    </span>
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => handleFocus('confirmPassword')}
                      onBlur={() => handleBlur('confirmPassword')}
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl placeholder-gray-400 ${
                        isFocused.confirmPassword 
                          ? 'border-teal-500 ring-2 ring-teal-500/20' 
                          : 'border-gray-300 hover:border-teal-300'
                      }`}
                      placeholder="Confirm your password"
                      minLength={6}
                    />
                    {/* Password match indicator */}
                    {formData.confirmPassword && (
                      <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                        formData.password === formData.confirmPassword 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      } transition-colors duration-300`}>
                        {formData.password === formData.confirmPassword ? '✓' : '✗'}
                      </div>
                    )}
                    {/* Animated focus indicator */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-300 ${
                      isFocused.confirmPassword ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full overflow-hidden px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {/* Button content */}
                  <div className="relative z-10 flex items-center justify-center space-x-3">
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" variant="premium" />
                        <span className="text-lg">Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🚀</span>
                        <span className="text-lg">Create Campus Account</span>
                      </>
                    )}
                  </div>
                  
                  {/* Button hover effect */}
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000">
                    <div className="w-1/2 h-full bg-white/20"></div>
                  </div>
                  
                  {/* Success animation overlay */}
                  <div className="success-overlay absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl opacity-0"></div>
                </button>
              </div>

              {/* Enhanced Terms */}
              <div className="text-center pt-4">
                <p className="text-xs text-gray-500 flex items-center justify-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  By creating an account, you agree to our terms of service and privacy policy.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '⚡', text: 'Instant', color: 'text-yellow-500' },
            { icon: '🔒', text: 'Secure', color: 'text-green-500' },
            { icon: '🎯', text: 'Smart', color: 'text-purple-500' }
          ].map((feature, index) => (
            <div 
              key={feature.text}
              className="flex flex-col items-center space-y-2 p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg transform transition-all duration-300 hover:scale-110"
              style={{ animationDelay: `${index * 200 + 1000}ms` }}
            >
              <span className="text-2xl">{feature.icon}</span>
              <span className={`text-xs font-semibold ${feature.color}`}>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animation-delay-700 {
          animation-delay: 700ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        
        .success-animation .success-overlay {
          animation: successPulse 1s ease-in-out forwards;
        }
        
        @keyframes successPulse {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Register;
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

    try {
      const response = await authAPI.login(formData);
      
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
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full translate-x-1/2 translate-y-1/2 opacity-20 animate-pulse animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-cyan-300 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-pink-300 rounded-full opacity-40 animate-bounce animation-delay-1000"></div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
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

      <div className={`max-w-md w-full space-y-8 transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}>
        
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl shadow-2xl shadow-blue-500/30 transform transition-all duration-500 hover:scale-110 hover:rotate-3">
              ⚡
            </div>
            {/* Outer glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30 -z-10 animate-pulse"></div>
            {/* Floating dots */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping animation-delay-700"></div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg">
            Sign in to manage campus disruptions
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-purple-600 transition-colors duration-300 hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>

        {/* Enhanced Form Card */}
        <div className="glass-effect border border-white/20 rounded-3xl shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-500 backdrop-blur-sm overflow-hidden">
          
          {/* Animated Header Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
          
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
                      <h3 className="font-semibold text-red-800">Authentication Failed</h3>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Enhanced Email Field */}
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                      📧
                    </span>
                    Email Address
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
                          ? 'border-blue-500 ring-2 ring-blue-500/20' 
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {/* Animated focus indicator */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ${
                      isFocused.email ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}></div>
                  </div>
                </div>

                {/* Enhanced Password Field */}
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                      🔒
                    </span>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => handleFocus('password')}
                      onBlur={() => handleBlur('password')}
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl placeholder-gray-400 ${
                        isFocused.password 
                          ? 'border-purple-500 ring-2 ring-purple-500/20' 
                          : 'border-gray-300 hover:border-purple-300'
                      }`}
                      placeholder="Enter your password"
                    />
                    {/* Animated focus indicator */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ${
                      isFocused.password ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full overflow-hidden px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {/* Button content */}
                  <div className="relative z-10 flex items-center justify-center space-x-3">
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" variant="premium" />
                        <span className="text-lg">Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🚀</span>
                        <span className="text-lg">Sign In to Dashboard</span>
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

              {/* Additional Links */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  Forgot your password?{' '}
                  <a href="#" className="font-semibold text-blue-600 hover:text-purple-600 transition-colors duration-300">
                    Reset it here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '⚡', text: 'Fast', color: 'text-yellow-500' },
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

export default LoginForm;
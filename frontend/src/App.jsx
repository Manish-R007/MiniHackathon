import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Header from './components/common/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitIssue from './pages/SubmitIssue';
import IssueTracker from './pages/IssueTracker';
import LoadingSpinner from './components/common/LoadingSpinner';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

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
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: '⚡',
      title: 'Instant Reporting',
      description: 'Report campus issues in seconds with our intuitive interface',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🤖',
      title: 'Smart Routing',
      description: 'AI-powered automatic categorization and department assignment',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '📊',
      title: 'Real-time Tracking',
      description: 'Monitor issue progress with live updates and notifications',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🔧',
      title: 'Quick Resolution',
      description: 'Streamlined workflow for faster issue resolution times',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { number: '2.1K', label: 'Issues Resolved', icon: '✅' },
    { number: '15', label: 'Departments', icon: '🏢' },
    { number: '98%', label: 'Satisfaction Rate', icon: '⭐' },
    { number: '24/7', label: 'Support', icon: '🛡️' }
  ];

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Main gradient orbs with parallax */}
        <div 
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl animate-float-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-medium animation-delay-2000"
          style={{
            transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-float-fast animation-delay-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)`
          }}
        ></div>

        {/* Animated grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
          }}
        ></div>

        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `particle-float ${6 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
            }}
          ></div>
        ))}

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <linearGradient id="homeLineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="homeLineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q400,50 800,200"
            stroke="url(#homeLineGradient1)"
            strokeWidth="2"
            fill="none"
            className="animate-dash"
          />
          <path
            d="M100,400 Q500,300 900,400"
            stroke="url(#homeLineGradient2)"
            strokeWidth="2"
            fill="none"
            className="animate-dash animation-delay-3000"
          />
        </svg>

        {/* Floating shapes */}
        {['🔷', '🔶', '⭐', '💠', '✦'].map((shape, index) => (
          <div
            key={shape}
            className="absolute text-white/10 text-2xl animate-float-random"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${index * 800}ms`,
              animationDuration: `${15 + Math.random() * 10}s`,
              transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`
            }}
          >
            {shape}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={`relative z-10 transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}>
        
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-6xl mx-auto">
            {/* Animated Logo */}
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl shadow-purple-500/30 transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                ⚡
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-ping"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-ping animation-delay-1000"></div>
            </div>

            <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight">
              Campus Disruption
              <span className="block text-5xl lg:text-6xl mt-4">Management System</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform how your campus handles disruptions with our intelligent, 
              real-time issue resolution platform that connects students and staff seamlessly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                to="/register"
                className="group relative overflow-hidden px-12 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center space-x-3">
                  <span className="text-2xl">🚀</span>
                  <span>Get Started Free</span>
                </span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/login"
                className="group relative overflow-hidden px-12 py-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center space-x-3">
                  <span className="text-2xl">🔑</span>
                  <span>Sign In</span>
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="text-center transform transition-all duration-500 hover:scale-110"
                  style={{ animationDelay: `${index * 200 + 500}ms` }}
                >
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
                    <span>{stat.icon}</span>
                    <span>{stat.number}</span>
                  </div>
                  <div className="text-gray-400 text-sm lg:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the future of campus management with cutting-edge features 
                designed to streamline operations and enhance communication.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 300}ms` }}
                >
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10"></div>
                  
                  {/* Animated Border */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10`}></div>
                  <div className="absolute inset-[1px] bg-slate-900 rounded-3xl -z-10"></div>

                  {/* Content */}
                  <div className="relative p-8 text-center">
                    <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-6">
                How It Works
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {[
                {
                  step: '01',
                  title: 'Report Issue',
                  description: 'Quickly report any campus disruption with our simple form',
                  icon: '📝',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  step: '02',
                  title: 'Auto Processing',
                  description: 'AI automatically categorizes and routes to the right department',
                  icon: '🤖',
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  step: '03',
                  title: 'Track & Resolve',
                  description: 'Monitor progress in real-time until complete resolution',
                  icon: '✅',
                  color: 'from-green-500 to-emerald-500'
                }
              ].map((step, index) => (
                <div
                  key={step.step}
                  className="relative text-center group"
                  style={{ animationDelay: `${index * 400}ms` }}
                >
                  {/* Step Number */}
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-white text-xl font-bold border border-white/10 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {step.description}
                  </p>

                  {/* Connecting Line */}
                  {index < 2 && (
                    <div className="hidden lg:block absolute top-12 -right-12 w-24 h-1 bg-gradient-to-r from-gray-600 to-gray-700 group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-500"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-effect rounded-3xl border border-white/20 p-12 backdrop-blur-sm">
              <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-6">
                Ready to Transform Your Campus?
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join hundreds of educational institutions already using our platform 
                to create better campus experiences for everyone.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/register"
                  className="group relative overflow-hidden px-12 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-2xl">🎓</span>
                    <span>Start Free Trial</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                
                <Link
                  to="/login"
                  className="group relative overflow-hidden px-12 py-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-2xl">💼</span>
                    <span>Demo Request</span>
                  </span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                CDS
              </div>
              <span className="text-xl font-bold text-white">Campus Disruption System</span>
            </div>
            
            <p className="text-gray-400 mb-6">
              Empowering educational institutions with intelligent issue resolution
            </p>
            
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>© 2025 Campus Disruption System</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-30px) rotate(120deg) scale(1.1); }
          66% { transform: translateY(20px) rotate(240deg) scale(0.9); }
        }

        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.05); }
        }

        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
          75% { transform: translateY(10px) rotate(270deg); }
        }

        @keyframes float-random {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) translateX(0px);
            opacity: 0.1;
          }
          25% { 
            transform: translateY(-40px) rotate(90deg) translateX(20px);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg) translateX(-15px);
            opacity: 0.2;
          }
          75% { 
            transform: translateY(20px) rotate(270deg) translateX(10px);
            opacity: 0.4;
          }
        }

        @keyframes particle-float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          33% { 
            transform: translateY(-25px) translateX(15px);
            opacity: 0.6;
          }
          66% { 
            transform: translateY(15px) translateX(-10px);
            opacity: 0.4;
          }
        }

        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }

        .animate-float-slow {
          animation: float-slow 25s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 20s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 15s ease-in-out infinite;
        }

        .animate-float-random {
          animation: float-random 20s ease-in-out infinite;
        }

        .animate-dash {
          stroke-dasharray: 10;
          animation: dash 40s linear infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }

        .animation-delay-3000 {
          animation-delay: 3000ms;
        }
      `}</style>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
          <LoadingSpinner size="xl" variant="cosmic" />
        </div>
      );
    }
    
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  const PublicRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
          <LoadingSpinner size="xl" variant="cosmic" />
        </div>
      );
    }
    
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
        <LoadingSpinner size="xl" variant="cosmic" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        {isAuthenticated && <Header />}
        
        <Routes>
          {/* Home Route - Public */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            } 
          />
          
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/submit-issue" 
            element={
              <ProtectedRoute>
                <SubmitIssue />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/my-issues" 
            element={
              <ProtectedRoute>
                <IssueTracker />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
                <div className="text-center glass-effect rounded-3xl p-12 border border-white/20 backdrop-blur-sm">
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-4">404</h1>
                  <p className="text-gray-300 text-xl mb-8">Page not found</p>
                  <Link 
                    to="/"
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                  >
                    <span>🏠</span>
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
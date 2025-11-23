import { useState, useEffect, useRef } from 'react';
import IssueForm from '../components/forms/IssueForm';

const SubmitIssue = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  // Mouse move effect for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-red-50"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Main gradient orbs with parallax */}
        <div 
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full opacity-20 blur-3xl animate-float-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-red-200 to-pink-200 rounded-full opacity-20 blur-3xl animate-float-medium animation-delay-2000"
          style={{
            transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full opacity-15 blur-3xl animate-float-fast animation-delay-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)`
          }}
        ></div>

        {/* Animated grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
          }}
        ></div>

        {/* Floating particles */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-300 rounded-full opacity-30"
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
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15">
          <defs>
            <linearGradient id="orangeLineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="orangeLineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          <path
            d="M0,150 Q400,80 800,180"
            stroke="url(#orangeLineGradient1)"
            strokeWidth="2"
            fill="none"
            className="animate-dash"
          />
          <path
            d="M100,350 Q500,280 900,320"
            stroke="url(#orangeLineGradient2)"
            strokeWidth="2"
            fill="none"
            className="animate-dash animation-delay-3000"
          />
        </svg>

        {/* Floating alert symbols */}
        {['🚨', '⚠️', '🔧', '📢', '❗'].map((symbol, index) => (
          <div
            key={symbol}
            className="absolute text-orange-200/20 text-xl animate-float-random"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${index * 1000}ms`,
              animationDuration: `${20 + Math.random() * 10}s`,
              transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* Ambient light effect */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-orange-100/20 pointer-events-none"></div>

      {/* Enhanced Header Section */}
      <div className="relative z-10">
        {/* Animated top border */}
        <div className="h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse"></div>
        
        {/* Decorative header elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-10 animate-ping"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 rounded-full translate-x-1/2 -translate-y-1/2 opacity-10 animate-ping animation-delay-1500"></div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Banner */}
          <div className="mb-8 transform transition-all duration-500 hover:scale-[1.02]">
            <div className="glass-effect rounded-3xl border border-white/20 shadow-2xl shadow-orange-500/10 hover:shadow-orange-500/20 backdrop-blur-sm overflow-hidden">
              <div className="p-8 bg-gradient-to-r from-orange-600/5 to-red-600/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-2xl animate-pulse">
                        🚨
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce">
                        !
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        Report Campus Issue
                      </h1>
                      <p className="text-gray-600 mt-2 text-lg">
                        Help us keep campus running smoothly by reporting disruptions
                      </p>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="flex space-x-3">
                      {['⚡', '🎯', '🔧', '✅'].map((icon, index) => (
                        <div
                          key={icon}
                          className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-12"
                          style={{ animationDelay: `${index * 200 + 500}ms` }}
                        >
                          {icon}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-orange-200/30">
                  {[
                    { label: 'Fast Response', value: 'Under 2 hours', icon: '⚡' },
                    { label: 'Auto-Assigned', value: 'Smart Routing', icon: '🤖' },
                    { label: 'Track Progress', value: 'Real-time Updates', icon: '📊' }
                  ].map((stat, index) => (
                    <div 
                      key={stat.label}
                      className="text-center transform transition-all duration-300 hover:scale-105"
                      style={{ animationDelay: `${index * 300 + 800}ms` }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white text-sm mx-auto mb-2 shadow-lg">
                        {stat.icon}
                      </div>
                      <div className="text-sm font-semibold text-gray-700">{stat.label}</div>
                      <div className="text-xs text-gray-500">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="transform transition-all duration-700 delay-300">
            <IssueForm />
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="relative mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-effect rounded-2xl border border-white/20 shadow-lg backdrop-blur-sm overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    🛠️
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Campus Disruption System
                    </p>
                    <p className="text-xs text-gray-500">
                      Your report helps improve campus experience for everyone
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 font-mono">
                    Reporting System Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-orange-500/30 transform transition-all duration-300 hover:scale-110 hover:rotate-12"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
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
            opacity: 0.2;
          }
          25% { 
            transform: translateY(-40px) rotate(90deg) translateX(20px);
            opacity: 0.4;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg) translateX(-15px);
            opacity: 0.3;
          }
          75% { 
            transform: translateY(20px) rotate(270deg) translateX(10px);
            opacity: 0.5;
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
          animation: float-random 25s ease-in-out infinite;
        }

        .animate-dash {
          stroke-dasharray: 10;
          animation: dash 40s linear infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-1500 {
          animation-delay: 1500ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }

        .animation-delay-3000 {
          animation-delay: 3000ms;
        }

        .bg-radial-gradient {
          background: radial-gradient(ellipse at center, transparent 0%, rgba(254, 215, 170, 0.1) 100%);
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default SubmitIssue;
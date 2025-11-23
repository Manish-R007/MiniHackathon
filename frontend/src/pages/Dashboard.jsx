import { useState, useEffect, useRef } from 'react';
import StaffDashboard from '../components/dashboard/StaffDashboard';

const Dashboard = () => {
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
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" 
      // REMOVED: overflow-hidden from here
    >
      {/* Animated Background Elements - FIXED: Added overflow-hidden here instead */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating gradient orbs */}
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl animate-float-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl animate-float-slow animation-delay-2000"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-15 blur-3xl animate-float-medium animation-delay-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)`
          }}
        ></div>

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(120, 119, 198, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(120, 119, 198, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
          }}
        ></div>

        {/* Floating particles */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `particle-float ${8 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`
            }}
          ></div>
        ))}

        {/* Animated connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <path
            d="M100,100 C300,50 500,150 700,100"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-dash"
          />
          <path
            d="M50,300 C200,250 600,350 800,300"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-dash animation-delay-2000"
          />
        </svg>
      </div>

      {/* Main Content - FIXED: Ensure proper spacing and no overflow restrictions */}
      <div className={`relative z-10 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Add proper padding for header and ensure content can expand */}
        <div className="pt-20 pb-8"> {/* Added bottom padding */}
          
          {/* Enhanced Header Area */}
          <div className="relative">
            {/* Animated top border */}
            <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
            
            {/* Decorative header elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-10 animate-ping"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 rounded-full translate-x-1/2 -translate-y-1/2 opacity-10 animate-ping animation-delay-1000"></div>
          </div>

          {/* FIXED: Ensure content container allows full expansion */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Dashboard Content */}
            <div className="transform transition-all duration-700 delay-300 min-h-[60vh]"> {/* Added min-height */}
              <StaffDashboard />
            </div>
          </div>

          {/* Enhanced Footer Area */}
          <div className="relative mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="glass-effect rounded-2xl border border-white/20 shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        CDS
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Campus Disruption System
                        </p>
                        <p className="text-xs text-gray-500">
                          Keeping campus operations smooth
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500 font-mono">
                        System Online
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotate(90deg);
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-10px) translateX(-10px) rotate(180deg);
            opacity: 0.8;
          }
          75% { 
            transform: translateY(10px) translateX(15px) rotate(270deg);
            opacity: 0.5;
          }
        }

        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 15s ease-in-out infinite;
        }

        .animate-dash {
          stroke-dasharray: 10;
          animation: dash 30s linear infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
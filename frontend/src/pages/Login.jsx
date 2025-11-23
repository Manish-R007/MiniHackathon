import { useState, useEffect, useRef } from 'react';
import LoginForm from '../components/forms/LoginForm';

const Login = () => {
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
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Main gradient orbs with parallax */}
        <div 
          className="absolute top-1/4 -left-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl animate-float-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 -right-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-medium animation-delay-2000"
          style={{
            transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-float-fast animation-delay-1000"
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
            backgroundSize: '60px 60px',
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
            <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q400,50 800,200"
            stroke="url(#lineGradient1)"
            strokeWidth="2"
            fill="none"
            className="animate-dash"
          />
          <path
            d="M100,400 Q500,300 900,400"
            stroke="url(#lineGradient2)"
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

      {/* Ambient light effect */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/20 pointer-events-none"></div>

      {/* Main Content */}
      <div className={`relative z-10 transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}>
        <LoginForm />
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 left-0 right-0 text-center z-20">
        <div className="inline-flex items-center space-x-4 px-6 py-3 glass-effect rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/60 text-sm font-medium">Campus Disruption System</span>
          </div>
          <div className="w-px h-4 bg-white/20"></div>
          <span className="text-white/40 text-xs">Secure • Fast • Reliable</span>
        </div>
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

        .bg-radial-gradient {
          background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 100%);
        }
      `}</style>
    </div>
  );
};

export default Login;
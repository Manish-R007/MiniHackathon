import { useState, useEffect } from 'react';

const LoadingSpinner = ({ size = 'md', className = '', text = '', variant = 'default' }) => {
  const [currentDot, setCurrentDot] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variantStyles = {
    default: {
      container: 'border-4 border-blue-200 border-t-blue-600',
      glow: 'shadow-lg shadow-blue-500/25'
    },
    premium: {
      container: 'border-4 border-gradient-to-r from-purple-400 to-pink-600 border-t-transparent',
      glow: 'shadow-xl shadow-purple-500/30'
    },
    modern: {
      container: 'border-4 border-gray-200 border-l-transparent border-t-transparent border-r-transparent',
      glow: 'shadow-lg shadow-blue-500/20'
    },
    neon: {
      container: 'border-4 border-green-200 border-t-green-400',
      glow: 'shadow-xl shadow-green-500/40'
    },
    cosmic: {
      container: 'border-4 border-indigo-300 border-t-purple-500 border-r-pink-500',
      glow: 'shadow-2xl shadow-purple-500/25'
    }
  };

  // Animated dots for loading text
  useEffect(() => {
    if (text) {
      const interval = setInterval(() => {
        setCurrentDot((prev) => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [text]);

  const renderDots = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <span
        key={index}
        className={`inline-block w-1 h-1 mx-0.5 rounded-full bg-current transition-all duration-300 ${
          index < currentDot ? 'opacity-100 scale-125' : 'opacity-40 scale-100'
        }`}
      ></span>
    ));
  };

  // Special spinners for different variants
  const renderSpecialSpinner = () => {
    switch (variant) {
      case 'premium':
        return (
          <div className="relative">
            {/* Main spinner */}
            <div
              className={`${sizeClasses[size]} rounded-full animate-spin ${
                variantStyles[variant].container
              } ${variantStyles[variant].glow}`}
            ></div>
            {/* Outer ring */}
            <div
              className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-purple-200/50 animate-ping`}
            ></div>
            {/* Inner glow */}
            <div
              className={`absolute inset-1 ${sizeClasses[size === 'sm' ? 'sm' : 'md']} rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse`}
            ></div>
          </div>
        );
      
      case 'modern':
        return (
          <div className="relative">
            <div
              className={`${sizeClasses[size]} rounded-full animate-spin ${
                variantStyles[variant].container
              } ${variantStyles[variant].glow}`}
            ></div>
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1/4 h-1/4 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        );
      
      case 'neon':
        return (
          <div className="relative">
            <div
              className={`${sizeClasses[size]} rounded-full animate-spin ${
                variantStyles[variant].container
              } ${variantStyles[variant].glow}`}
            ></div>
            {/* Neon glow effect */}
            <div
              className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-green-400/30 animate-pulse`}
            ></div>
            {/* Inner ring */}
            <div
              className={`absolute inset-2 ${sizeClasses[size === 'sm' ? 'sm' : 'md']} rounded-full border-2 border-green-300/40 animate-spin animation-delay-[-0.5s]`}
            ></div>
          </div>
        );
      
      case 'cosmic':
        return (
          <div className="relative">
            {/* Main cosmic spinner */}
            <div
              className={`${sizeClasses[size]} rounded-full animate-spin ${
                variantStyles[variant].container
              } ${variantStyles[variant].glow}`}
            ></div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin animation-delay-[-1s]">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-1 h-1 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="w-1 h-1 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50"></div>
              </div>
            </div>
            {/* Pulsing core */}
            <div className="absolute inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse shadow-inner"></div>
          </div>
        );
      
      default:
        return (
          <div className="relative">
            {/* Main spinner */}
            <div
              className={`${sizeClasses[size]} rounded-full animate-spin ${
                variantStyles[variant].container
              } ${variantStyles[variant].glow}`}
            ></div>
            {/* Pulsing background */}
            <div
              className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-blue-100/30 animate-pulse`}
            ></div>
            {/* Center highlight */}
            <div className="absolute inset-1/4 bg-white/40 rounded-full animate-ping"></div>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Animated Spinner Container */}
      <div className="relative">
        {renderSpecialSpinner()}
        
        {/* Floating particles for cosmic variant */}
        {variant === 'cosmic' && (
          <>
            <div className="absolute -top-1 -right-1 w-1 h-1 bg-blue-400 rounded-full animate-bounce shadow-lg shadow-blue-400/50"></div>
            <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-pink-400 rounded-full animate-bounce animation-delay-[-0.3s] shadow-lg shadow-pink-400/50"></div>
          </>
        )}
      </div>

      {/* Loading Text with Animated Dots */}
      {text && (
        <div className="mt-4 flex items-center space-x-1">
          <span className="text-sm font-medium text-gray-600 animate-pulse">
            {text}
          </span>
          <div className="flex">
            {renderDots()}
          </div>
        </div>
      )}

      {/* Optional: Progress bar for larger spinners */}
      {(size === 'lg' || size === 'xl') && variant === 'default' && (
        <div className="mt-3 w-20 bg-gray-200 rounded-full h-1 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progress"
            style={{
              animation: 'progress 2s ease-in-out infinite'
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

// Add custom animation for progress bar
const style = document.createElement('style');
style.textContent = `
  @keyframes progress {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(100%); }
    100% { transform: translateX(100%); }
  }
  
  .animation-delay-\\[-0\\.3s\\] {
    animation-delay: -0.3s;
  }
  
  .animation-delay-\\[-0\\.5s\\] {
    animation-delay: -0.5s;
  }
  
  .animation-delay-\\[-1s\\] {
    animation-delay: -1s;
  }
  
  .animate-progress {
    animation: progress 2s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

export default LoadingSpinner;
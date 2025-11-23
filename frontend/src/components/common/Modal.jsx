import { useEffect, useRef } from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '',
  closeOnOverlayClick = true 
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      modalRef.current?.focus();
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        aria-hidden="true"
        onClick={handleOverlayClick}
      ></div>

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-0">
        <div 
          ref={modalRef}
          className={`
            relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl 
            transition-all duration-300 w-full
            ${sizeClasses[size]}
            ${className}
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
        >
          {/* Header */}
          {title && (
            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900 flex items-center"
                >
                  <span className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></span>
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 
                           transition-all duration-200 transform hover:scale-110 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Content - FIXED: Added proper scrolling and height management */}
          <div className="modal-content-container max-h-[75vh] overflow-y-auto">
            <div className="px-6 py-4">
              {children}
            </div>
          </div>

          {/* Optional Footer for additional actions */}
          {/* This ensures space for content and prevents button cutoff */}
          <div className="h-4 bg-gradient-to-b from-transparent to-white/80"></div>
        </div>
      </div>

      <style jsx>{`
        .modal-content-container {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 #f7fafc;
        }

        .modal-content-container::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content-container::-webkit-scrollbar-track {
          background: #f7fafc;
          border-radius: 3px;
        }

        .modal-content-container::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }

        .modal-content-container::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }

        /* Smooth scrolling */
        .modal-content-container {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for Firefox */
        @supports (scrollbar-width: thin) {
          .modal-content-container {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e0 #f7fafc;
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;
import { useState, useRef, useEffect } from 'react';
import { ISSUE_STATUS, ISSUE_PRIORITIES, ISSUE_CATEGORIES, DEPARTMENTS } from '../../utils/constants';
import Modal from '../common/Modal';

const IssueCard = ({ issue, onUpdate, userRole, userDepartment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  const canUpdate = userRole === 'admin' || (userRole === 'staff' && issue.assignedDepartment === userDepartment);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleStatusUpdate = async (newStatus) => {
    if (!canUpdate) return;

    setIsUpdating(true);
    try {
      const updateData = { status: newStatus };
      if (newStatus === 'resolved') {
        updateData.resolutionNotes = resolutionNotes;
      }
      await onUpdate(issue._id, updateData);
      setIsModalOpen(false);
      setResolutionNotes('');
    } catch (error) {
      console.error('Failed to update issue:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusActions = () => {
    const currentStatus = issue.status;
    const actions = [];

    if (currentStatus === 'pending' && canUpdate) {
      actions.push({ 
        label: 'Start Work', 
        status: 'in-progress', 
        style: 'primary',
        icon: '🚀'
      });
    }

    if (currentStatus === 'in-progress' && canUpdate) {
      actions.push({ 
        label: 'Mark Resolved', 
        status: 'resolved', 
        style: 'success',
        icon: '✅',
        requiresNotes: true 
      });
    }

    if (currentStatus === 'resolved' && canUpdate) {
      actions.push({ 
        label: 'Close Issue', 
        status: 'closed', 
        style: 'secondary',
        icon: '🔒'
      });
    }

    return actions;
  };

  const getPriorityGradient = (priority) => {
    switch (priority) {
      case 'critical': return 'from-red-500 to-pink-600';
      case 'high': return 'from-orange-500 to-red-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'pending': return 'from-yellow-500 to-amber-500';
      case 'in-progress': return 'from-blue-500 to-cyan-500';
      case 'resolved': return 'from-green-500 to-emerald-500';
      case 'closed': return 'from-gray-500 to-gray-600';
      default: return 'from-purple-500 to-indigo-500';
    }
  };

  const statusActions = getStatusActions();

  return (
    <>
      <div 
        ref={cardRef}
        className={`relative overflow-hidden transition-all duration-700 transform ${
          isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-8 scale-95'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl transition-all duration-500 ${
          isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
        }`}></div>
        
        {/* Main Card */}
        <div className="relative glass-effect border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group backdrop-blur-sm">
          
          {/* Animated Border */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
          <div className="absolute inset-[1px] rounded-2xl bg-white -z-10"></div>

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 pr-4">
              {/* Title with gradient text */}
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500 line-clamp-2">
                {issue.title}
              </h3>
              
              {/* Description with fade effect */}
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 transition-all duration-300 group-hover:text-gray-700">
                {issue.description}
              </p>
            </div>
            
            {/* Status & Priority Badges */}
            <div className="flex flex-col items-end space-y-3">
              <div className="relative">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg bg-gradient-to-r ${getPriorityGradient(issue.priority)} transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                  <span className="w-1.5 h-1.5 bg-white/80 rounded-full mr-2 animate-pulse"></span>
                  {ISSUE_PRIORITIES[issue.priority]?.label}
                </span>
              </div>
              <div className="relative">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg bg-gradient-to-r ${getStatusGradient(issue.status)} transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                  <span className="w-1.5 h-1.5 bg-white/80 rounded-full mr-2"></span>
                  {ISSUE_STATUS[issue.status]?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 group-hover:from-blue-100 group-hover:to-blue-200/50 transition-all duration-300">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm">
                📁
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Category</span>
                <p className="font-semibold text-gray-900 text-sm">{ISSUE_CATEGORIES[issue.category]}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 group-hover:from-purple-100 group-hover:to-purple-200/50 transition-all duration-300">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">
                🏢
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Department</span>
                <p className="font-semibold text-gray-900 text-sm">{DEPARTMENTS[issue.assignedDepartment] || issue.assignedDepartment}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 group-hover:from-green-100 group-hover:to-green-200/50 transition-all duration-300">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm">
                📍
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Location</span>
                <p className="font-semibold text-gray-900 text-sm">
                  {issue.location.building}
                  {issue.location.room && `, ${issue.location.room}`}
                  {issue.location.floor && `, ${issue.location.floor}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 group-hover:from-orange-100 group-hover:to-orange-200/50 transition-all duration-300">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-sm">
                📅
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Reported</span>
                <p className="font-semibold text-gray-900 text-sm">
                  {new Date(issue.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {issue.reportedBy?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <span className="text-sm text-gray-500 block">Reported by</span>
                <span className="font-semibold text-gray-900 text-sm">{issue.reportedBy?.name}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {statusActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => action.requiresNotes ? setIsModalOpen(true) : handleStatusUpdate(action.status)}
                  disabled={isUpdating}
                  className={`group relative overflow-hidden px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    action.style === 'primary' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600' :
                    action.style === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600' :
                    'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-base">{action.icon}</span>
                    <span>{action.label}</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative overflow-hidden px-4 py-2 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <span className="flex items-center space-x-2">
                  <span className="text-base">👁️</span>
                  <span>View Details</span>
                </span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Comments Count */}
          {issue.comments && issue.comments.length > 0 && (
            <div className="absolute -top-2 -right-2">
              <div className="relative">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                  {issue.comments.length}
                </div>
                <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
          )}

          {/* Floating Elements */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-500"></div>
          <div className="absolute bottom-2 right-2 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce animation-delay-200 transition-opacity duration-500"></div>
        </div>
      </div>

      {/* Fixed Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setResolutionNotes('');
        }}
        title={`Issue: ${issue.title}`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Enhanced Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Status', value: ISSUE_STATUS[issue.status]?.label, color: ISSUE_STATUS[issue.status]?.color, icon: '🔄' },
              { label: 'Priority', value: ISSUE_PRIORITIES[issue.priority]?.label, color: ISSUE_PRIORITIES[issue.priority]?.color, icon: '⚡' },
              { label: 'Category', value: ISSUE_CATEGORIES[issue.category], icon: '📁' },
              { label: 'Department', value: DEPARTMENTS[issue.assignedDepartment] || issue.assignedDepartment, icon: '🏢' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/50">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-500 mb-1">{item.label}</label>
                  {item.color ? (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white ${item.color}`}>
                      {item.value}
                    </span>
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Location */}
          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-gray-200/50">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-lg">
              📍
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-500 mb-1">Location</label>
              <p className="text-sm font-semibold text-gray-900">
                {issue.location.building}
                {issue.location.floor && `, ${issue.location.floor}`}
                {issue.location.room && `, ${issue.location.room}`}
              </p>
            </div>
          </div>

          {/* Enhanced Description */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-gray-200/50">
            <label className="block text-sm font-semibold text-gray-500 mb-3 flex items-center">
              <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                📝
              </span>
              Description
            </label>
            <p className="text-sm text-gray-700 leading-relaxed bg-white/50 p-4 rounded-xl border border-white/50">
              {issue.description}
            </p>
          </div>

          {/* Enhanced Resolution Notes */}
          {issue.resolutionDetails?.resolutionNotes && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-gray-200/50">
              <label className="block text-sm font-semibold text-gray-500 mb-3 flex items-center">
                <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                  ✅
                </span>
                Resolution Notes
              </label>
              <p className="text-sm text-gray-700 leading-relaxed bg-white/50 p-4 rounded-xl border border-white/50">
                {issue.resolutionDetails.resolutionNotes}
              </p>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Resolved by {issue.resolutionDetails.resolvedBy?.name} on{' '}
                {new Date(issue.resolutionDetails.resolvedAt).toLocaleString()}
              </p>
            </div>
          )}

          {/* Enhanced Comments */}
          {issue.comments && issue.comments.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-gray-200/50">
              <label className="block text-sm font-semibold text-gray-500 mb-3 flex items-center">
                <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                  💬
                </span>
                Comments ({issue.comments.length})
              </label>
              <div className="space-y-3">
                {issue.comments.map((comment, index) => (
                  <div key={index} className="bg-white/70 rounded-xl p-4 border border-white/50 backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {comment.user?.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {comment.user?.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed pl-8">
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Resolution Input */}
          {statusActions.find(action => action.requiresNotes) && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-gray-200/50">
              <label htmlFor="resolutionNotes" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <span className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">
                  📋
                </span>
                Resolution Notes *
              </label>
              <textarea
                id="resolutionNotes"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none bg-white/70 backdrop-blur-sm"
                placeholder="Please describe how the issue was resolved..."
                required
              />
            </div>
          )}

          {/* Enhanced Action Buttons - FIXED: Removed negative margins */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm rounded-xl p-4 mt-6">
            {statusActions.map((action, index) => (
              <button
                key={index}
                onClick={() => action.requiresNotes ? handleStatusUpdate(action.status) : handleStatusUpdate(action.status)}
                disabled={isUpdating || (action.requiresNotes && !resolutionNotes.trim())}
                className={`group relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                } ${
                  action.style === 'primary' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                  action.style === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                  'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                }`}
              >
                <span className="flex items-center space-x-2">
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-base">{action.icon}</span>
                  )}
                  <span>{isUpdating ? 'Updating...' : action.label}</span>
                </span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ))}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setResolutionNotes('');
              }}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </>
  );
};

export default IssueCard;
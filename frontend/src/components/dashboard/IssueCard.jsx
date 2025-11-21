import { useState } from 'react';
import { ISSUE_STATUS, ISSUE_PRIORITIES, ISSUE_CATEGORIES, DEPARTMENTS } from '../../utils/constants';
import Modal from '../common/Modal';

const IssueCard = ({ issue, onUpdate, userRole, userDepartment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const canUpdate = userRole === 'admin' || (userRole === 'staff' && issue.assignedDepartment === userDepartment);

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
      actions.push({ label: 'Start Work', status: 'in-progress', style: 'btn-primary' });
    }

    if (currentStatus === 'in-progress' && canUpdate) {
      actions.push({ 
        label: 'Mark Resolved', 
        status: 'resolved', 
        style: 'btn-success',
        requiresNotes: true 
      });
    }

    if (currentStatus === 'resolved' && canUpdate) {
      actions.push({ label: 'Close Issue', status: 'closed', style: 'btn-secondary' });
    }

    return actions;
  };

  const statusActions = getStatusActions();

  return (
    <>
      <div className="card p-6 hover:shadow-md transition-shadow duration-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {issue.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {issue.description}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2 ml-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ISSUE_PRIORITIES[issue.priority]?.color} text-white`}>
              {ISSUE_PRIORITIES[issue.priority]?.label}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ISSUE_STATUS[issue.status]?.color} text-white`}>
              {ISSUE_STATUS[issue.status]?.label}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
          <div>
            <span className="text-gray-500">Category:</span>
            <p className="font-medium">{ISSUE_CATEGORIES[issue.category]}</p>
          </div>
          <div>
            <span className="text-gray-500">Department:</span>
            <p className="font-medium">{DEPARTMENTS[issue.assignedDepartment] || issue.assignedDepartment}</p>
          </div>
          <div>
            <span className="text-gray-500">Location:</span>
            <p className="font-medium">
              {issue.location.building}
              {issue.location.room && `, ${issue.location.room}`}
              {issue.location.floor && `, ${issue.location.floor}`}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Reported:</span>
            <p className="font-medium">
              {new Date(issue.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Reported by: <span className="font-medium">{issue.reportedBy?.name}</span>
          </div>
          
          <div className="flex space-x-2">
            {statusActions.map((action, index) => (
              <button
                key={index}
                onClick={() => action.requiresNotes ? setIsModalOpen(true) : handleStatusUpdate(action.status)}
                className={`btn ${action.style} text-xs`}
                disabled={isUpdating}
              >
                {action.label}
              </button>
            ))}
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-secondary text-xs"
            >
              View Details
            </button>
          </div>
        </div>

        {/* Comments Count */}
        {issue.comments && issue.comments.length > 0 && (
          <div className="mt-3 text-sm text-gray-500">
            {issue.comments.length} comment{issue.comments.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setResolutionNotes('');
        }}
        title="Issue Details"
        size="lg"
      >
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Status</label>
              <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ISSUE_STATUS[issue.status]?.color} text-white mt-1`}>
                {ISSUE_STATUS[issue.status]?.label}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Priority</label>
              <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ISSUE_PRIORITIES[issue.priority]?.color} text-white mt-1`}>
                {ISSUE_PRIORITIES[issue.priority]?.label}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Category</label>
              <p className="mt-1 text-sm text-gray-900">{ISSUE_CATEGORIES[issue.category]}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Department</label>
              <p className="mt-1 text-sm text-gray-900">{DEPARTMENTS[issue.assignedDepartment] || issue.assignedDepartment}</p>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-500">Location</label>
            <p className="mt-1 text-sm text-gray-900">
              {issue.location.building}
              {issue.location.floor && `, ${issue.location.floor}`}
              {issue.location.room && `, ${issue.location.room}`}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-500">Description</label>
            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{issue.description}</p>
          </div>

          {/* Resolution Notes */}
          {issue.resolutionDetails?.resolutionNotes && (
            <div>
              <label className="block text-sm font-medium text-gray-500">Resolution Notes</label>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {issue.resolutionDetails.resolutionNotes}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Resolved by {issue.resolutionDetails.resolvedBy?.name} on{' '}
                {new Date(issue.resolutionDetails.resolvedAt).toLocaleString()}
              </p>
            </div>
          )}

          {/* Comments */}
          {issue.comments && issue.comments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Comments ({issue.comments.length})
              </label>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {issue.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {comment.user?.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolution Input */}
          {statusActions.find(action => action.requiresNotes) && (
            <div>
              <label htmlFor="resolutionNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Resolution Notes *
              </label>
              <textarea
                id="resolutionNotes"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={3}
                className="input resize-none"
                placeholder="Please describe how the issue was resolved..."
                required
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {statusActions.map((action, index) => (
              <button
                key={index}
                onClick={() => action.requiresNotes ? handleStatusUpdate(action.status) : handleStatusUpdate(action.status)}
                disabled={isUpdating || (action.requiresNotes && !resolutionNotes.trim())}
                className={`btn ${action.style}`}
              >
                {isUpdating ? 'Updating...' : action.label}
              </button>
            ))}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setResolutionNotes('');
              }}
              className="btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default IssueCard;
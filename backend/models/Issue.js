const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Issue title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Issue description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: ['technology', 'furniture', 'utilities', 'facilities', 'academic', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  location: {
    building: {
      type: String,
      required: true,
      trim: true
    },
    room: {
      type: String,
      trim: true
    },
    floor: {
      type: String,
      trim: true
    }
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: String,
    enum: ['IT', 'maintenance', 'admin', 'facilities', 'academic', null],
    default: null
  },
  assignedDepartment: {
    type: String,
    enum: ['IT', 'maintenance', 'admin', 'facilities', 'academic', null],
    default: null
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolutionDetails: {
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: {
      type: Date
    },
    resolutionNotes: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }]
}, {
  timestamps: true
});

issueSchema.index({ status: 1, priority: -1 });
issueSchema.index({ assignedDepartment: 1 });
issueSchema.index({ reportedBy: 1 });

module.exports = mongoose.model('Issue', issueSchema);
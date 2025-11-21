const Issue = require('../models/Issue');

// Utility functions for categorization and assignment
const categorizeIssue = (title, description) => {
  const text = (title + ' ' + description).toLowerCase();
  
  const categoryKeywords = {
    technology: ['projector', 'computer', 'laptop', 'wifi', 'internet', 'network', 'printer', 'software', 'hardware', 'screen', 'monitor', 'keyboard', 'mouse'],
    furniture: ['desk', 'chair', 'table', 'furniture', 'broken chair', 'broken desk', 'wobbly', 'drawer'],
    utilities: ['water', 'cooler', 'ac', 'heating', 'electricity', 'power', 'light', 'bulb', 'fan', 'ventilation'],
    facilities: ['restroom', 'toilet', 'clean', 'cleaning', 'trash', 'garbage', 'leak', 'plumbing', 'door', 'window', 'lock'],
    academic: ['marker', 'whiteboard', 'blackboard', 'chalk', 'book', 'textbook', 'supplies', 'stationery']
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  return 'other';
};

const determinePriority = (title, description, category) => {
  const text = (title + ' ' + description).toLowerCase();
  const urgentKeywords = ['fire', 'flood', 'electrical', 'hazard', 'emergency', 'urgent', 'critical', 'security'];
  const highPriorityKeywords = ['wifi down', 'no internet', 'projector not working', 'broken', 'leaking', 'flooding'];
  
  if (urgentKeywords.some(keyword => text.includes(keyword))) {
    return 'critical';
  }
  
  if (highPriorityKeywords.some(keyword => text.includes(keyword)) || 
      category === 'technology' && text.includes('not working')) {
    return 'high';
  }
  
  if (category === 'utilities' || category === 'facilities') {
    return 'medium';
  }
  
  return 'low';
};

const assignToDepartment = (category, priority) => {
  const departmentMapping = {
    technology: 'IT',
    furniture: 'maintenance',
    utilities: 'facilities',
    facilities: 'facilities',
    academic: 'academic',
    other: 'admin'
  };
  
  return departmentMapping[category] || 'admin';
};

exports.createIssue = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    
    if (!title || !description || !location || !location.building) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and building location are required'
      });
    }

    // Auto-categorize and assign
    const category = categorizeIssue(title, description);
    const priority = determinePriority(title, description, category);
    const assignedDepartment = assignToDepartment(category, priority);

    const issue = await Issue.create({
      title,
      description,
      category,
      priority,
      location,
      reportedBy: req.user.id,
      assignedDepartment
    });

    const populatedIssue = await Issue.findById(issue._id)
      .populate('reportedBy', 'name email')
      .populate('comments.user', 'name');

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      data: { issue: populatedIssue }
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating issue',
      error: error.message
    });
  }
};

exports.getAllIssues = async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      category, 
      department, 
      page = 1, 
      limit = 10,
      search 
    } = req.query;

    let filter = {};
    
    // Staff can only see issues assigned to their department
    if (req.user.role === 'staff' && req.user.department) {
      filter.assignedDepartment = req.user.department;
    }

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (category && category !== 'all') filter.category = category;
    if (department && department !== 'all') filter.assignedDepartment = department;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.building': { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name email')
      .populate('comments.user', 'name')
      .populate('resolutionDetails.resolvedBy', 'name')
      .sort({ createdAt: -1, priority: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Issue.countDocuments(filter);

    res.json({
      success: true,
      data: {
        issues,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issues',
      error: error.message
    });
  }
};

exports.getUserIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user.id })
      .populate('reportedBy', 'name email')
      .populate('comments.user', 'name')
      .populate('resolutionDetails.resolvedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { issues }
    });
  } catch (error) {
    console.error('Get user issues error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user issues',
      error: error.message
    });
  }
};

exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('comments.user', 'name')
      .populate('resolutionDetails.resolvedBy', 'name');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Authorization check
    if (req.user.role === 'staff' && issue.assignedDepartment !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this issue'
      });
    }

    if (req.user.role === 'student' && issue.reportedBy._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this issue'
      });
    }

    res.json({
      success: true,
      data: { issue }
    });
  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issue',
      error: error.message
    });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const { status, priority, assignedDepartment, resolutionNotes } = req.body;
    const issueId = req.params.id;

    let issue = await Issue.findById(issueId);
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Authorization check
    if (req.user.role === 'staff' && issue.assignedDepartment !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to update this issue'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (priority && req.user.role !== 'student') updateData.priority = priority;
    if (assignedDepartment && req.user.role !== 'student') updateData.assignedDepartment = assignedDepartment;

    // Handle resolution
    if (status === 'resolved' && !issue.resolutionDetails.resolvedAt) {
      updateData.resolutionDetails = {
        resolvedBy: req.user.id,
        resolvedAt: new Date(),
        resolutionNotes: resolutionNotes || 'Issue resolved'
      };
    }

    issue = await Issue.findByIdAndUpdate(
      issueId,
      updateData,
      { new: true, runValidators: true }
    ).populate('reportedBy', 'name email')
     .populate('comments.user', 'name')
     .populate('resolutionDetails.resolvedBy', 'name');

    res.json({
      success: true,
      message: 'Issue updated successfully',
      data: { issue }
    });
  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating issue',
      error: error.message
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Authorization check
    if (req.user.role === 'staff' && issue.assignedDepartment !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to comment on this issue'
      });
    }

    if (req.user.role === 'student' && issue.reportedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to comment on this issue'
      });
    }

    issue.comments.push({
      user: req.user.id,
      text: text.trim()
    });

    await issue.save();

    const updatedIssue = await Issue.findById(issue._id)
      .populate('reportedBy', 'name email')
      .populate('comments.user', 'name')
      .populate('resolutionDetails.resolvedBy', 'name');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: { issue: updatedIssue }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role === 'staff' && req.user.department) {
      filter.assignedDepartment = req.user.department;
    }

    const totalIssues = await Issue.countDocuments(filter);
    const pendingIssues = await Issue.countDocuments({ ...filter, status: 'pending' });
    const inProgressIssues = await Issue.countDocuments({ ...filter, status: 'in-progress' });
    const resolvedIssues = await Issue.countDocuments({ ...filter, status: 'resolved' });

    // Department-wise stats (only for admin)
    let departmentStats = [];
    if (req.user.role === 'admin') {
      departmentStats = await Issue.aggregate([
        {
          $group: {
            _id: '$assignedDepartment',
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
            resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
          }
        }
      ]);
    }

    res.json({
      success: true,
      data: {
        totalIssues,
        pendingIssues,
        inProgressIssues,
        resolvedIssues,
        departmentStats
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};
const User = require('../models/User');
const CampusIssue = require('../models/CampusIssue');
const HelpRequest = require('../models/HelpRequest');
const Connection = require('../models/Connection');

// @desc    Get Admin Dashboard Stats & Metrics
// @route   GET /api/admin/dashboard
// @access  Private (Admin Only)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'STUDENT' });
    const totalAdmins = await User.countDocuments({ role: 'ADMIN' });

    const activeIssues = await CampusIssue.countDocuments({
      status: { $in: ['REPORTED', 'UNDER REVIEW', 'ASSIGNED', 'IN PROGRESS'] },
    });
    const resolvedIssues = await CampusIssue.countDocuments({
      status: { $in: ['RESOLVED', 'CLOSED'] },
    });
    const totalIssues = await CampusIssue.countDocuments();

    const totalHelpRequests = await HelpRequest.countDocuments();
    const openHelpRequests = await HelpRequest.countDocuments({
      status: { $in: ['OPEN', 'MATCHED', 'IN_PROGRESS'] },
    });

    const activeConnections = await Connection.countDocuments({
      status: { $in: ['PENDING', 'ACTIVE'] },
    });
    const completedConnections = await Connection.countDocuments({
      status: 'COMPLETED',
    });

    // Recent Urgent/High Issues
    const urgentIssues = await CampusIssue.find({
      status: { $nin: ['RESOLVED', 'CLOSED'] },
      severity: { $in: ['High', 'Critical'] },
    })
      .populate('reportedBy', 'name department email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Issues by category breakdown
    const categoryStats = await CampusIssue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Issues by status breakdown
    const statusStats = await CampusIssue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalAdmins,
        activeIssues,
        resolvedIssues,
        totalIssues,
        totalHelpRequests,
        openHelpRequests,
        activeConnections,
        completedConnections,
        urgentIssues,
        categoryStats,
        statusStats,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users for Admin
// @route   GET /api/admin/users
// @access  Private (Admin Only)
exports.getAdminUsers = async (req, res, next) => {
  try {
    const { role, department, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private (Admin Only)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role, department, year } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (role) user.role = role;
    if (department) user.department = department;
    if (year) user.year = year;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin issue management (assign, update status & severity)
// @route   PUT /api/admin/issues/:id
// @access  Private (Admin Only)
exports.updateAdminIssue = async (req, res, next) => {
  try {
    const { status, assignedTo, severity, resolutionNotes } = req.body;
    let issue = await CampusIssue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Campus issue not found.',
      });
    }

    const previousStatus = issue.status;

    if (status && status !== previousStatus) {
      issue.status = status;
      issue.statusHistory.push({
        status,
        updatedBy: req.user.name + ' (Admin)',
        notes: resolutionNotes || `Status transitioned to ${status}`,
        timestamp: new Date(),
      });
    }

    if (assignedTo !== undefined) issue.assignedTo = assignedTo;
    if (severity !== undefined) issue.severity = severity;
    if (resolutionNotes !== undefined) issue.resolutionNotes = resolutionNotes;

    await issue.save();

    const populated = await CampusIssue.findById(issue._id).populate(
      'reportedBy',
      'name email department year'
    );

    res.status(200).json({
      success: true,
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

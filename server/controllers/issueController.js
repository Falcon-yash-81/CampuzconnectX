const CampusIssue = require('../models/CampusIssue');

// @desc    Report a new campus issue
// @route   POST /api/issues
// @access  Private
exports.createIssue = async (req, res, next) => {
  try {
    const { title, description, category, location, severity, image } = req.body;

    const issue = await CampusIssue.create({
      title,
      description,
      category: category || 'Equipment',
      location,
      severity: severity || 'Medium',
      image: image || '',
      reportedBy: req.user.id,
      status: 'REPORTED',
      statusHistory: [
        {
          status: 'REPORTED',
          updatedBy: req.user.name,
          notes: 'Issue reported by student',
          timestamp: new Date(),
        },
      ],
    });

    const populated = await CampusIssue.findById(issue._id).populate(
      'reportedBy',
      'name email department year'
    );

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all campus issues with filtering
// @route   GET /api/issues
// @access  Private
exports.getIssues = async (req, res, next) => {
  try {
    const { category, severity, status, location, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (severity) query.severity = severity;
    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: 'i' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const issues = await CampusIssue.find(query)
      .populate('reportedBy', 'name email department year')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single campus issue with status history
// @route   GET /api/issues/:id
// @access  Private
exports.getIssueById = async (req, res, next) => {
  try {
    const issue = await CampusIssue.findById(req.params.id).populate(
      'reportedBy',
      'name email department year rating'
    );

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Campus issue not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get issues reported by current user
// @route   GET /api/issues/user/my-reports
// @access  Private
exports.getMyReportedIssues = async (req, res, next) => {
  try {
    const issues = await CampusIssue.find({ reportedBy: req.user.id })
      .populate('reportedBy', 'name email department year')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update an issue (Reporter or Admin)
// @route   PUT /api/issues/:id
// @access  Private
exports.updateIssue = async (req, res, next) => {
  try {
    let issue = await CampusIssue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Campus issue not found.',
      });
    }

    const isReporter = issue.reportedBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isReporter && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this issue.',
      });
    }

    // If status is being updated, add to history
    if (req.body.status && req.body.status !== issue.status) {
      issue.statusHistory.push({
        status: req.body.status,
        updatedBy: req.user.name,
        notes: req.body.resolutionNotes || `Status changed to ${req.body.status}`,
        timestamp: new Date(),
      });
    }

    // Apply allowed updates
    const allowedFields = [
      'title',
      'description',
      'category',
      'location',
      'severity',
      'image',
      'status',
      'assignedTo',
      'resolutionNotes',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        issue[field] = req.body[field];
      }
    });

    await issue.save();

    const updated = await CampusIssue.findById(issue._id).populate(
      'reportedBy',
      'name email department year'
    );

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete issue report
// @route   DELETE /api/issues/:id
// @access  Private
exports.deleteIssue = async (req, res, next) => {
  try {
    const issue = await CampusIssue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Campus issue not found.',
      });
    }

    if (
      issue.reportedBy.toString() !== req.user.id &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this issue report.',
      });
    }

    await issue.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Campus issue report deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

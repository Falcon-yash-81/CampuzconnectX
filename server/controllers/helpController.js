const HelpRequest = require('../models/HelpRequest');
const Connection = require('../models/Connection');

// @desc    Create a new help request
// @route   POST /api/help
// @access  Private
exports.createHelpRequest = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      requiredSkills,
      location,
      urgency,
      availability,
    } = req.body;

    let parsedSkills = requiredSkills;
    if (typeof requiredSkills === 'string') {
      parsedSkills = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const helpRequest = await HelpRequest.create({
      title,
      description,
      category: category || 'Programming',
      requiredSkills: parsedSkills,
      location: location || 'Main Campus',
      urgency: urgency || 'Medium',
      availability: availability || 'Flexible',
      requester: req.user.id,
    });

    const populated = await HelpRequest.findById(helpRequest._id).populate(
      'requester',
      'name email department year rating reputationScore'
    );

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all help requests with filters
// @route   GET /api/help
// @access  Private
exports.getHelpRequests = async (req, res, next) => {
  try {
    const { category, urgency, status, search, skill } = req.query;
    let query = {};

    if (category) query.category = category;
    if (urgency) query.urgency = urgency;
    if (status) {
      query.status = status;
    } else {
      // Default: show open and matched requests first
      query.status = { $in: ['OPEN', 'MATCHED', 'IN_PROGRESS'] };
    }

    if (skill) {
      query.requiredSkills = { $regex: new RegExp(skill, 'i') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
      ];
    }

    const requests = await HelpRequest.find(query)
      .populate('requester', 'name email department year rating reputationScore')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single help request by ID
// @route   GET /api/help/:id
// @access  Private
exports.getHelpRequestById = async (req, res, next) => {
  try {
    const request = await HelpRequest.findById(req.params.id).populate(
      'requester',
      'name email department year rating reputationScore bio skills availability'
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found.',
      });
    }

    // Check if there is an existing active or pending connection for this request
    const connection = await Connection.findOne({
      helpRequest: request._id,
      status: { $in: ['PENDING', 'ACCEPTED', 'ACTIVE'] },
    }).populate('helper', 'name email department year rating reputationScore');

    res.status(200).json({
      success: true,
      data: request,
      currentConnection: connection || null,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update help request
// @route   PUT /api/help/:id
// @access  Private
exports.updateHelpRequest = async (req, res, next) => {
  try {
    let request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found.',
      });
    }

    // Check ownership
    if (
      request.requester.toString() !== req.user.id &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this help request.',
      });
    }

    if (req.body.requiredSkills && typeof req.body.requiredSkills === 'string') {
      req.body.requiredSkills = req.body.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    request = await HelpRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('requester', 'name email department year rating reputationScore');

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete help request
// @route   DELETE /api/help/:id
// @access  Private
exports.deleteHelpRequest = async (req, res, next) => {
  try {
    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found.',
      });
    }

    if (
      request.requester.toString() !== req.user.id &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this help request.',
      });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Help request deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get requests created by current user
// @route   GET /api/help/user/my-requests
// @access  Private
exports.getMyHelpRequests = async (req, res, next) => {
  try {
    const requests = await HelpRequest.find({ requester: req.user.id })
      .populate('requester', 'name email department year')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

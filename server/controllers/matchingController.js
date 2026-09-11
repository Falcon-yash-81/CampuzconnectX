const HelpRequest = require('../models/HelpRequest');
const User = require('../models/User');
const { calculateMatches } = require('../services/matchingEngine');

// @desc    Get recommended student matches for a specific help request
// @route   GET /api/help/:id/matches
// @access  Private
exports.getMatchesForRequest = async (req, res, next) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.id).populate(
      'requester',
      'name email department year rating reputationScore'
    );

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found.',
      });
    }

    // Find all active students except requester
    const candidates = await User.find({
      _id: { $ne: helpRequest.requester._id },
      role: 'STUDENT',
    }).select('-password');

    // Run smart matching engine
    const matches = calculateMatches(helpRequest, candidates);

    // If matches found and request status was OPEN, update to MATCHED
    if (matches.length > 0 && helpRequest.status === 'OPEN') {
      helpRequest.status = 'MATCHED';
      await helpRequest.save();
    }

    res.status(200).json({
      success: true,
      count: matches.length,
      helpRequestId: helpRequest._id,
      requiredSkills: helpRequest.requiredSkills,
      data: matches,
    });
  } catch (err) {
    next(err);
  }
};

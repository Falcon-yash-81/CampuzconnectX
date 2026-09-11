const Connection = require('../models/Connection');
const HelpRequest = require('../models/HelpRequest');
const User = require('../models/User');

// @desc    Send help connection request to a student
// @route   POST /api/connections
// @access  Private
exports.createConnection = async (req, res, next) => {
  try {
    const { helperId, helpRequestId } = req.body;

    if (!helperId || !helpRequestId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both helperId and helpRequestId.',
      });
    }

    if (helperId.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request assistance from yourself.',
      });
    }

    // Verify help request exists and user is owner
    const helpRequest = await HelpRequest.findById(helpRequestId);
    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found.',
      });
    }

    if (helpRequest.requester.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only request assistance for your own help requests.',
      });
    }

    // Check if duplicate active connection exists
    const existing = await Connection.findOne({
      helpRequest: helpRequestId,
      helper: helperId,
      status: { $in: ['PENDING', 'ACCEPTED', 'ACTIVE'] },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An active connection or pending request already exists with this student.',
      });
    }

    const connection = await Connection.create({
      requester: req.user.id,
      helper: helperId,
      helpRequest: helpRequestId,
      status: 'PENDING',
    });

    const populated = await Connection.findById(connection._id)
      .populate('requester', 'name email department year rating reputationScore')
      .populate('helper', 'name email department year rating reputationScore skills')
      .populate('helpRequest', 'title description category requiredSkills location urgency');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's connections (sent and received)
// @route   GET /api/connections
// @access  Private
exports.getConnections = async (req, res, next) => {
  try {
    const { type, status } = req.query;
    let query = {};

    if (type === 'received') {
      query.helper = req.user.id;
    } else if (type === 'sent') {
      query.requester = req.user.id;
    } else {
      query.$or = [{ requester: req.user.id }, { helper: req.user.id }];
    }

    if (status) {
      query.status = status;
    }

    const connections = await Connection.find(query)
      .populate('requester', 'name email department year rating reputationScore')
      .populate('helper', 'name email department year rating reputationScore skills')
      .populate('helpRequest', 'title description category requiredSkills location urgency status')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: connections.length,
      data: connections,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Accept, Reject, or Cancel connection
// @route   PUT /api/connections/:id
// @access  Private
exports.updateConnectionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found.',
      });
    }

    const isHelper = connection.helper.toString() === req.user.id;
    const isRequester = connection.requester.toString() === req.user.id;

    if (!isHelper && !isRequester && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this connection.',
      });
    }

    if (status === 'ACCEPTED') {
      if (!isHelper && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Only the requested helper can accept this connection.',
        });
      }
      connection.status = 'ACTIVE';
      await HelpRequest.findByIdAndUpdate(connection.helpRequest, {
        status: 'IN_PROGRESS',
      });
    } else if (status === 'REJECTED') {
      if (!isHelper && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Only the requested helper can reject this connection.',
        });
      }
      connection.status = 'REJECTED';
    } else if (status === 'CANCELLED') {
      if (!isRequester && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Only the requester can cancel this connection.',
        });
      }
      connection.status = 'CANCELLED';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid status update requested.',
      });
    }

    await connection.save();

    const updated = await Connection.findById(connection._id)
      .populate('requester', 'name email department year rating reputationScore')
      .populate('helper', 'name email department year rating reputationScore skills')
      .populate('helpRequest', 'title description category status');

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Complete assistance and rate helper
// @route   POST /api/connections/:id/complete
// @access  Private
exports.completeConnection = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found.',
      });
    }

    if (
      connection.requester.toString() !== req.user.id &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only the requester can complete and rate this assistance.',
      });
    }

    connection.status = 'COMPLETED';
    connection.completedAt = new Date();
    if (rating) connection.rating = Number(rating);
    if (feedback) connection.feedback = feedback.trim();
    await connection.save();

    // Mark help request as RESOLVED
    await HelpRequest.findByIdAndUpdate(connection.helpRequest, {
      status: 'RESOLVED',
    });

    // Update Requester stats
    await User.findByIdAndUpdate(connection.requester, {
      $inc: { requestsCompleted: 1 },
    });

    // Update Helper stats, rating, and reputation score
    const helper = await User.findById(connection.helper);
    if (helper) {
      const currentRatingCount = helper.ratingsCount || 0;
      const currentRating = helper.rating || 5.0;
      const newRatingCount = currentRatingCount + (rating ? 1 : 0);
      let updatedRating = currentRating;

      if (rating && newRatingCount > 0) {
        updatedRating = Number(
          (
            (currentRating * currentRatingCount + Number(rating)) /
            newRatingCount
          ).toFixed(1)
        );
      }

      const requestsHelped = (helper.requestsHelped || 0) + 1;

      // Smart Reputation Score calculation (0 - 100)
      // Factors: Base (40) + Rating weight (up to 40) + Helped requests (up to 20)
      const ratingFactor = (updatedRating / 5) * 40;
      const helpedFactor = Math.min(requestsHelped * 2.5, 20);
      const calculatedReputation = Math.min(
        100,
        Math.round(40 + ratingFactor + helpedFactor)
      );

      helper.requestsHelped = requestsHelped;
      helper.rating = updatedRating;
      helper.ratingsCount = newRatingCount;
      helper.reputationScore = calculatedReputation;
      await helper.save();
    }

    const updated = await Connection.findById(connection._id)
      .populate('requester', 'name email department year rating reputationScore')
      .populate('helper', 'name email department year rating reputationScore')
      .populate('helpRequest', 'title description category status');

    res.status(200).json({
      success: true,
      message: 'Assistance completed and rating recorded successfully!',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

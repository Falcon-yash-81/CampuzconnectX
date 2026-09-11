const User = require('../models/User');

// @desc    Get all students / search users
// @route   GET /api/users
// @access  Private
exports.getAllUsers = async (req, res, next) => {
  try {
    const { skill, department, search } = req.query;
    let query = { role: 'STUDENT' };

    if (department) {
      query.department = department;
    }

    if (skill) {
      query.skills = { $regex: new RegExp(skill, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ reputationScore: -1, rating: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user profile
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update current student profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      department: req.body.department,
      year: req.body.year,
      bio: req.body.bio,
      availability: req.body.availability,
    };

    // Remove undefined
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update student skills & learning interests
// @route   PUT /api/users/skills
// @access  Private
exports.updateSkills = async (req, res, next) => {
  try {
    const { skills, learningSkills } = req.body;
    const updateData = {};

    if (Array.isArray(skills)) {
      updateData.skills = skills.map((s) => s.trim()).filter(Boolean);
    }
    if (Array.isArray(learningSkills)) {
      updateData.learningSkills = learningSkills
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Skill Exchange Suggestions (Mutual learning matches)
// @route   GET /api/users/skill-exchanges
// @access  Private
exports.getSkillExchanges = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const myTeaches = (currentUser.skills || []).map((s) =>
      s.trim().toLowerCase()
    );
    const myWants = (currentUser.learningSkills || []).map((s) =>
      s.trim().toLowerCase()
    );

    if (myTeaches.length === 0 || myWants.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message:
          'Add both skills you can teach and skills you want to learn to discover skill exchanges.',
      });
    }

    const otherStudents = await User.find({
      _id: { $ne: currentUser._id },
      role: 'STUDENT',
    }).select('-password');

    const exchanges = [];

    otherStudents.forEach((student) => {
      const studentTeaches = (student.skills || []).map((s) =>
        s.trim().toLowerCase()
      );
      const studentWants = (student.learningSkills || []).map((s) =>
        s.trim().toLowerCase()
      );

      // Mutual exchange check:
      // What I teach matches what they want
      const theyLearnFromMe = myTeaches.filter((skill) =>
        studentWants.includes(skill)
      );
      // What they teach matches what I want
      const iLearnFromThey = studentTeaches.filter((skill) =>
        myWants.includes(skill)
      );

      if (theyLearnFromMe.length > 0 && iLearnFromThey.length > 0) {
        exchanges.push({
          student,
          iCanTeachThem: theyLearnFromMe,
          theyCanTeachMe: iLearnFromThey,
          matchStrength: 'Direct Mutual Exchange',
        });
      }
    });

    res.status(200).json({
      success: true,
      count: exchanges.length,
      data: exchanges,
    });
  } catch (err) {
    next(err);
  }
};

const mongoose = require('mongoose');

const HelpRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a request title'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Please add a request description'],
    },
    category: {
      type: String,
      enum: [
        'Programming',
        'Design',
        'Academics',
        'Technology',
        'Communication',
        'Creative',
        'Other',
      ],
      default: 'Programming',
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Please specify at least one required skill'],
      validate: [
        (val) => val.length > 0,
        'At least one required skill is needed',
      ],
    },
    location: {
      type: String,
      default: 'Main Campus',
      trim: true,
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    availability: {
      type: String,
      enum: ['Immediate', 'Today', 'Weekdays', 'Weekends', 'Flexible'],
      default: 'Flexible',
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'MATCHED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
      default: 'OPEN',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HelpRequest', HelpRequestSchema);

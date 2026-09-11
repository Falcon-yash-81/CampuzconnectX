const mongoose = require('mongoose');

const CampusIssueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an issue title'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed issue description'],
    },
    category: {
      type: String,
      enum: [
        'Electrical',
        'Plumbing',
        'Internet / Wi-Fi',
        'Infrastructure',
        'Laboratory',
        'Classroom',
        'Equipment',
        'Cleanliness',
        'Security',
        'Other',
      ],
      default: 'Equipment',
    },
    location: {
      type: String,
      required: [true, 'Please specify the campus location'],
      trim: true,
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    image: {
      type: String,
      default: '',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: String,
      default: 'Unassigned',
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'REPORTED',
        'UNDER REVIEW',
        'ASSIGNED',
        'IN PROGRESS',
        'RESOLVED',
        'CLOSED',
      ],
      default: 'REPORTED',
    },
    resolutionNotes: {
      type: String,
      default: '',
      trim: true,
    },
    statusHistory: [
      {
        status: String,
        updatedBy: String,
        notes: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to track initial status history
CampusIssueSchema.pre('save', function (next) {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [
      {
        status: this.status,
        updatedBy: 'System',
        notes: 'Issue reported by student',
        timestamp: new Date(),
      },
    ];
  }
  next();
});

module.exports = mongoose.model('CampusIssue', CampusIssueSchema);

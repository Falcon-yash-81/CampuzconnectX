const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const HelpRequest = require('../models/HelpRequest');
const CampusIssue = require('../models/CampusIssue');
const Connection = require('../models/Connection');
const { connectDB } = require('../config/db');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAll = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await HelpRequest.deleteMany({});
    await CampusIssue.deleteMany({});
    await Connection.deleteMany({});

    console.log('[Seed] Creating Seed Users...');

    // Admin
    const admin = await User.create({
      name: 'Campus Administrator',
      email: 'admin@campusconnect.edu',
      password: 'Admin@123',
      role: 'ADMIN',
      department: 'Campus Administration',
      year: 'Faculty/Staff',
      bio: 'Central campus management and issue resolution team.',
      rating: 5.0,
      reputationScore: 100,
    });

    // Student A (Helper - Yashas Gowda)
    const yashas = await User.create({
      name: 'Yashas Gowda',
      email: 'yashas@campusconnect.edu',
      password: 'Student@123',
      role: 'STUDENT',
      department: 'Computer Science',
      year: '3rd Year',
      bio: 'Mobile & Web developer passionate about Flutter, Node.js, and cloud backends. Ready to help peers debug & build.',
      skills: ['Flutter', 'Firebase', 'Dart', 'JavaScript', 'Node.js', 'UI/UX'],
      learningSkills: ['Python', 'AWS', 'Machine Learning'],
      availability: 'Weekdays',
      rating: 4.9,
      reputationScore: 95,
      requestsHelped: 17,
      requestsCompleted: 5,
    });

    // Student B (Learner - Alex Rivera)
    const alex = await User.create({
      name: 'Alex Rivera',
      email: 'alex@campusconnect.edu',
      password: 'Student@123',
      role: 'STUDENT',
      department: 'Information Science',
      year: '2nd Year',
      bio: 'Passionate sophomore working on mobile projects. Eager to master Flutter and Firebase authentication.',
      skills: ['Java', 'HTML/CSS', 'Python'],
      learningSkills: ['Flutter', 'Firebase', 'Dart'],
      availability: 'Today',
      rating: 4.7,
      reputationScore: 80,
      requestsHelped: 4,
      requestsCompleted: 6,
    });

    // Student C (Designer - Sarah Chen)
    const sarah = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@campusconnect.edu',
      password: 'Student@123',
      role: 'STUDENT',
      department: 'Design & Media',
      year: '4th Year',
      bio: 'UI/UX designer and presentation specialist. Willing to help with wireframes, Figma, and design systems.',
      skills: ['UI/UX', 'Figma', 'Design', 'Illustrator', 'Presentations'],
      learningSkills: ['Flutter', 'JavaScript'],
      availability: 'Flexible',
      rating: 5.0,
      reputationScore: 92,
      requestsHelped: 12,
      requestsCompleted: 3,
    });

    console.log('[Seed] Creating Seed Help Requests...');

    // Request 1: Alex needs Flutter Firebase help (Perfect 100% match for Yashas!)
    const reqFlutter = await HelpRequest.create({
      title: 'Need help with Flutter Firebase',
      description:
        'Need help connecting Firebase authentication and Cloud Firestore database to my Flutter mobile application for my capstone course.',
      category: 'Programming',
      requiredSkills: ['Flutter', 'Firebase', 'Dart'],
      location: 'ECE Block',
      urgency: 'Medium',
      availability: 'Weekdays',
      requester: alex._id,
      status: 'OPEN',
    });

    // Request 2: Sarah needs Python dataset help
    const reqPython = await HelpRequest.create({
      title: 'Help with Python dataset processing',
      description:
        'Need guidance running Pandas and OpenCV data cleaning scripts for my UI usability study.',
      category: 'Technology',
      requiredSkills: ['Python'],
      location: 'Central Library',
      urgency: 'Low',
      availability: 'Flexible',
      requester: sarah._id,
      status: 'OPEN',
    });

    console.log('[Seed] Creating Seed Campus Issues...');

    // Issue 1: High severity projector issue reported by Alex
    await CampusIssue.create({
      title: 'Projector not working in Seminar Hall',
      description:
        'The main overhead ceiling projector in Seminar Hall 2 fails to detect HDMI input and power LED blinks red.',
      category: 'Equipment',
      location: 'Seminar Hall 2',
      severity: 'High',
      reportedBy: alex._id,
      status: 'REPORTED',
      statusHistory: [
        {
          status: 'REPORTED',
          updatedBy: alex.name,
          notes: 'Reported by student via CampusConnect',
          timestamp: new Date(Date.now() - 3600000 * 3),
        },
      ],
    });

    // Issue 2: Wi-Fi issue
    await CampusIssue.create({
      title: 'Wi-Fi disconnects frequently on 2nd Floor Library',
      description:
        'Campus-Secure Wi-Fi router AP-LIB-02 drops connection every 5 minutes in the silent study area.',
      category: 'Internet / Wi-Fi',
      location: 'Central Library 2nd Floor',
      severity: 'High',
      reportedBy: sarah._id,
      status: 'UNDER REVIEW',
      assignedTo: 'IT Network Infrastructure',
      statusHistory: [
        {
          status: 'REPORTED',
          updatedBy: sarah.name,
          notes: 'Reported by student',
          timestamp: new Date(Date.now() - 3600000 * 24),
        },
        {
          status: 'UNDER REVIEW',
          updatedBy: 'Admin Authority',
          notes: 'Sent to IT Network Operations team for router diagnostics',
          timestamp: new Date(Date.now() - 3600000 * 12),
        },
      ],
    });

    // Issue 3: Plumbing issue
    await CampusIssue.create({
      title: 'Water faucet leakage in Restroom 3B',
      description: 'Slow leak in third sink faucet causing water wastage.',
      category: 'Plumbing',
      location: 'Academic Block B - 3rd Floor',
      severity: 'Low',
      reportedBy: yashas._id,
      status: 'RESOLVED',
      assignedTo: 'Facility Maintenance',
      resolutionNotes: 'Washer replaced and valve tightened.',
      statusHistory: [
        {
          status: 'REPORTED',
          updatedBy: yashas.name,
          notes: 'Reported by student',
          timestamp: new Date(Date.now() - 3600000 * 48),
        },
        {
          status: 'ASSIGNED',
          updatedBy: 'Admin Authority',
          notes: 'Assigned to Facility Maintenance plumber',
          timestamp: new Date(Date.now() - 3600000 * 24),
        },
        {
          status: 'RESOLVED',
          updatedBy: 'Facility Maintenance',
          notes: 'Washer replaced and tested. Issue fully resolved.',
          timestamp: new Date(Date.now() - 3600000 * 4),
        },
      ],
    });

    console.log('[Seed] Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('DEMO ACCOUNTS READY:');
    console.log('1. Admin: admin@campusconnect.edu / Admin@123');
    console.log('2. Helper: yashas@campusconnect.edu / Student@123');
    console.log('3. Requester: alex@campusconnect.edu / Student@123');
    console.log('----------------------------------------------------');

    return true;
  } catch (err) {
    console.error('[Seed Error]:', err);
    throw err;
  }
};

// If run directly from terminal
if (require.main === module) {
  seedAll().then(() => process.exit(0));
}

module.exports = seedAll;

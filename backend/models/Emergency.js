const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  petName: {
    type: String,
    required: true
  },
  petType: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'other']
  },
  emergencyType: {
    type: String,
    required: true,
    enum: ['medical', 'accident', 'other']
  },
  emergencyDetails: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'responded', 'resolved']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Emergency', emergencySchema);
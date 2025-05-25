const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  petName: {
    type: String,
    required: true
  },
  petType: {
    type: String,
    enum: ['dog', 'cat', 'other'],
    required: true
  },
  breed: {
    type: String
  },
  ageGroup: {
    type: String,
    enum: ['puppy', 'adult', 'senior']
  },
  petSize: {
    type: String,
    enum: ['small', 'medium', 'large']
  },
  services: {
    type: [String],
    default: []
  },
  preferredDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true
  },
  urgency: {
    type: String,
    enum: ['routine', 'emergency'],
    default: 'routine'
  },
  specialRequests: {
    type: String
  },
  medicalInfo: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
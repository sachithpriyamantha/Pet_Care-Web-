const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
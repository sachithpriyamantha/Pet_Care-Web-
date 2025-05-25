const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'fish', 'reptile', 'small_mammal', 'other'],
    default: 'dog'
  },
  breed: {
    type: String,
    trim: true
  },
  birthDate: {
    type: Date
  },
  age: {
    type: String,
    trim: true
  },
  weight: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  color: {
    type: String,
    trim: true
  },
  microchipNumber: {
    type: String,
    trim: true
  },
  allergies: {
    type: String,
    trim: true
  },
  medicalConditions: {
    type: String,
    trim: true
  },
  dietaryRequirements: {
    type: String,
    trim: true
  },
  vetName: {
    type: String,
    trim: true
  },
  vetPhone: {
    type: String,
    trim: true
  },
  ownerName: { 
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pet', petSchema);
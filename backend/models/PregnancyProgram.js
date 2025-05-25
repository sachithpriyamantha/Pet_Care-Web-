const mongoose = require('mongoose');

const pregnancyProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  trimester: {
    type: String,
    required: [true, 'Trimester is required'],
    enum: {
      values: ['first', 'second', 'third'],
      message: 'Invalid trimester value'
    }
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    enum: {
      values: ['4 weeks', '8 weeks', '12 weeks'],
      message: 'Invalid duration value'
    }
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

pregnancyProgramSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PregnancyProgram', pregnancyProgramSchema);
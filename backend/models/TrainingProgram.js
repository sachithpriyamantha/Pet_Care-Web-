const mongoose = require('mongoose');

const trainingProgramSchema = new mongoose.Schema({
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
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    enum: {
      values: ['4 weeks', '6 weeks', '8 weeks', '12 weeks'],
      message: 'Invalid duration value'
    }
  },

 
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: {
      values: ['beginner', 'intermediate', 'advanced'],
      message: 'Invalid difficulty level'
    }
  },
  videos: [{
    name: String,
    path: String, 
    size: Number,
    mimetype: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

trainingProgramSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);
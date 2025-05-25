const express = require('express');
const TrainingProgram = require('../models/TrainingProgram.js');
const auth = require('../middleware/authMiddleware.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});


router.get('/', async (req, res) => {
  try {
    const programs = await TrainingProgram.find().sort('-createdAt');
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', auth, upload.array('videos', 2), async (req, res) => {
  try {
    const { title, description, duration, price, difficulty } = req.body;
    
    const videos = req.files.map(file => ({
      name: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));

    const program = new TrainingProgram({
      title,
      description,
      duration,
      price,
      difficulty,
      videos
    });

    await program.save();
    res.status(201).json(program);
  } catch (error) {
    
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(400).json({ message: error.message });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const program = await TrainingProgram.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    
    res.json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const program = await TrainingProgram.findByIdAndDelete(req.params.id);
    
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const Caregiver = require('../models/caregiverModel');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/caregivers/');
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
  storage,
  fileFilter: (req, file, cb) => {
    
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});


const uploadMiddleware = (req, res, next) => {
  const uploadSingle = upload.single('profileImage');
  
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ 
        message: err.message || 'Error uploading file' 
      });
    }
    next();
  });
};


router.post('/', uploadMiddleware, async (req, res) => {
  try {
    console.log('Received data:', req.body);
    

    const requiredFields = ['name', 'email', 'phone', 'specialization', 'experience'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ 
          message: `Missing required field: ${field}` 
        });
      }
    }
    
    const caregiverData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      specialization: req.body.specialization,
      experience: req.body.experience,
    };
    

    if (req.file) {

      caregiverData.profileImage = `/uploads/caregivers/${req.file.filename}`;
    }
    
    const caregiver = new Caregiver(caregiverData);
    const savedCaregiver = await caregiver.save();
    
    console.log('Caregiver saved:', savedCaregiver);
    res.status(201).json(savedCaregiver);
  } catch (error) {
    console.error('Error creating caregiver:', error);
    

    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'A caregiver with this email already exists' 
      });
    }
    
    res.status(400).json({ 
      message: error.message || 'Failed to create caregiver' 
    });
  }
});


router.patch('/:id', uploadMiddleware, async (req, res) => {
  try {
    const caregiverId = req.params.id;
    console.log(`Updating caregiver ${caregiverId}:`, req.body);
    

    const existingCaregiver = await Caregiver.findById(caregiverId);
    if (!existingCaregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }
    
    const updates = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      specialization: req.body.specialization,
      experience: req.body.experience,
    };
    

    Object.keys(updates).forEach(key => 
      updates[key] === undefined && delete updates[key]
    );
    
  
    if (req.file) {
      updates.profileImage = `/uploads/caregivers/${req.file.filename}`;
      

      if (existingCaregiver.profileImage) {
        const oldImagePath = path.join(__dirname, '..', existingCaregiver.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    const updatedCaregiver = await Caregiver.findByIdAndUpdate(
      caregiverId, 
      updates, 
      { new: true, runValidators: true }
    );
    
    console.log('Caregiver updated:', updatedCaregiver);
    res.status(200).json(updatedCaregiver);
  } catch (error) {
    console.error('Error updating caregiver:', error);
    

    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'A caregiver with this email already exists' 
      });
    }
    
    res.status(400).json({ 
      message: error.message || 'Failed to update caregiver' 
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const caregivers = await Caregiver.find({}).sort({ createdAt: -1 });
    res.status(200).json(caregivers);
  } catch (error) {
    console.error('Error fetching caregivers:', error);
    res.status(400).json({ message: 'Failed to fetch caregivers' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id);
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }
    res.status(200).json(caregiver);
  } catch (error) {
    console.error('Error fetching caregiver:', error);
    res.status(400).json({ message: 'Failed to fetch caregiver' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const caregiverId = req.params.id;
    

    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }
    

    if (caregiver.profileImage) {
      const imagePath = path.join(__dirname, '..', caregiver.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image file: ${imagePath}`);
      }
    }

    await Caregiver.findByIdAndDelete(caregiverId);
    console.log(`Deleted caregiver with ID: ${caregiverId}`);
    
    res.status(200).json({ message: 'Caregiver deleted successfully' });
  } catch (error) {
    console.error('Error deleting caregiver:', error);
    res.status(500).json({ message: 'Failed to delete caregiver' });
  }
});

module.exports = router;
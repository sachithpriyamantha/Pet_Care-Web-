const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const Emergency = require('../models/Emergency');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const emergency = new Emergency({
      ...req.body,
      user: req.session.userId
    });
    await emergency.save();
    res.status(201).json(emergency);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/my-requests', authMiddleware, async (req, res) => {
  try {
    const emergencies = await Emergency.find({ user: req.session.userId })
      .sort({ createdAt: -1 });
    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const emergencies = await Emergency.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('user', 'username email');
    
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }
    
    res.json(emergency);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




module.exports = router;
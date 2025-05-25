const express = require('express');
const PregnancyProgram = require('../models/PregnancyProgram.js');
const auth = require('../middleware/authMiddleware.js');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const programs = await PregnancyProgram.find().sort('-createdAt');
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const program = await PregnancyProgram.findById(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const program = new PregnancyProgram({
      title: req.body.title,
      description: req.body.description,
      trimester: req.body.trimester,
      duration: req.body.duration
    });
    
    await program.save();
    res.status(201).json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const program = await PregnancyProgram.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        trimester: req.body.trimester,
        duration: req.body.duration
      },
      { new: true, runValidators: true }
    );
    
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const program = await PregnancyProgram.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
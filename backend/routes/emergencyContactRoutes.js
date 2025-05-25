const express = require('express');
const router = express.Router();
const EmergencyContact = require('../models/EmergencyContact');


router.get('/', async (req, res) => {
  try {
    const contacts = await EmergencyContact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
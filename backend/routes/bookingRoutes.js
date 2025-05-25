const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const bookingController = require('../controllers/bookingController');



router.post('/', bookingController.createBooking);


router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'userId',
        select: 'username email'
      });
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch grooming appointments' });
  }
});

module.exports = router;
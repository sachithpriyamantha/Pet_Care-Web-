
const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Grooming appointment created successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create grooming appointment', error: error.message });
  }
};
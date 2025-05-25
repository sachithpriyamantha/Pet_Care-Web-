const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const sendEmail = require('../utils/sendEmail');


router.post('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const booking = await Booking.findById(id)
      .populate({
        path: 'userId',
        select: 'username email'
      });
      
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();

   
    const emailData = {
        petName: booking.petName,
        preferredDate: booking.preferredDate,
        userName: booking.userId.username || 'Valued Customer'
      };
      

    await sendEmail(booking.userId.email, status, emailData);

    res.status(200).json({ message: `Booking ${status} and email sent.` });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
const Booking = require('../models/CaregiverBooking');
const sendEmail = require('../utils/sendEmail'); 

// Accept Booking
const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user caregiver');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'accepted';
    await booking.save();

    await sendEmail(
        booking.user.email,
        'accepted',
        {
          userName: booking.user.username,
          caregiverName: booking.caregiver.name,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime
        },
        'caregiver'
      );
      

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while accepting booking' });
  }
};


const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user caregiver');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'rejected';
    await booking.save();

    await sendEmail(
        booking.user.email,
        'rejected',
        {
          userName: booking.user.username,
          caregiverName: booking.caregiver.name,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime
        },
        'caregiver'
      );
      

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while rejecting booking' });
  }
};

module.exports = { acceptBooking, rejectBooking };

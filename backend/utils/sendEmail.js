const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jtdsiriwardena@gmail.com',
    pass: 'xsse xbat swyt kekk' 
  }
});

/**
 * Sends a styled email for pet or caregiver bookings
 * @param {string} to - recipient email
 * @param {string} status - 'accepted' or 'rejected'
 * @param {object} booking - booking object
 *        (for pet: petName, preferredDate, userName)
 *        (for caregiver: caregiverName, date, startTime, endTime, userName)
 * @param {string} type - 'pet' or 'caregiver'
 */
const sendEmail = async (to, status, booking, type = 'pet') => {
  let subject = '';
  let html = '';

  if (type === 'pet') {
    const { petName, preferredDate, userName } = booking;
    const formattedDate = new Date(preferredDate).toLocaleDateString();

    subject = status === 'accepted'
      ? 'Your Pet Booking is Confirmed!'
      : 'Your Pet Booking was Rejected';

    html = status === 'accepted'
      ? `<h2 style="color: #4CAF50;">Booking Confirmed! 🎉</h2>
         <p>Dear ${userName},</p>
         <p>Your booking for <strong>${petName}</strong> on <strong>${formattedDate}</strong> has been <strong>accepted</strong>.</p>`
      : `<h2 style="color: #F44336;">Booking Rejected</h2>
         <p>Dear ${userName},</p>
         <p>We're sorry, your booking for <strong>${petName}</strong> on <strong>${formattedDate}</strong> was <strong>rejected</strong>.</p>`;
  } else if (type === 'caregiver') {
    const { caregiverName, date, startTime, endTime, userName } = booking;
    const formattedDate = new Date(date).toLocaleDateString();

    subject = status === 'accepted'
      ? 'Your Caregiver Booking is Confirmed!'
      : 'Your Caregiver Booking was Rejected';

    html = status === 'accepted'
      ? `<h2 style="color: #4CAF50;">Caregiver Booking Confirmed! 🎉</h2>
         <p>Dear ${userName},</p>
         <p>Your booking with <strong>${caregiverName}</strong> on <strong>${formattedDate}</strong> (${startTime} - ${endTime}) has been <strong>accepted</strong>.</p>`
      : `<h2 style="color: #F44336;">Caregiver Booking Rejected</h2>
         <p>Dear ${userName},</p>
         <p>We're sorry, your booking with <strong>${caregiverName}</strong> on <strong>${formattedDate}</strong> was <strong>rejected</strong>.</p>`;
  }


  html += `
    <br />
    <p>Warm regards,<br/>The Pet Daycare Team</p>`;

  try {
    await transporter.sendMail({
      from: '"Pet Daycare" <jtdsiriwardena@gmail.com>',
      to,
      subject,
      html: `<html><body style="font-family: Arial, sans-serif; line-height: 1.6;">${html}</body></html>`,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;

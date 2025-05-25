const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');


router.post('/process', async (req, res) => {
  try {
    const { orderId, amount, paymentMethod, petItems, customer } = req.body;
    
    const payment = new Payment({
      orderId,
      amount,
      paymentMethod,
      petItems,
      customer,
      status: 'completed'
    });

    await payment.save();
    
    res.json({
      success: true,
      message: 'Payment processed successfully',
      paymentId: payment._id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Payment processing failed' });
  }
});


router.get('/admin', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payments' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');


router.post('/', async (req, res) => {
  const {
    userId,
    orderId,
    cardHolderName,
    cardNumber,
    expiryDate,
    cvv,
    billingAddress,
    amount
  } = req.body;

  try {
    const payment = new Payment({
      userId,
      orderId,
      cardHolderName,
      cardNumber,
      expiryDate,
      cvv,
      billingAddress,
      amount
    });

    const newPayment = await payment.save();
    res.status(201).json(newPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
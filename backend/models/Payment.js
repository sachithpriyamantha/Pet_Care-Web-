const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  cardHolderName: {
    type: String,
    required: true,
    trim: true
  },
  cardNumber: {
    type: String,
    required: true,
    trim: true
  },
  expiryDate: {
    type: String,
    required: true,
    match: [/^(0[1-9]|1[0-2])\/[0-9]{2}$/, 'Invalid expiry date (MM/YY)']
  },
  cvv: {
    type: String,
    required: true,
    match: [/^[0-9]{3,4}$/, 'Invalid CVV']
  },
  billingAddress: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true }
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


PaymentSchema.pre('save', function(next) {
  if (this.cardNumber) {
    this.cardNumber = '****-****-****-' + this.cardNumber.slice(-4);
  }
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);
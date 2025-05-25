import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'credit_card',
    petItems: [
      { petId: 'pet1', name: 'Dog Food', price: 25.99, quantity: 1 }
    ]
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const orderId = `order_${Date.now()}`;
      const amount = formData.petItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      const paymentData = {
        orderId,
        amount,
        paymentMethod: formData.paymentMethod,
        petItems: formData.petItems,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }
      };

      const response = await axios.post('http://localhost:5000/api/payments/process', paymentData);
      
      setPaymentStatus({
        success: true,
        message: 'Payment successful!',
        paymentId: response.data.paymentId
      });
    } catch (error) {
      setPaymentStatus({
        success: false,
        message: 'Payment failed. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form">
      <h2>PetShop Checkout</h2>
      
      {paymentStatus ? (
        <div className={`payment-status ${paymentStatus.success ? 'success' : 'error'}`}>
          <p>{paymentStatus.message}</p>
          {paymentStatus.success && (
            <p>Transaction ID: {paymentStatus.paymentId}</p>
          )}
          <button onClick={() => setPaymentStatus(null)}>Make Another Payment</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
          
          <div className="order-summary">
            <h3>Order Summary</h3>
            <ul>
              {formData.petItems.map((item, index) => (
                <li key={index}>
                  {item.name} - ${item.price} x {item.quantity}
                </li>
              ))}
            </ul>
            <p className="total">
              Total: $
              {formData.petItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
            </p>
          </div>
          
          <button type="submit" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;
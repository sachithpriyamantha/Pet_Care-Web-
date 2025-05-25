import React, { useState } from 'react';
import axios from 'axios';
import { FaCreditCard, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

const PaymentForm = ({ cart, totalPrice, onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardFocus, setCardFocus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .substring(0, 19);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
   
    if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 5);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    if (name.includes('billingAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: { ...prev.billingAddress, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleInputFocus = (e) => {
    const name = e.target.name;
    if (name === 'cardNumber' || name === 'cardHolderName' || name === 'expiryDate' || name === 'cvv') {
      setCardFocus(name);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.cardHolderName.trim()) newErrors.cardHolderName = 'Cardholder name is required';
    if (!formData.cardNumber.replace(/\s/g, '').match(/^[0-9]{16}$/)) newErrors.cardNumber = 'Invalid card number (16 digits)';
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)) newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    if (!formData.cvv.match(/^[0-9]{3,4}$/)) newErrors.cvv = 'Invalid CVV';
    if (!formData.billingAddress.street.trim()) newErrors.street = 'Street is required';
    if (!formData.billingAddress.city.trim()) newErrors.city = 'City is required';
    if (!formData.billingAddress.state.trim()) newErrors.state = 'State is required';
    if (!formData.billingAddress.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!formData.billingAddress.country.trim()) newErrors.country = 'Country is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/payments', {
        userId: 'dummy-user-id',
        orderId: `ORD-${Date.now()}`,
        ...formData,
        amount: totalPrice,
        cartItems: cart
      });
  
      if (response.data.status !== 'succeeded') {
        throw new Error(response.data.message || 'Payment failed');
      }
  
      setIsSubmitting(false);
      onPaymentSuccess(response.data);
      
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful',
        text: 'Your payment was processed successfully!',
        confirmButtonColor: '#10b981' 
      });
    } catch (err) {
      setIsSubmitting(false);
      console.error('Error processing payment:', err);
      
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful',
        text: 'Your payment was processed successfully!',
        confirmButtonColor: '#10b981' 
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Information</h2>
      
      {/* Card Preview */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-medium">CARD NUMBER</div>
          <div className="text-xs">VISA</div>
        </div>
        <div className="text-xl font-mono tracking-wider mb-6">
          {cardFocus === 'cardNumber' && formData.cardNumber === '' 
            ? '•••• •••• •••• ••••' 
            : formData.cardNumber || '•••• •••• •••• ••••'}
        </div>
        <div className="flex justify-between">
          <div>
            <div className="text-xs font-medium mb-1">CARD HOLDER</div>
            <div className="text-sm uppercase">
              {cardFocus === 'cardHolderName' && formData.cardHolderName === '' 
                ? 'YOUR NAME' 
                : formData.cardHolderName || 'YOUR NAME'}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium mb-1">EXPIRES</div>
            <div className="text-sm">
              {cardFocus === 'expiryDate' && formData.expiryDate === '' 
                ? '••/••' 
                : formData.expiryDate || '••/••'}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium mb-1">CVV</div>
            <div className="text-sm">
              {cardFocus === 'cvv' && formData.cvv === '' 
                ? '•••' 
                : formData.cvv ? '•'.repeat(formData.cvv.length) : '•••'}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cardNumber">
            Card Number
          </label>
          <input
            className={`w-full px-3 py-2 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            type="text"
            id="cardNumber"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            value={formData.cardNumber}
            onChange={handleChange}
            onFocus={handleInputFocus}
            required
          />
          {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cardHolderName">
            Card Holder Name
          </label>
          <input
            className={`w-full px-3 py-2 border ${errors.cardHolderName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            type="text"
            id="cardHolderName"
            name="cardHolderName"
            placeholder="John Doe"
            value={formData.cardHolderName}
            onChange={handleChange}
            onFocus={handleInputFocus}
            required
          />
          {errors.cardHolderName && <p className="mt-1 text-sm text-red-500">{errors.cardHolderName}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="expiryDate">
              Expiry Date
            </label>
            <input
              className={`w-full px-3 py-2 border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              type="text"
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              maxLength="5"
              value={formData.expiryDate}
              onChange={handleChange}
              onFocus={handleInputFocus}
              required
            />
            {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cvv">
              CVV/CVC
            </label>
            <input
              className={`w-full px-3 py-2 border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              type="text"
              id="cvv"
              name="cvv"
              placeholder="123"
              maxLength="4"
              value={formData.cvv}
              onChange={handleChange}
              onFocus={handleInputFocus}
              required
            />
            {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Billing Address</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="street">
                Street
              </label>
              <input
                className={`w-full px-3 py-2 border ${errors.street ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="text"
                id="street"
                name="billingAddress.street"
                placeholder="123 Main St"
                value={formData.billingAddress.street}
                onChange={handleChange}
                required
              />
              {errors.street && <p className="mt-1 text-sm text-red-500">{errors.street}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="city">
                  City
                </label>
                <input
                  className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  type="text"
                  id="city"
                  name="billingAddress.city"
                  placeholder="New York"
                  value={formData.billingAddress.city}
                  onChange={handleChange}
                  required
                />
                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="state">
                  State
                </label>
                <input
                  className={`w-full px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  type="text"
                  id="state"
                  name="billingAddress.state"
                  placeholder="NY"
                  value={formData.billingAddress.state}
                  onChange={handleChange}
                  required
                />
                {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="zipCode">
                  Zip Code
                </label>
                <input
                  className={`w-full px-3 py-2 border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  type="text"
                  id="zipCode"
                  name="billingAddress.zipCode"
                  placeholder="10001"
                  value={formData.billingAddress.zipCode}
                  onChange={handleChange}
                  required
                />
                {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="country">
                  Country
                </label>
                <input
                  className={`w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  type="text"
                  id="country"
                  name="billingAddress.country"
                  placeholder="United States"
                  value={formData.billingAddress.country}
                  onChange={handleChange}
                  required
                />
                {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          }`}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> Processing...
            </>
          ) : (
            <>
              <FaCreditCard className="mr-2" /> Pay ${totalPrice.toFixed(2)}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
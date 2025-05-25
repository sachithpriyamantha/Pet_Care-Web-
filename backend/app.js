const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const caregiverRoutes = require('./routes/caregiverRoutes');
const authController = require('./controllers/authController');
const petRoutes = require('./routes/petRoutes');
const communityRoutes = require('./routes/communityRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const emergencyContactRoutes = require('./routes/emergencyContactRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const pregnancyRoutes = require ('./routes/pregnancyRoutes');
const productRoutes = require('./routes/productRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes');
const bookingsRouter = require('./routes/caregiveBooking');


const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: '12345',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

mongoose.connect('mongodb://127.0.0.1:27017/petdaycare', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/emergency-contacts', emergencyContactRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/pregnancy', pregnancyRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/payments', paymentRoutes);
app.use('/api/caregiver-bookings', bookingsRouter);
app.use('/api/admin/bookings', require('./routes/adminBookingRoutes'));

authController.setupInitialAdmin();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;
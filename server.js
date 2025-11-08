const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Important! Enables reading JSON from req.body

console.log('🚀 Starting LuxuryFlight Backend...');
console.log('📊 Environment:', process.env.NODE_ENV || 'development');
console.log('🔐 MongoDB URI:', process.env.MONGODB_URI ? 'Loaded' : 'Not loaded');

// ✅ Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'LuxuryFlight API is running!',
    timestamp: new Date().toISOString()
  });
});

// ✅ Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is working perfectly!',
    data: { version: '1.0.0' }
  });
});

// ✅ Flights endpoint
app.get('/api/flights', (req, res) => {
  const flights = [
    {
      id: 1,
      flightNumber: 'LF001',
      airline: 'Luxury Airlines',
      departure: { city: 'New York', airport: 'JFK', date: '2024-01-15', time: '08:00' },
      arrival: { city: 'London', airport: 'LHR', date: '2024-01-15', time: '20:00' },
      duration: '7h 00m',
      price: 1500,
      class: 'business'
    },
    {
      id: 2,
      flightNumber: 'LF002',
      airline: 'Premium Airways',
      departure: { city: 'Los Angeles', airport: 'LAX', date: '2024-01-16', time: '14:00' },
      arrival: { city: 'Tokyo', airport: 'HND', date: '2024-01-17', time: '18:00' },
      duration: '12h 00m',
      price: 2000,
      class: 'first'
    }
  ];

  res.json({
    status: 'success',
    data: { flights }
  });
});

// ✅ Register endpoint
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body || {};

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'All fields (firstName, lastName, email, password) are required'
    });
  }

  // Mock registration (replace later with MongoDB)
  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user: {
        id: 1,
        firstName,
        lastName,
        email
      },
      token: 'mock_jwt_token_here'
    }
  });
});

// ✅ Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Email and password are required'
    });
  }

  // Mock login (replace later with DB)
  res.json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email
      },
      token: 'mock_jwt_token_here'
    }
  });
});

// ✅ Booking endpoint
app.post('/api/bookings', (req, res) => {
  const { flightId, passengers } = req.body || {};

  if (!flightId || !passengers) {
    return res.status(400).json({
      status: 'error',
      message: 'Flight ID and passengers are required'
    });
  }

  res.status(201).json({
    status: 'success',
    message: 'Booking created successfully',
    data: {
      booking: {
        id: 'BK' + Date.now(),
        flightId,
        passengers,
        totalAmount: 1500,
        status: 'confirmed',
        reference: 'LF' + Math.random().toString(36).substr(2, 8).toUpperCase()
      }
    }
  });
});

// ✅ Catch all unmatched routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Endpoint ${req.method} ${req.path} not found`
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n✅ LuxuryFlight Backend Successfully Started!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('\n📋 Available Endpoints:');
  console.log('   GET  /api/health          - Health check');
  console.log('   GET  /api/test            - Test endpoint');
  console.log('   GET  /api/flights         - Get flights');
  console.log('   POST /api/auth/register   - Register user');
  console.log('   POST /api/auth/login      - Login user');
  console.log('   POST /api/bookings        - Create booking');
  console.log('\n🚀 Ready to receive requests!');
});

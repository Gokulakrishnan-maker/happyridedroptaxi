const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting Happy Ride Drop Backend Server...');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Add request logging
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint requested');
  res.json({ 
    message: 'Backend is working perfectly!',
    timestamp: new Date().toISOString()
  });
});

// Booking endpoint
app.post('/api/book', (req, res) => {
  console.log('📝 Booking request received:', JSON.stringify(req.body, null, 2));
  
  try {
    const {
      pickupLocation,
      dropLocation,
      tripType,
      date,
      time,
      carType,
      name,
      phone,
      email,
      distance
    } = req.body;

    // Validate required fields
    if (!pickupLocation || !dropLocation || !name || !phone || !date || !time) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Generate booking ID
    const bookingId = `HRD${Date.now()}`;
    
    // Calculate estimated price based on car type
    let ratePerKm = 14; // Default sedan rate
    switch(carType) {
      case 'etios': ratePerKm = 15; break;
      case 'suv': ratePerKm = 19; break;
      case 'innova': ratePerKm = 20; break;
    }
    
    const estimatedPrice = distance ? `₹${Math.round(distance * ratePerKm)}` : '₹2000';

    console.log('✅ Booking created successfully:', bookingId);

    // Send success response
    res.json({
      success: true,
      message: 'Booking submitted successfully! We will contact you shortly.',
      data: {
        bookingId,
        estimatedDistance: distance,
        estimatedPrice,
        whatsappLinks: {
          admin: `https://wa.me/919087520500?text=New%20booking%20${bookingId}%20-%20${name}%20-%20${phone}`,
          customer: `https://wa.me/${phone.replace(/\D/g, '')}?text=Your%20booking%20${bookingId}%20is%20confirmed!%20Happy%20Ride%20Drop%20will%20contact%20you%20shortly.`
        }
      }
    });

  } catch (error) {
    console.error('❌ Booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.'
    });
  }
});

// Catch all for undefined routes
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/test', 
      'POST /api/book'
    ]
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available:`);
  console.log(`   - GET  http://localhost:${PORT}/api/health`);
  console.log(`   - GET  http://localhost:${PORT}/api/test`);
  console.log(`   - POST http://localhost:${PORT}/api/book`);
  console.log(`✅ Server ready to accept connections!`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Trying to kill existing process...`);
    process.exit(1);
  } else {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
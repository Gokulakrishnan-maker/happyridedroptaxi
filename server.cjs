const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting Happy Ride Drop Backend Server...');

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://localhost:5173', 
    'http://127.0.0.1:5173',
    'https://127.0.0.1:5173',
    'http://localhost:3000',
    'https://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Enhanced middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`📝 ${req.method} ${req.path} - ${timestamp}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`   Body:`, JSON.stringify(req.body, null, 2));
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running perfectly',
    timestamp: new Date().toISOString(),
    port: PORT,
    endpoints: ['/api/health', '/api/test', '/api/estimate']
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint requested');
  res.json({ 
    message: 'Backend is working perfectly!',
    timestamp: new Date().toISOString(),
    server: 'Happy Ride Drop API'
  });
});

// Price estimation endpoint
app.post('/api/estimate', (req, res) => {
  console.log('💰 Price estimation request received');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
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
      distance,
      estimatedDuration
    } = req.body;

    // Validate required fields
    const requiredFields = { pickupLocation, dropLocation, name, phone, date, time };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || (typeof value === 'string' && !value.trim()))
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Validate phone number
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      console.log('❌ Invalid phone number:', phone);
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number'
      });
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('❌ Invalid email:', email);
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Generate estimation ID
    const estimationId = `HRD${Date.now()}`;
    
    // Calculate price based on car type and trip type
    let ratePerKm = 14; // Default sedan rate
    switch(carType) {
      case 'sedan': 
        ratePerKm = tripType === 'one-way' ? 14 : 13; 
        break;
      case 'etios': 
        ratePerKm = tripType === 'one-way' ? 15 : 14; 
        break;
      case 'suv': 
        ratePerKm = tripType === 'one-way' ? 19 : 18; 
        break;
      case 'innova': 
        ratePerKm = tripType === 'one-way' ? 20 : 18; 
        break;
      default:
        ratePerKm = 14;
    }
    
    // Calculate total price
    const calculatedDistance = distance || 150; // Default fallback
    const basePrice = Math.round(calculatedDistance * ratePerKm);
    const driverBata = 400;
    const totalPrice = basePrice + driverBata;
    
    // Minimum distance validation
    const minDistance = tripType === 'one-way' ? 130 : 250;
    if (calculatedDistance < minDistance) {
      console.log(`❌ Distance too short: ${calculatedDistance}km, minimum: ${minDistance}km`);
      return res.status(400).json({
        success: false,
        message: `Minimum distance for ${tripType} trips is ${minDistance} km. Current distance: ${calculatedDistance} km`
      });
    }

    console.log('✅ Price estimation calculated successfully:', estimationId);
    console.log(`   Distance: ${calculatedDistance}km`);
    console.log(`   Rate: ₹${ratePerKm}/km`);
    console.log(`   Total: ₹${totalPrice}`);

    // Create WhatsApp message for customer
    const customerMessage = encodeURIComponent(
      `🚖 Happy Ride Drop - Price Estimation\n\n` +
      `Estimation ID: ${estimationId}\n` +
      `From: ${pickupLocation}\n` +
      `To: ${dropLocation}\n` +
      `Trip: ${tripType}\n` +
      `Date: ${date} at ${time}\n` +
      `Car: ${carType.toUpperCase()}\n` +
      `Distance: ${calculatedDistance}km\n` +
      `Estimated Price: ₹${totalPrice}\n\n` +
      `To confirm booking, please reply to this message or call +91 9087520500`
    );

    // Create WhatsApp message for admin
    const adminMessage = encodeURIComponent(
      `🚖 New Price Estimation Request\n\n` +
      `ID: ${estimationId}\n` +
      `Customer: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email || 'Not provided'}\n` +
      `From: ${pickupLocation}\n` +
      `To: ${dropLocation}\n` +
      `Trip: ${tripType}\n` +
      `Date: ${date} at ${time}\n` +
      `Car: ${carType.toUpperCase()}\n` +
      `Distance: ${calculatedDistance}km\n` +
      `Estimated Price: ₹${totalPrice}`
    );

    // Send success response
    res.json({
      success: true,
      message: 'Price estimation calculated successfully!',
      data: {
        estimationId,
        estimatedDistance: calculatedDistance,
        estimatedDuration: estimatedDuration || 'Calculating...',
        ratePerKm: `₹${ratePerKm}`,
        basePrice: `₹${basePrice}`,
        driverBata: `₹${driverBata}`,
        totalPrice: `₹${totalPrice}`,
        breakdown: {
          distance: `${calculatedDistance} km`,
          rate: `₹${ratePerKm}/km`,
          baseAmount: `₹${basePrice}`,
          driverBata: `₹${driverBata}`,
          total: `₹${totalPrice}`
        },
        whatsappLinks: {
          admin: `https://wa.me/919087520500?text=${adminMessage}`,
          customer: `https://wa.me/91${cleanPhone}?text=${customerMessage}`
        },
        contactInfo: {
          phone: '+91 9087520500',
          email: 'happyridedroptaxi@gmail.com'
        }
      }
    });

  } catch (error) {
    console.error('❌ Price estimation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
      'POST /api/estimate'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Start server with enhanced error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available:`);
  console.log(`   - GET  http://localhost:${PORT}/api/health`);
  console.log(`   - GET  http://localhost:${PORT}/api/test`);
  console.log(`   - POST http://localhost:${PORT}/api/estimate`);
  console.log(`✅ Server ready to accept connections!`);
});

// Enhanced server error handling
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.log('🔄 Attempting to kill existing process...');
    process.exit(1);
  } else {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
});

// Graceful shutdown handlers
const gracefulShutdown = (signal) => {
  console.log(`🛑 Received ${signal}, shutting down gracefully`);
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.log('⚠️ Forcing server shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
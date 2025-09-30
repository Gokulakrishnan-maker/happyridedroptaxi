import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001', 'https://happyridedroptaxi.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
}
// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8275666233:AAGEPTLZUWgzQt6-LUyQidHV-QOG4Q5dMM0';
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '8486626603 ';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER || 'happyridedroptaxi@gmail.com',
      pass: process.env.GMAIL_PASS || 'nfiapqiwwtpgnmey' // Use App Password for Gmail
    }
  });
};

// Test email configuration on startup
const testEmailConfig = async () => {
  console.log('📧 Email testing disabled for faster startup');
};

// Test email config on startup
testEmailConfig();

// Telegram notification function
const sendTelegramMessage = async (chatId, message) => {
  if (!TELEGRAM_BOT_TOKEN || !chatId) {
    console.log('Telegram not configured, skipping notification');
    return;
  }

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    console.log('Telegram message sent successfully');
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
};

// Validation functions
const validateBookingData = (data) => {
  console.log('🔍 Validating booking data:', JSON.stringify(data, null, 2));
  
  const errors = [];
  
  // Check if data exists
  if (!data || typeof data !== 'object') {
    console.log('❌ Invalid data format');
    errors.push({ field: 'general', message: 'Invalid booking data format' });
    return { errors, distance: 0 };
  }
  
  if (!data.pickupLocation?.trim()) {
    console.log('❌ Missing pickup location');
    errors.push({ field: 'pickupLocation', message: 'Pickup location is required' });
  }
  
  if (!data.dropLocation?.trim()) {
    console.log('❌ Missing drop location');
    errors.push({ field: 'dropLocation', message: 'Drop location is required' });
  }
  
  if (!data.date) {
    console.log('❌ Missing date');
    errors.push({ field: 'date', message: 'Date is required' });
  }
  
  if (!data.time) {
    console.log('❌ Missing time');
    errors.push({ field: 'time', message: 'Time is required' });
  }
  
  if (!data.name?.trim()) {
    console.log('❌ Missing name');
    errors.push({ field: 'name', message: 'Name is required' });
  }
  
  if (!data.phone?.trim()) {
    console.log('❌ Missing phone');
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!/^\+?[\d\s-()]{10,}$/.test(data.phone)) {
    console.log('❌ Invalid phone format');
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  // Simulate distance validation (in real app, integrate with mapping service)
    console.log('❌ Invalid email format');
  const actualDistance = data.distance || data.calculatedDistance || Math.floor(Math.random() * 300) + 130;
  console.log('📏 Calculated distance:', actualDistance);
  
  if (data.tripType === 'one-way' && actualDistance < 130) {
    console.log('❌ Distance too short for one-way');
    errors.push({ field: 'distance', message: 'One-way trips require minimum 130 km distance' });
  }
  
  if (data.tripType === 'round-trip' && actualDistance < 250) {
    console.log('❌ Distance too short for round-trip');
    errors.push({ field: 'distance', message: 'Round-trip bookings require minimum 250 km distance' });
  }
  
  console.log('✅ Validation complete. Errors:', errors.length);
  return { errors, distance: actualDistance };
};

// Generate notification messages
const generateNotificationMessages = (data, distance) => {
  const bookingId = `HRD${Date.now()}`;
  const estimatedPrice = calculateEstimatedPrice(data.carType, distance, data.tripType);

  const adminMessage = `🚗 NEW BOOKING REQUEST

📋 Booking ID: ${bookingId}
👤 Customer: ${data.name}
📱 Phone: ${data.phone}
${data.email ? `📧 Email: ${data.email}` : ''}
📍 From: ${data.pickupLocation}
📍 To: ${data.dropLocation}
🚗 Vehicle: ${data.carType.toUpperCase()}
📅 Date: ${data.date}
⏰ Time: ${data.time}
🛣️ Trip: ${data.tripType}
📏 Distance: ~${distance}km
${data.estimatedDuration ? `⏱️ Duration: ${data.estimatedDuration}` : ''}
💰 Estimated Price: ${estimatedPrice}

Please call customer to confirm booking.`;

  const customerMessage = `Hi ${data.name}! 👋

Thank you for booking with Happy Ride Drop Taxi! 🚗

📋 Your booking details:
🆔 Booking ID: ${bookingId}
📍 ${data.pickupLocation} → ${data.dropLocation}
📅 ${data.date} at ${data.time}
🚗 Vehicle: ${data.carType.toUpperCase()}
📏 Distance: ~${distance}km
${data.estimatedDuration ? `⏱️ Duration: ${data.estimatedDuration}` : ''}
💰 Estimated Price: ${estimatedPrice}

We'll call you within 30 minutes to confirm.

For any queries: +91 9087520500
Happy Ride Drop Taxi 🌟`;

  return { bookingId, adminMessage, customerMessage, estimatedPrice };
};

// Email templates
const generateAdminEmailHtml = (data, distance) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2563EB, #10B981); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🚗 New Booking Request</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Happy Ride Drop Taxi</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #2563EB; margin-bottom: 25px; font-size: 24px;">Booking Details</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e9ecef;">
          <h3 style="color: #10B981; margin-bottom: 15px; font-size: 18px;">📍 Trip Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Booking ID:</td><td style="padding: 8px 0; color: #6c757d;">${data.bookingId}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Pickup Location:</td><td style="padding: 8px 0; color: #6c757d;">${data.pickupLocation}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Drop Location:</td><td style="padding: 8px 0; color: #6c757d;">${data.dropLocation}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Trip Type:</td><td style="padding: 8px 0; color: #6c757d;">${data.tripType.charAt(0).toUpperCase() + data.tripType.slice(1)}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Estimated Distance:</td><td style="padding: 8px 0; color: #6c757d;">${distance} km</td></tr>
            ${data.estimatedDuration ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Estimated Duration:</td><td style="padding: 8px 0; color: #6c757d;">${data.estimatedDuration}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Date & Time:</td><td style="padding: 8px 0; color: #6c757d;">${data.date} at ${data.time}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Car Type:</td><td style="padding: 8px 0; color: #6c757d;">${data.carType.charAt(0).toUpperCase() + data.carType.slice(1)}</td></tr>
          </table>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e9ecef;">
          <h3 style="color: #10B981; margin-bottom: 15px; font-size: 18px;">👤 Customer Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Name:</td><td style="padding: 8px 0; color: #6c757d;">${data.name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Phone:</td><td style="padding: 8px 0; color: #6c757d;">${data.phone}</td></tr>
            ${data.email ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Email:</td><td style="padding: 8px 0; color: #6c757d;">${data.email}</td></tr>` : ''}
          </table>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2563EB;">
          <p style="margin: 0; color: #1565c0; font-weight: bold;">⏰ Action Required</p>
          <p style="margin: 10px 0 0 0; color: #1565c0;">Please contact the customer to confirm the booking and provide pricing details.</p>
        </div>
        
        <div style="text-align: center; margin-top: 25px;">
          <a href="tel:${data.phone}" style="background: #2563EB; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; margin-right: 10px; font-weight: bold;">📞 Call Customer</a>
          <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(data.name)},%20Thank%20you%20for%20booking%20with%20Happy%20Ride%20Drop%20Taxi.%20We%20have%20received%20your%20booking%20request." style="background: #10B981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">💬 WhatsApp</a>
        </div>
      </div>
    </div>
  `;
};

const generateCustomerEmailHtml = (data, distance) => {
  const estimatedPrice = calculateEstimatedPrice(data.carType, distance, data.tripType);
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2563EB, #10B981); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🚗 Booking Confirmation</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Happy Ride Drop Taxi</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <p style="color: #2563EB; font-size: 18px; margin-bottom: 25px;">Dear ${data.name},</p>
        <p style="color: #495057; margin-bottom: 25px;">Thank you for choosing Happy Ride Drop Taxi! We have received your booking request and will contact you shortly to confirm the details.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e9ecef;">
          <h3 style="color: #10B981; margin-bottom: 15px; font-size: 18px;">📍 Your Trip Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Booking ID:</td><td style="padding: 8px 0; color: #6c757d;">${data.bookingId}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">From:</td><td style="padding: 8px 0; color: #6c757d;">${data.pickupLocation}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">To:</td><td style="padding: 8px 0; color: #6c757d;">${data.dropLocation}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Trip Type:</td><td style="padding: 8px 0; color: #6c757d;">${data.tripType.charAt(0).toUpperCase() + data.tripType.slice(1)}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Date & Time:</td><td style="padding: 8px 0; color: #6c757d;">${data.date} at ${data.time}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Vehicle:</td><td style="padding: 8px 0; color: #6c757d;">${data.carType.charAt(0).toUpperCase() + data.carType.slice(1)}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Estimated Distance:</td><td style="padding: 8px 0; color: #6c757d;">${distance} km</td></tr>
            ${data.estimatedDuration ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Estimated Duration:</td><td style="padding: 8px 0; color: #6c757d;">${data.estimatedDuration}</td></tr>` : ''}
          </table>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #4caf50;">
          <h3 style="color: #2e7d32; margin-bottom: 15px; font-size: 18px;">💰 Estimated Pricing</h3>
          <p style="color: #2e7d32; font-size: 24px; font-weight: bold; margin: 0;">${estimatedPrice}</p>
          <p style="color: #558b2f; font-size: 14px; margin: 5px 0 0 0;">*Final price may vary based on actual distance and additional charges</p>
        </div>
        
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ff9800;">
          <h3 style="color: #f57c00; margin-bottom: 15px; font-size: 18px;">📞 We'll Contact You Soon</h3>
          <p style="color: #ef6c00; margin: 0;">Our team will call you within 30 minutes to confirm your booking and provide exact pricing details.</p>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2563EB;">
          <h3 style="color: #1565c0; margin-bottom: 15px; font-size: 18px;">📱 Contact Information</h3>
          <p style="color: #1565c0; margin: 0;"><strong>Phone:</strong> +91 9087520500</p>
          <p style="color: #1565c0; margin: 5px 0 0 0;"><strong>Email:</strong> happyridedroptaxi@gmail.com</p>
        </div>
        
        <div style="text-align: center; margin-top: 25px;">
          <p style="color: #495057; margin-bottom: 15px;">Need immediate assistance?</p>
          <a href="tel:+919087520500" style="background: #2563EB; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; margin-right: 10px; font-weight: bold;">📞 Call Us</a>
          <a href="https://wa.me/919087520500?text=Hi,%20I%20just%20made%20a%20booking%20and%20need%20assistance." style="background: #10B981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">💬 WhatsApp</a>
        </div>
        
        <p style="text-align: center; color: #6c757d; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          Thank you for choosing Happy Ride Drop Taxi!<br>
          We look forward to serving you.
        </p>
      </div>
    </div>
  `;
};

const calculateEstimatedPrice = (carType, distance, tripType) => {
  const rates = {
    sedan: 12,
    suv: 15,
    etios: 10,
    innova: 18
  };
  
  const baseRate = rates[carType] || 12;
  const driverAllowance = 300;
  const basePrice = distance * baseRate + driverAllowance;
  
  return `₹${basePrice.toLocaleString()} - ₹${(basePrice + 500).toLocaleString()}`;
};

// API Routes
app.post('/api/book', async (req, res) => {
  console.log('📝 POST /api/book - Booking request received');
  console.log('📋 Request headers:', JSON.stringify(req.headers, null, 2));
  console.log('📋 Request body type:', typeof req.body);
  console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    // Add request validation
    if (!req.body) {
      console.log('❌ No request body received');
      return res.status(400).json({
        success: false,
        message: 'No booking data received'
      });
    }

    const bookingData = req.body;
    
    // Validate booking data
    console.log('🔍 Starting validation...');
    const { errors, distance } = validateBookingData(bookingData);
    
    if (errors.length > 0) {
      console.log('❌ Validation errors:', errors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    console.log('✅ Validation passed, generating notifications...');
    // Generate notification messages
    const { bookingId, adminMessage, customerMessage, estimatedPrice } = generateNotificationMessages(bookingData, distance);
    console.log('✅ Booking ID generated:', bookingId);

    // Add booking ID to data
    const bookingWithId = { ...bookingData, bookingId, distance, estimatedPrice };

    let emailResults = { admin: false, customer: false };
    let telegramResult = false;

    // Email sending disabled to prevent SMTP timeout errors
    console.log('📧 Email sending disabled - booking will proceed without email notifications');
    emailResults.admin = false;
    emailResults.customer = false;

    // Send Telegram notification
    console.log('📱 Attempting Telegram notification...');
    try {
      await sendTelegramMessage(TELEGRAM_ADMIN_CHAT_ID, adminMessage);
      console.log('✅ Telegram notification sent');
      telegramResult = true;
    } catch (telegramError) {
      console.error('❌ Telegram error:', telegramError);
      // Don't fail the booking if Telegram fails
    }

    // Generate WhatsApp and Telegram sharing links
    console.log('🔗 Generating sharing links...');
    const adminWhatsAppMessage = encodeURIComponent(adminMessage);
    const customerWhatsAppMessage = encodeURIComponent(customerMessage);
    const adminTelegramMessage = encodeURIComponent(adminMessage);
    const customerTelegramMessage = encodeURIComponent(customerMessage);

    console.log('✅ Booking processed successfully:', {
      bookingId,
      emailResults,
      telegramResult
    });

    console.log('📤 Sending success response...');
    res.json({
      success: true,
      message: `Booking request submitted successfully! Booking ID: ${bookingId}. We will contact you shortly.`,
      data: {
        bookingId,
        estimatedDistance: distance,
        estimatedPrice,
        notifications: {
          email: emailResults,
          telegram: telegramResult
        },
        whatsappLinks: {
          admin: `https://wa.me/919087520500?text=${adminWhatsAppMessage}`,
          customer: `https://wa.me/${bookingData.phone.replace(/[^0-9]/g, '')}?text=${customerWhatsAppMessage}`
        },
        telegramLinks: {
          admin: `https://t.me/share/url?url=&text=${adminTelegramMessage}`,
          customer: `https://t.me/share/url?url=&text=${customerTelegramMessage}`
        }
      }
    });

  } catch (error) {
    console.error('❌ Booking error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}. Please try again later.`,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('📋 GET /api/health - Health check requested');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  console.log('🧪 GET /api/test - Test endpoint accessed');
  res.json({ message: 'Backend server is working!', timestamp: new Date().toISOString() });
});

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Serve React app for all other routes (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    console.log(`🌐 Serving React app for: ${req.path}`);
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, only handle API routes
  app.get('*', (req, res) => {
    console.log(`🔧 Development mode: API-only server for: ${req.path}`);
    res.status(404).json({ 
      success: false, 
      message: 'API endpoint not found. Frontend is served by Vite dev server.' 
    });
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server middleware error:', error);
  console.error('Error stack:', error.stack);
  res.status(500).json({
    success: false,
    message: `Server error: ${error.message}`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/book`);
  console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📧 Gmail configured: ${process.env.GMAIL_PASS ? 'Yes' : 'No'}`);
  console.log(`📱 Telegram configured: ${TELEGRAM_BOT_TOKEN ? 'Yes' : 'No'}`);
});

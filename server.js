const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'happyridedroptaxi@gmail.com',
      pass: process.env.GMAIL_PASS || 'your-app-password' // Use App Password for Gmail
    }
  });
};

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
  const errors = [];
  
  if (!data.pickupLocation?.trim()) {
    errors.push({ field: 'pickupLocation', message: 'Pickup location is required' });
  }
  
  if (!data.dropLocation?.trim()) {
    errors.push({ field: 'dropLocation', message: 'Drop location is required' });
  }
  
  if (!data.date) {
    errors.push({ field: 'date', message: 'Date is required' });
  }
  
  if (!data.time) {
    errors.push({ field: 'time', message: 'Time is required' });
  }
  
  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  }
  
  if (!data.phone?.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!/^\+?[\d\s-()]{10,}$/.test(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  // Simulate distance validation (in real app, integrate with mapping service)
  const actualDistance = data.distance || Math.floor(Math.random() * 300) + 100;
  
  if (data.tripType === 'one-way' && actualDistance < 130) {
    errors.push({ field: 'distance', message: 'One-way trips require minimum 130 km distance' });
  }
  
  if (data.tripType === 'round-trip' && actualDistance < 250) {
    errors.push({ field: 'distance', message: 'Round-trip bookings require minimum 250 km distance' });
  }
  
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
  try {
    const bookingData = req.body;
    
    // Validate booking data
    const { errors, distance } = validateBookingData(bookingData);
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Generate notification messages
    const { bookingId, adminMessage, customerMessage, estimatedPrice } = generateNotificationMessages(bookingData, distance);

    // Add booking ID to data
    const bookingWithId = { ...bookingData, bookingId, distance, estimatedPrice };

    const transporter = createTransporter();

    // Admin email
    const adminMailOptions = {
      from: process.env.GMAIL_USER || 'happyridedroptaxi@gmail.com',
      to: 'happyridedroptaxi@gmail.com',
      subject: `New Taxi Booking Request - ${bookingData.name} (${bookingId})`,
      html: generateAdminEmailHtml(bookingWithId, distance)
    };

    // Customer email
    let customerMailOptions = null;
    if (bookingData.email) {
      customerMailOptions = {
        from: process.env.GMAIL_USER || 'happyridedroptaxi@gmail.com',
        to: bookingData.email,
        subject: `Booking Confirmation - Happy Ride Drop Taxi (${bookingId})`,
        html: generateCustomerEmailHtml(bookingWithId, distance)
      };
    }

    // Send emails
    try {
      await transporter.sendMail(adminMailOptions);
      console.log('Admin email sent successfully');
    } catch (emailError) {
      console.error('Admin email error:', emailError);
    }

    if (customerMailOptions) {
      try {
        await transporter.sendMail(customerMailOptions);
        console.log('Customer email sent successfully');
      } catch (emailError) {
        console.error('Customer email error:', emailError);
      }
    }

    // Send Telegram notifications
    await sendTelegramMessage(TELEGRAM_ADMIN_CHAT_ID, adminMessage);

    // Generate WhatsApp messages
    const adminWhatsAppMessage = encodeURIComponent(adminMessage);
    const customerWhatsAppMessage = encodeURIComponent(customerMessage);

    // Generate Telegram messages (URL encoded for sharing)
    const adminTelegramMessage = encodeURIComponent(adminMessage);
    const customerTelegramMessage = encodeURIComponent(customerMessage);

    res.json({
      success: true,
      message: `Booking request submitted successfully! Booking ID: ${bookingId}. We will contact you shortly.`,
      data: {
        bookingId,
        estimatedDistance: distance,
        estimatedPrice,
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
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
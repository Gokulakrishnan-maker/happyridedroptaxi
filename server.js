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

    const transporter = createTransporter();

    // Admin email
    const adminMailOptions = {
      from: process.env.GMAIL_USER || 'happyridedroptaxi@gmail.com',
      to: 'happyridedroptaxi@gmail.com',
      subject: `New Taxi Booking Request - ${bookingData.name}`,
      html: generateAdminEmailHtml(bookingData, distance)
    };

    // Customer email
    const customerMailOptions = {
      from: process.env.GMAIL_USER || 'happyridedroptaxi@gmail.com',
      to: bookingData.email || bookingData.phone + '@temp.com', // In real app, collect email
      subject: 'Booking Confirmation - Happy Ride Drop Taxi',
      html: generateCustomerEmailHtml(bookingData, distance)
    };

    // Send emails
    try {
      await transporter.sendMail(adminMailOptions);
      console.log('Admin email sent successfully');
    } catch (emailError) {
      console.error('Admin email error:', emailError);
    }

    try {
      if (bookingData.email) {
        await transporter.sendMail(customerMailOptions);
        console.log('Customer email sent successfully');
      }
    } catch (emailError) {
      console.error('Customer email error:', emailError);
    }

    // Generate WhatsApp messages
    const adminWhatsAppMessage = encodeURIComponent(
      `🚗 NEW BOOKING REQUEST\n\n` +
      `👤 Customer: ${bookingData.name}\n` +
      `📱 Phone: ${bookingData.phone}\n` +
      `📍 From: ${bookingData.pickupLocation}\n` +
      `📍 To: ${bookingData.dropLocation}\n` +
      `🚗 Vehicle: ${bookingData.carType.toUpperCase()}\n` +
      `📅 Date: ${bookingData.date}\n` +
      `⏰ Time: ${bookingData.time}\n` +
      `🛣️ Trip: ${bookingData.tripType}\n` +
      `📏 Distance: ~${distance}km\n\n` +
      `Please call customer to confirm booking.`
    );

    const customerWhatsAppMessage = encodeURIComponent(
      `Hi ${bookingData.name}! 👋\n\n` +
      `Thank you for booking with Happy Ride Drop Taxi! 🚗\n\n` +
      `📋 Your booking details:\n` +
      `📍 ${bookingData.pickupLocation} → ${bookingData.dropLocation}\n` +
      `📅 ${bookingData.date} at ${bookingData.time}\n` +
      `🚗 Vehicle: ${bookingData.carType.toUpperCase()}\n\n` +
      `We'll call you within 30 minutes to confirm.\n\n` +
      `For any queries: +91 9087520500\n` +
      `Happy Ride Drop Taxi 🌟`
    );

    res.json({
      success: true,
      message: 'Booking request submitted successfully! We will contact you shortly.',
      data: {
        bookingId: `HRD${Date.now()}`,
        estimatedDistance: distance,
        whatsappLinks: {
          admin: `https://wa.me/919087520500?text=${adminWhatsAppMessage}`,
          customer: `https://wa.me/${bookingData.phone.replace(/[^0-9]/g, '')}?text=${customerWhatsAppMessage}`
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
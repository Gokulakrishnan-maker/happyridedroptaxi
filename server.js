import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ------------------ MIDDLEWARE ------------------
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ------------------ ROUTES ------------------
app.post("/api/book", async (req, res) => {
  console.log("📝 POST /api/book - Booking request received");
  console.log("Request body:", req.body);

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
      estimatedDuration,
    } = req.body;

    if (!pickupLocation || !dropLocation || !name || !phone || !date || !time) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields" 
      });
    }

    const bookingId = `HRD${Date.now()}`;
    console.log("✅ Booking ID:", bookingId);

    // Simulate successful booking
    const response = {
      success: true,
      message: "Booking created successfully",
      data: {
        bookingId,
        estimatedDistance: distance,
        estimatedPrice: distance ? `₹${distance * 14}` : "₹2000",
        whatsappLinks: {
          admin: `https://wa.me/919087520500?text=New booking ${bookingId}`,
          customer: `https://wa.me/${phone}?text=Your booking ${bookingId} is confirmed!`,
        },
      },
    };

    console.log("✅ Sending response:", response);
    res.json(response);

  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.get("/api/health", (req, res) => {
  console.log("🏥 Health check requested");
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.get("/api/test", (req, res) => {
  console.log("🧪 Test endpoint requested");
  res.json({ 
    message: "Backend working perfectly!", 
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(join(__dirname, "dist", "index.html"));
    }
  });
}

// Handle API 404s
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.path} not found`,
    availableEndpoints: ['/api/book', '/api/health', '/api/test']
  });
});

// ------------------ ERROR HANDLER ------------------
app.use((error, req, res, next) => {
  console.error("❌ Server error:", error);
  res.status(500).json({ 
    success: false, 
    message: "Internal server error" 
  });
});

// ------------------ START SERVER ------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available:`);
  console.log(`   - POST http://localhost:${PORT}/api/book`);
  console.log(`   - GET  http://localhost:${PORT}/api/health`);
  console.log(`   - GET  http://localhost:${PORT}/api/test`);
  console.log(`🌐 Server ready to accept connections!`);
});
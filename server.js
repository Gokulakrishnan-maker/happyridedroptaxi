import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config } from "dotenv";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const app = express();
const PORT = process.env.PORT || 3001;

// ------------------ MIDDLEWARE ------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
      "https://happyridedroptaxi.com",
      "https://happyridedroptaxi.onrender.com",
      /^https:\/\/.*\.stackblitz\.io$/,
      /^https:\/\/.*\.webcontainer\.io$/
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Add preflight handling
app.options('*', cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("dist"));

// ------------------ HELPERS ------------------
async function sendTelegramMessage(text) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_ADMIN_CHAT_ID) {
    console.warn("⚠️ Telegram not configured");
    return;
  }
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID,
        text,
      }),
    });
    console.log("📤 Telegram sent");
  } catch (err) {
    console.error("❌ Telegram error:", err.message);
  }
}

async function sendEmail(subject, html, to = process.env.ADMIN_EMAIL) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.warn("⚠️ Email not configured");
    return;
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
  try {
    await transporter.sendMail({
      from: `"HappyRide DropTaxi" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("📤 Email sent to", to);
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
}

// ------------------ ROUTES ------------------
app.post("/api/book", async (req, res) => {
  console.log("📝 POST /api/book - Booking request received");

  if (!req.body) {
    return res.status(400).json({ success: false, message: "No booking data received" });
  }

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
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const bookingId = `HRD${Date.now()}`;
  console.log("✅ Booking ID:", bookingId);

  const message = `
📌 *New Booking Received*
🆔 Booking ID: ${bookingId}
👤 Name: ${name}
📞 Phone: ${phone}
📍 Pickup: ${pickupLocation}
🏁 Drop: ${dropLocation}
📅 Date: ${date}
⏰ Time: ${time}
🚘 Car Type: ${carType || "Not specified"}
📏 Distance: ${distance ? `${distance} km` : "N/A"}
⏳ Duration: ${estimatedDuration || "N/A"}
`;

  await sendTelegramMessage(message);
  await sendEmail("New Booking Confirmation", message.replace(/\n/g, "<br/>"));

  res.json({
    success: true,
    message: "Booking created successfully",
    data: {
      bookingId,
      whatsappLinks: {
        customer: `https://wa.me/${phone}?text=Your booking ${bookingId} is confirmed!`,
      },
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working", timestamp: new Date().toISOString() });
});

// ------------------ CATCH-ALL ------------------
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) return next();

  if (process.env.NODE_ENV === "production") {
    res.sendFile(join(__dirname, "dist", "index.html"));
  } else {
    // In development, let Vite handle frontend routes
    res.status(404).send(`
      <html>
        <body>
          <h1>Backend Server Running</h1>
          <p>API server is running on port ${PORT}</p>
          <p>Frontend should be served by Vite on port 5173</p>
          <p>Requested path: ${req.path}</p>
          <p>If you're seeing this, the backend is working!</p>
        </body>
      </html>
    `);
  }
});

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
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ------------------ START SERVER ------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

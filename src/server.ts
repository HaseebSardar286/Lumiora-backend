import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db";
import bookingsRouter from "./routes/bookings";
import quotesRouter from "./routes/quotes";
import contactsRouter from "./routes/contacts";
import configRouter from "./routes/config";
import projectsRouter from "./routes/projects";
import uploadsRouter, { UPLOADS_ROOT } from "./routes/uploads";
import AdminConfig from "./models/AdminConfig";
import Admin from "./models/Admin";
import { seedProjects } from "./config/projectsSeed";

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins: the production frontend + local dev origins
const allowedOrigins = [
  process.env.FRONTEND_URL,          // e.g. https://lumiora-two.vercel.app
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
].filter(Boolean) as string[];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server calls (no origin header) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_ROOT));

let isSeeded = false;

// Database Connection & Seeding Middleware for Serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    if (!isSeeded) {
      await seedDefaultConfig();
      await seedProjects();
      await seedAdmin();
      isSeeded = true;
    }
    next();
  } catch (error) {
    console.error("Database connection/seeding failure in middleware:", error);
    next(error);
  }
});

// Routes mapping
app.use("/api/bookings", bookingsRouter);
app.use("/api/quotes", quotesRouter);
app.use("/api/contact", contactsRouter);
app.use("/api/admin/config", configRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/uploads", uploadsRouter);

// Home root info route
app.get("/", (req, res) => {
  res.json({
    name: "8BitField API Server",
    version: "1.0.0",
    status: "Healthy",
    docs: "/health"
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Seed default availability configurations if none exists
async function seedDefaultConfig() {
  try {
    const existing = await AdminConfig.findOne({ key: "global_config" });
    if (!existing) {
      const defaultConfig = new AdminConfig({
        key: "global_config",
        slots: [
          "09:00 AM",
          "10:00 AM",
          "11:00 AM",
          "02:00 PM",
          "03:00 PM",
          "04:00 PM"
        ],
        blockedDates: []
      });
      await defaultConfig.save();
      console.log("✅ Seeded default admin availability slot configuration.");
    }
  } catch (error) {
    console.error("⚠️ Failed to seed default configuration:", error);
  }
}

// Seed default admin login credentials and keep in sync with .env
async function seedAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || "admin@8bitfield.com";
    const password = process.env.ADMIN_PASSWORD || "@HKtech100#";

    await Admin.findOneAndUpdate(
      { email },
      { email, password },
      { upsert: true, new: true }
    );
    console.log("✅ Seeded/synced admin credentials in database.");
  } catch (error) {
    console.error("⚠️ Failed to seed default admin:", error);
  }
}

// Listen on port locally (conditional for Vercel serverless environment)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 8BitField API Server running on port ${PORT}`);
  });
}

export default app;

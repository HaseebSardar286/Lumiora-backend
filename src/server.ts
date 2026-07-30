import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db";
import bookingsRouter from "./routes/bookings";
import quotesRouter from "./routes/quotes";
import contactsRouter from "./routes/contacts";
import configRouter from "./routes/config";
import projectsRouter from "./routes/projects";
import AdminConfig from "./models/AdminConfig";
import Admin from "./models/Admin";
import { seedProjects } from "./config/projectsSeed";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes mapping
app.use("/api/bookings", bookingsRouter);
app.use("/api/quotes", quotesRouter);
app.use("/api/contact", contactsRouter);
app.use("/api/admin/config", configRouter);
app.use("/api/projects", projectsRouter);

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
    const email = process.env.ADMIN_EMAIL || "admin@lumiora.com";
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

// Start database connection and listen
async function startServer() {
  await connectDB();
  await seedDefaultConfig();
  await seedProjects();
  await seedAdmin();
  
  app.listen(PORT, () => {
    console.log(`🚀 Lumiora API Server running on port ${PORT}`);
  });
}

startServer();

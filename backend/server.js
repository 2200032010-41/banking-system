import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();

// Middleware: configure CORS using env variable (for dev: FRONTEND_URL=http://localhost:3000 in .env)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json()); // modern express supports json parsing natively

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("💰 Banking & Finance Management System API is running...");
});

// Server: bind to 0.0.0.0 and use PORT from environment for Render compatibility
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`)
);

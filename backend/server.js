import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import patientRoutes from "./routes/patientRoutes.js"; // Note: .js extension is required now

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://maternallink.onrender.com",
    "https://maternal-link.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected (Cloud)"))
  .catch((err) => console.error("❌ Database Error:", err));

// Routes
app.use("/api/patients", patientRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
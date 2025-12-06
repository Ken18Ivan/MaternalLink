import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import Patient from "./models/Patient.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// EMERGENCY DB CONNECTION (Replace with your actual string if .env fails)
const dbLink = process.env.MONGO_URI || "mongodb+srv://admin:Antenatal2025@antenataldb.ovmhjr4.mongodb.net/antenatal_db?appName=AntenatalDB";

mongoose.connect(dbLink)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.log(err));

// --- ROUTES ---

// GET All Patients
app.get("/api/patients", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST New Patient (With Thesis Logic)
app.post("/api/patients", async (req, res) => {
  const { name, bloodPressure, heartRate, temperature, respiratoryRate, oxygenSaturation, weight } = req.body;

  let status = "Normal";
  
  // Thesis Logic: Critical Thresholds
  const [systolic, diastolic] = bloodPressure.split('/').map(Number);
  
  if (systolic >= 140 || diastolic >= 90) status = "For Referral"; // Pre-eclampsia
  if (temperature >= 38.5) status = "For Referral"; // Fever
  if (heartRate < 60 || heartRate > 100) status = "For Referral"; // Abnormal HR
  if (oxygenSaturation < 95) status = "For Referral"; // Low Oxygen

  try {
    const newPatient = new Patient({ 
      name, bloodPressure, heartRate, temperature, respiratoryRate, oxygenSaturation, weight, 
      status 
    });
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE Patient
app.delete("/api/patients/:id", async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Patient deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(5001, () => {
  console.log("🚀 Server running on port 5001");
});
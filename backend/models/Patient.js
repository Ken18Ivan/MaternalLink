import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bloodPressure: { type: String, required: true },
  heartRate: { type: Number, required: true },
  temperature: { type: Number, required: true },
  respiratoryRate: { type: Number, required: true },
  oxygenSaturation: { type: Number, required: true },
  weight: { type: Number, required: true },
  status: { type: String, default: "Normal" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Patient", PatientSchema);
import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  name: { type: String, required: true },
  pregnancyWeeks: { type: Number, required: true }, 

  // --- NEW FIELD: STORE THE APPOINTMENT DATE ---
  nextCheckup: { type: Date }, 

  bloodPressure: { type: String, required: true },
  temperature: { type: Number, required: true },
  heartRate: { type: Number, required: true },
  weight: { type: Number },
  oxygenSaturation: { type: String },
  notes: { type: String }, 
  adminFeedback: { type: String, default: "" }, 
  status: { type: String, enum: ['Normal', 'For Referral', 'Completed'], default: 'Normal' },
  isSelfReport: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Patient", PatientSchema);
import express from "express";
import Patient from "../models/Patient.js";

const router = express.Router();

// --- HELPER: STRICTER RISK CALCULATION ---
const checkRisk = (bp, temp, hr) => {
  let status = "Normal";
  
  if (bp && bp.includes('/')) {
    const [systolic, diastolic] = bp.split('/').map(Number);
    // STRICTER RULE: 130/85 is now "For Referral"
    if (systolic >= 130 || diastolic >= 85) status = "For Referral";
  }

  if (temp && temp >= 37.8) status = "For Referral";
  if (hr && hr > 100) status = "For Referral";

  return status;
};

// --- 1. GET ALL PATIENTS ---
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 2. ENROLL / ADD RECORD ---
router.post("/", async (req, res) => {
  const calculatedStatus = checkRisk(req.body.bloodPressure, req.body.temperature, req.body.heartRate);

  const patient = new Patient({
    patientId: req.body.patientId,       
    name: req.body.name,                 
    pregnancyWeeks: req.body.pregnancyWeeks, 
    bloodPressure: req.body.bloodPressure,
    temperature: req.body.temperature,
    heartRate: req.body.heartRate,
    weight: req.body.weight,
    oxygenSaturation: req.body.oxygenSaturation,
    notes: req.body.notes,               
    isSelfReport: req.body.isSelfReport, 
    adminFeedback: "",
    status: calculatedStatus 
  });

  try {
    const newPatient = await patient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- 3. SAVE ADMIN FEEDBACK & SCHEDULE ---
router.put("/:id/feedback", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Save Message
    if (req.body.feedback !== undefined) {
        patient.adminFeedback = req.body.feedback;
    }

    // --- FIX IS HERE ---
    // We check if it is UNDEFINED. If it is null, we accept it.
    if (req.body.nextCheckup !== undefined) {
      patient.nextCheckup = req.body.nextCheckup;
    }
    
    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- 4. DELETE RECORD ---
router.delete("/:id", async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Patient" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
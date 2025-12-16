import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, Activity, ArrowLeft, Thermometer, Heart, Weight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const MotherInputPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // State for all inputs
  const [formData, setFormData] = useState({
    bloodPressure: "",
    weight: "",
    temperature: "",
    heartRate: "",
    notes: ""
  });

  // --- VALIDATION (The "Safety Guard" I added) ---
  const validateInputs = () => {
    const { bloodPressure, weight, temperature, heartRate } = formData;

    // 1. BP Check
    const bpRegex = /^\d{2,3}\/\d{2,3}$/;
    if (!bpRegex.test(bloodPressure)) {
      toast.error("BP format must be '120/80'");
      return false;
    }

    // 2. Number Checks (Prevent huge/impossible numbers)
    const w = parseFloat(weight);
    if (isNaN(w) || w < 30 || w > 300) { toast.error("Invalid Weight (30-300kg)"); return false; }

    const t = parseFloat(temperature);
    if (isNaN(t) || t < 30 || t > 45) { toast.error("Invalid Temp (30-45°C)"); return false; }

    const hr = parseFloat(heartRate);
    if (isNaN(hr) || hr < 30 || hr > 250) { toast.error("Invalid Heart Rate"); return false; }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check validation before saving
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const payload = {
        patientId: user.name, 
        name: user.realName || "Mother", 
        bloodPressure: formData.bloodPressure,
        weight: Number(formData.weight),
        temperature: Number(formData.temperature),
        heartRate: Number(formData.heartRate),
        notes: formData.notes,
        isSelfReport: true, // Mark as self-report
      };

      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/patients`, payload, config);

      toast.success("Vitals Saved Successfully!");
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to save vitals.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Note: I removed <MotherLayout> to prevent the double-footer bug.
    // The design inside (bg-gray-50, padding, etc.) remains identical.
    <div className="pb-24 bg-gray-50 min-h-screen p-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="bg-white p-2 rounded-full shadow-sm">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Log Vitals</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. BLOOD PRESSURE CARD (Red UI Preserved) */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full"><Activity className="w-5 h-5 text-red-500" /></div>
                <label className="font-bold text-gray-700 uppercase text-xs tracking-widest">Blood Pressure</label>
            </div>
            {/* Big Input Preserved */}
            <input 
                type="text" 
                placeholder="e.g. 120/80" 
                className="w-full text-3xl font-black text-gray-800 placeholder:text-gray-200 outline-none"
                value={formData.bloodPressure}
                onChange={e => setFormData({...formData, bloodPressure: e.target.value})}
            />
        </div>

        {/* 2. GRID FOR WEIGHT & HEART RATE */}
        <div className="grid grid-cols-2 gap-4">
            {/* Weight (Blue UI Preserved) */}
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <Weight className="w-4 h-4 text-blue-500" />
                    <label className="font-bold text-gray-400 uppercase text-[10px]">Weight (kg)</label>
                </div>
                <input 
                    type="number" 
                    placeholder="65" 
                    className="w-full text-2xl font-black text-gray-800 placeholder:text-gray-200 outline-none"
                    value={formData.weight}
                    onChange={e => setFormData({...formData, weight: e.target.value})}
                />
            </div>

            {/* Heart Rate (Rose UI Preserved) */}
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <label className="font-bold text-gray-400 uppercase text-[10px]">Heart Rate</label>
                </div>
                <input 
                    type="number" 
                    placeholder="80" 
                    className="w-full text-2xl font-black text-gray-800 placeholder:text-gray-200 outline-none"
                    value={formData.heartRate}
                    onChange={e => setFormData({...formData, heartRate: e.target.value})}
                />
            </div>
        </div>

        {/* 3. TEMPERATURE CARD (Orange UI Preserved) */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <label className="font-bold text-gray-400 uppercase text-[10px]">Temperature (°C)</label>
                </div>
                <input 
                    type="number" 
                    placeholder="36.5" 
                    className="w-full text-2xl font-black text-gray-800 placeholder:text-gray-200 outline-none"
                    value={formData.temperature}
                    onChange={e => setFormData({...formData, temperature: e.target.value})}
                />
            </div>
        </div>

        {/* 4. NOTES TEXTAREA */}
        <textarea 
            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 resize-none h-32 text-sm font-medium"
            placeholder="Any other feelings? (Headache, dizziness, etc.)"
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
        ></textarea>

        {/* 5. SUBMIT BUTTON (Blue Shadow UI Preserved) */}
        <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-[2rem] font-bold uppercase tracking-widest shadow-lg shadow-blue-200 flex items-center justify-center gap-3 transition-transform active:scale-95"
        >
            {loading ? "Saving..." : <><Save className="w-5 h-5" /> Save Vitals</>}
        </button>

      </form>
    </div>
  );
};

export default MotherInputPage;
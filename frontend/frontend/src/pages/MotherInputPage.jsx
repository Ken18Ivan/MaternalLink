import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, Activity, ArrowLeft, Thermometer, Heart, Weight, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const MotherInputPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // --- FIX 1: Add State for Real Name ---
  const [realName, setRealName] = useState("Mother"); 

  const [formData, setFormData] = useState({
    pregnancyWeeks: "",
    bloodPressure: "",
    weight: "",
    temperature: "",
    heartRate: "",
    notes: ""
  });

  // --- FIX 2: Fetch the Real Name on Load ---
  useEffect(() => {
    const fetchPatientName = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients`);
        // Find the record that matches the logged-in user's ID
        const myRecord = res.data.find(r => r.patientId === user.name);
        
        if (myRecord && myRecord.name) {
          setRealName(myRecord.name); // Set the correct name (e.g., "Maria")
        }
      } catch (err) {
        console.error("Could not fetch name:", err);
      }
    };

    if (user && user.name) {
      fetchPatientName();
    }
  }, [user]);

  const validateInputs = () => {
    const { bloodPressure, weight, temperature, heartRate, pregnancyWeeks } = formData;

    if (!pregnancyWeeks) {
        toast.error("Please enter Pregnancy Weeks");
        return false;
    }

    const bpRegex = /^\d{2,3}\/\d{2,3}$/;
    if (!bpRegex.test(bloodPressure) && bloodPressure !== "") {
      toast.error("BP format must be '120/80'");
      return false;
    }

    const w = parseFloat(weight);
    if (weight && (isNaN(w) || w < 30 || w > 300)) { toast.error("Invalid Weight"); return false; }

    const t = parseFloat(temperature);
    if (temperature && (isNaN(t) || t < 30 || t > 45)) { toast.error("Invalid Temp"); return false; }

    const hr = parseFloat(heartRate);
    if (heartRate && (isNaN(hr) || hr < 30 || hr > 250)) { toast.error("Invalid Heart Rate"); return false; }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);
    try {
      const payload = {
        patientId: user.name, 
        // --- FIX 3: Use the fetched realName ---
        name: realName, 
        pregnancyWeeks: Number(formData.pregnancyWeeks), 
        bloodPressure: formData.bloodPressure,
        weight: Number(formData.weight),
        temperature: Number(formData.temperature),
        heartRate: Number(formData.heartRate),
        notes: formData.notes,
        isSelfReport: true, 
      };

      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/patients`, payload, config);

      toast.success("Vitals Saved Successfully!");
      navigate("/mother/dashboard"); 

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to save vitals.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 bg-gray-50 min-h-screen p-6 font-sans">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Log Vitals</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* PREGNANCY WEEKS CARD */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-pink-100 p-2 rounded-full">
                    <Calendar className="w-5 h-5 text-pink-500" />
                </div>
                <label className="font-bold text-gray-700 uppercase text-xs tracking-widest">Pregnancy Weeks</label>
            </div>
            <input 
                type="number" 
                placeholder="e.g. 24" 
                className="w-full text-4xl font-black text-gray-800 placeholder:text-gray-200 outline-none bg-transparent"
                value={formData.pregnancyWeeks}
                onChange={e => setFormData({...formData, pregnancyWeeks: e.target.value})}
                required
            />
        </div>

        {/* BLOOD PRESSURE CARD */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full"><Activity className="w-5 h-5 text-red-500" /></div>
                <label className="font-bold text-gray-700 uppercase text-xs tracking-widest">Blood Pressure</label>
            </div>
            <input 
                type="text" 
                placeholder="e.g. 120/80" 
                className="w-full text-4xl font-black text-gray-800 placeholder:text-gray-200 outline-none bg-transparent"
                value={formData.bloodPressure}
                onChange={e => setFormData({...formData, bloodPressure: e.target.value})}
            />
        </div>

        {/* GRID FOR WEIGHT & HEART RATE */}
        <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <Weight className="w-4 h-4 text-blue-500" />
                    <label className="font-bold text-gray-400 uppercase text-[10px]">Weight (kg)</label>
                </div>
                <input 
                    type="number" 
                    placeholder="65" 
                    className="w-full text-3xl font-black text-gray-800 placeholder:text-gray-200 outline-none bg-transparent"
                    value={formData.weight}
                    onChange={e => setFormData({...formData, weight: e.target.value})}
                />
            </div>

            {/* Heart Rate */}
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <label className="font-bold text-gray-400 uppercase text-[10px]">Heart Rate</label>
                </div>
                <input 
                    type="number" 
                    placeholder="80" 
                    className="w-full text-3xl font-black text-gray-800 placeholder:text-gray-200 outline-none bg-transparent"
                    value={formData.heartRate}
                    onChange={e => setFormData({...formData, heartRate: e.target.value})}
                />
            </div>
        </div>

        {/* TEMPERATURE CARD */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <label className="font-bold text-gray-400 uppercase text-[10px]">Temperature (°C)</label>
                </div>
                <input 
                    type="number" 
                    placeholder="36.5" 
                    className="w-full text-3xl font-black text-gray-800 placeholder:text-gray-200 outline-none bg-transparent"
                    value={formData.temperature}
                    onChange={e => setFormData({...formData, temperature: e.target.value})}
                />
            </div>
        </div>

        {/* NOTES TEXTAREA */}
        <textarea 
            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 resize-none h-32 text-sm font-medium outline-none"
            placeholder="Any other feelings? (Headache, dizziness, etc.)"
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
        ></textarea>

        {/* SUBMIT BUTTON */}
        <button 
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-black text-white p-5 rounded-[2rem] font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
        >
            {loading ? "Saving..." : <><Save className="w-5 h-5" /> Save Vitals</>}
        </button>

      </form>
    </div>
  );
};

export default MotherInputPage;
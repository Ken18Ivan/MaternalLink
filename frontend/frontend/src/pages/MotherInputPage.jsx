import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Save, ArrowLeft, Activity, Thermometer, Scale } from "lucide-react";
import { toast } from "react-hot-toast";

const MotherInputPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // user.name is the ID (2025-XXXX)
  const [loading, setLoading] = useState(false);
  const [realName, setRealName] = useState("Checking...");
  const [weeks, setWeeks] = useState(0);

  // FETCH REAL NAME SO WE SAVE IT CORRECTLY
  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients`);
        // Find existing record for this ID to get the Real Name
        const myProfile = res.data.find(r => r.patientId === user.name);
        if (myProfile) {
          setRealName(myProfile.name);
          setWeeks(myProfile.pregnancyWeeks); // Keep the weeks consistent
        } else {
            setRealName("Unknown User");
        }
      } catch (e) { console.error(e); }
    };
    fetchIdentity();
  }, [user.name]);

  const [formData, setFormData] = useState({
    bloodPressure: "",
    temperature: "",
    weight: "",
    heartRate: "80", 
    oxygenSaturation: "98", 
    notes: "",
    isSelfReport: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // WE MUST SEND BOTH ID AND REAL NAME
      const dataToSend = { 
        ...formData, 
        patientId: user.name, // The ID from Login
        name: realName,       // The Real Name found from DB
        pregnancyWeeks: weeks // Pass existing weeks so it doesn't get lost
      };
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/patients`, dataToSend);
      toast.success("Vitals Sent Successfully!");
      navigate("/mother");
    } catch (error) {
      toast.error("Failed to send data. Check internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 bg-pink-50 min-h-screen">
      <div className="bg-white p-6 pt-8 rounded-b-[2rem] shadow-sm flex items-center gap-4">
        <button onClick={() => navigate("/mother")} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-gray-800">Report My Vitals</h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Self-Check Record</p>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm space-y-6">
            <div className="text-center border-b border-gray-100 pb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reporting For</p>
                {/* DISPLAY REAL NAME */}
                <p className="text-lg font-black text-pink-500">{realName}</p>
                <p className="text-xs font-mono text-pink-300">ID: {user.name}</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                <Activity className="w-4 h-4 text-blue-500" /> Blood Pressure
              </label>
              <input type="text" placeholder="e.g. 120/80" className="input input-lg w-full bg-blue-50/50 border-blue-100 rounded-2xl text-xl font-bold text-gray-800 focus:bg-white" value={formData.bloodPressure} onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})} required />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                <Scale className="w-4 h-4 text-orange-500" /> Weight (kg)
              </label>
              <input type="number" placeholder="e.g. 65" className="input input-lg w-full bg-orange-50/50 border-orange-100 rounded-2xl text-xl font-bold text-gray-800 focus:bg-white" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} required />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                <Thermometer className="w-4 h-4 text-red-500" /> Temperature (°C)
              </label>
              <input type="number" placeholder="e.g. 36.5" className="input input-lg w-full bg-red-50/50 border-red-100 rounded-2xl text-xl font-bold text-gray-800 focus:bg-white" value={formData.temperature} onChange={(e) => setFormData({...formData, temperature: e.target.value})} required />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">How do you feel?</label>
              <textarea placeholder="e.g. I feel a bit dizzy today..." className="textarea textarea-lg w-full h-32 bg-gray-50 border-gray-200 rounded-2xl text-base font-medium text-gray-800 focus:bg-white" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
            </div>
          </div>

          <button disabled={loading} className="w-full h-20 rounded-[2rem] bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xl font-black uppercase tracking-wider shadow-xl shadow-pink-500/30 flex items-center justify-center gap-4 active:scale-95 transition-transform disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? <span className="loading loading-spinner loading-md"></span> : <><Save className="w-8 h-8" /><span>Submit Report</span></>}
          </button>
        </form>
      </div>
    </div>
  );
};
export default MotherInputPage;
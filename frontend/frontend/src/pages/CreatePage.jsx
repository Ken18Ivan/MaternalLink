import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// 1. IMPORT Calendar and Clock
import { Save, ArrowLeft, User, Calendar, Hash, Clock, Activity } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext"; 

const CreatePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); 
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientId: "", 
    name: "",
    pregnancyWeeks: "",
    bloodPressure: "",
    temperature: "",
    heartRate: "",
    weight: "",
    oxygenSaturation: "", 
    // ADDED Appointment Fields
    appointmentDate: "",
    appointmentTime: "",
    isSelfReport: false 
  });

  useEffect(() => {
    const randomId = "2025-" + Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, patientId: randomId }));
  }, []);

  const validateAndSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const bpRegex = /^\d{2,3}\/\d{2,3}$/;
    if (formData.bloodPressure && !bpRegex.test(formData.bloodPressure)) {
        return toast.error("BP must be '120/80' format");
    }
    
    // Prepare Payload
    const payload = {
        patientId: formData.patientId, 
        name: formData.name,           
        bloodPressure: formData.bloodPressure,
        isSelfReport: formData.isSelfReport,
        pregnancyWeeks: Number(formData.pregnancyWeeks),
        temperature: Number(formData.temperature),
        heartRate: Number(formData.heartRate),
        weight: formData.weight ? Number(formData.weight) : undefined,
        // Send appointment data if needed (depending on your backend schema)
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime
    };

    setLoading(true);
    try {
      const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/patients`, payload, config);
      toast.success(`Enrolled! ID: ${formData.patientId}`);
      navigate("/patients");

    } catch (error) {
      console.error("Submission Error:", error);
      const msg = error.response?.data?.message || "Error creating record";
      toast.error(`Failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="btn btn-circle btn-ghost btn-sm bg-white border border-gray-200">
            <ArrowLeft className="w-4 h-4 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Patient Enrollment</h1>
      </div>

      <form onSubmit={validateAndSubmit} className="bg-white p-8 rounded-[2rem] shadow-lg border border-gray-200 space-y-6">
        
        {/* --- ID Section --- */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
                <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Official Patient ID</p>
                <p className="text-3xl font-black text-blue-700 tracking-tight">{formData.patientId}</p>
            </div>
            <Hash className="w-10 h-10 text-blue-300" />
        </div>

        {/* --- Name Section --- */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-wider">Mother's Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <input type="text" className="input input-bordered w-full pl-12 rounded-xl bg-gray-50 focus:bg-white text-gray-900 font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
        </div>

        {/* --- Pregnancy Weeks --- */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-wider">Pregnancy Weeks</label>
          <div className="relative">
            <Activity className="absolute left-4 top-3.5 w-5 h-5 text-pink-500" />
            <input type="number" className="input input-bordered w-full pl-12 rounded-xl bg-pink-50 border-pink-100 focus:bg-white text-gray-800 font-bold" value={formData.pregnancyWeeks} onChange={(e) => setFormData({...formData, pregnancyWeeks: e.target.value})} required />
          </div>
        </div>

        {/* --- Vitals Grid --- */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">BP (e.g 120/80)</label>
            <input type="text" placeholder="120/80" className="input input-bordered w-full rounded-xl bg-gray-50 text-gray-900 font-bold" value={formData.bloodPressure} onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})} required />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Temp (°C)</label>
            <input type="number" step="0.1" placeholder="36.5" className="input input-bordered w-full rounded-xl bg-gray-50 text-gray-900 font-bold" value={formData.temperature} onChange={(e) => setFormData({...formData, temperature: e.target.value})} required />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Heart Rate</label>
            <input type="number" placeholder="80" className="input input-bordered w-full rounded-xl bg-gray-50 text-gray-900 font-bold" value={formData.heartRate} onChange={(e) => setFormData({...formData, heartRate: e.target.value})} required />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Weight (kg)</label>
            <input type="number" step="0.1" placeholder="65" className="input input-bordered w-full rounded-xl bg-gray-50 text-gray-900 font-bold" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} required />
          </div>
        </div>

        {/* --- NEW APPOINTMENT SECTION (FIXED ICONS) --- */}
        <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Set Appointment</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* DATE INPUT */}
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Date</label>
                    <div className="relative">
                        {/* 1. The Icon (Absolute Position) */}
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 pointer-events-none" />
                        
                        {/* 2. The Input (Padding Left to make room for icon) */}
                        <input 
                            type="date" 
                            className="input input-bordered w-full pl-12 rounded-xl bg-blue-50/50 border-blue-100 focus:bg-white text-gray-900 font-bold"
                            value={formData.appointmentDate}
                            onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                        />
                    </div>
                </div>

                {/* TIME INPUT */}
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Time</label>
                    <div className="relative">
                        {/* 1. The Icon (Absolute Position) */}
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 pointer-events-none" />
                        
                        {/* 2. The Input (Padding Left to make room for icon) */}
                        <input 
                            type="time" 
                            className="input input-bordered w-full pl-12 rounded-xl bg-blue-50/50 border-blue-100 focus:bg-white text-gray-900 font-bold"
                            value={formData.appointmentTime}
                            onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                        />
                    </div>
                </div>
            </div>
        </div>
        {/* --- END APPOINTMENT SECTION --- */}

        <button disabled={loading} className="btn bg-gray-900 hover:bg-black text-white w-full rounded-xl font-bold uppercase tracking-wider shadow-xl h-14 border-none flex items-center gap-2">
          {loading ? "Saving..." : <><Save className="w-5 h-5" /> Enroll & Generate ID</>}
        </button>
      </form>
    </div>
  );
};

export default CreatePage;
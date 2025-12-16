import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft, User, Activity, Calendar, Hash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext"; 

const CreatePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); // <--- CRITICAL: Needed to permission to save
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
    isSelfReport: false 
  });

  // Generate Random ID on load
  useEffect(() => {
    const randomId = "2025-" + Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, patientId: randomId }));
  }, []);

  const validateAndSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation
    const bpRegex = /^\d{2,3}\/\d{2,3}$/;
    if (!bpRegex.test(formData.bloodPressure)) {
        return toast.error("BP must be '120/80' format");
    }
    
    // 2. Prepare Payload (Aligning types with your Schema)
    const payload = {
        patientId: formData.patientId, // String -> Schema String (MATCH)
        name: formData.name,           // String -> Schema String (MATCH)
        bloodPressure: formData.bloodPressure, // String -> Schema String (MATCH)
        isSelfReport: formData.isSelfReport,
        
        // Convert Numbers (Schema requires Number)
        pregnancyWeeks: Number(formData.pregnancyWeeks),
        temperature: Number(formData.temperature),
        heartRate: Number(formData.heartRate),
        
        // Weight is optional in Schema ({type: Number}), but if provided, must be Number
        weight: formData.weight ? Number(formData.weight) : undefined,

        // Oxygen is String in Schema ({type: String})
        // If empty, send undefined so it doesn't save an empty string ""
        oxygenSaturation: formData.oxygenSaturation ? String(formData.oxygenSaturation) : undefined
    };

    setLoading(true);
    try {
      // 3. Authorization Header (This was likely the main cause of the error)
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
      
      // Get the REAL error message from the backend
      const serverMessage = error.response?.data?.message 
                         || error.response?.statusText 
                         || "Error creating record";
      
      toast.error(`Failed: ${serverMessage}`);
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
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Patient Enrollment Form</h1>
      </div>

      <form onSubmit={validateAndSubmit} className="bg-white p-8 rounded-[2rem] shadow-lg border border-gray-200 space-y-6">
        
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
                <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Official Patient ID</p>
                <p className="text-3xl font-black text-blue-700 tracking-tight">{formData.patientId}</p>
            </div>
            <Hash className="w-10 h-10 text-blue-200" />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-wider">Mother's Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="e.g. Maria Dela Cruz" className="input input-bordered w-full pl-12 rounded-xl bg-gray-50 focus:bg-white text-gray-900 font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-wider">Pregnancy Weeks</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-pink-500" />
            <input type="number" placeholder="e.g. 24" className="input input-bordered w-full pl-12 rounded-xl bg-pink-50 border-pink-100 focus:bg-white text-gray-800 font-bold" value={formData.pregnancyWeeks} onChange={(e) => setFormData({...formData, pregnancyWeeks: e.target.value})} required />
          </div>
        </div>

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

        {/* Note: Oxygen Saturation Input was missing in your original code. 
            Since it is in the Schema ({type: String}), you can add an input for it here if you want, 
            or leave it hidden as I have done (it will send undefined). 
        */}

        <button disabled={loading} className="btn bg-blue-600 hover:bg-blue-700 text-white w-full rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-blue-200 h-14 border-none flex items-center gap-2">
          {loading ? "Saving..." : <><Save className="w-5 h-5" /> Enroll & Generate ID</>}
        </button>
      </form>
    </div>
  );
};

export default CreatePage;
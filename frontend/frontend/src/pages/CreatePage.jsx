import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft, User, Activity, Calendar, Hash } from "lucide-react";
import { toast } from "react-hot-toast";

const CreatePage = () => {
  const navigate = useNavigate();
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

  // AUTO-GENERATE ID (Format: 2025-XXXX)
  useEffect(() => {
    const randomId = "2025-" + Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, patientId: randomId }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/patients`, formData);
      toast.success(`Enrolled! ID: ${formData.patientId}`, { duration: 6000 });
      navigate("/patients");
    } catch (error) {
      toast.error("Error creating record");
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

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-lg shadow-gray-200/50 border border-gray-200 space-y-6">
        
        {/* ID DISPLAY */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
                <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Official Patient ID</p>
                <p className="text-3xl font-black text-blue-700 tracking-tight">{formData.patientId}</p>
            </div>
            <Hash className="w-10 h-10 text-blue-200" />
        </div>

        {/* NAME INPUT */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-wider">Mother's Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="e.g. Maria Dela Cruz" className="input input-bordered w-full pl-12 rounded-xl bg-gray-50 focus:bg-white" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
        </div>

        {/* WEEKS INPUT */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-wider">Pregnancy Duration (Weeks)</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-pink-500" />
            <input type="number" placeholder="e.g. 24" className="input input-bordered w-full pl-12 rounded-xl bg-pink-50 border-pink-100 focus:bg-white text-gray-800 font-bold" value={formData.pregnancyWeeks} onChange={(e) => setFormData({...formData, pregnancyWeeks: e.target.value})} required />
          </div>
        </div>

        {/* VITALS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Blood Pressure</label>
            <input type="text" placeholder="120/80" className="input input-bordered w-full rounded-xl bg-gray-50" value={formData.bloodPressure} onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})} required />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Temperature</label>
            <input type="number" placeholder="36.5" className="input input-bordered w-full rounded-xl bg-gray-50" value={formData.temperature} onChange={(e) => setFormData({...formData, temperature: e.target.value})} required />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Heart Rate</label>
            <input type="number" placeholder="80" className="input input-bordered w-full rounded-xl bg-gray-50" value={formData.heartRate} onChange={(e) => setFormData({...formData, heartRate: e.target.value})} required />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Weight (kg)</label>
            <input type="number" placeholder="65" className="input input-bordered w-full rounded-xl bg-gray-50" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} required />
          </div>
        </div>

        <button disabled={loading} className="btn bg-blue-600 hover:bg-blue-700 text-white w-full rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-blue-200 h-14 border-none flex items-center gap-2">
          {loading ? "Saving..." : <><Save className="w-5 h-5" /> Enroll & Generate ID</>}
        </button>
      </form>
    </div>
  );
};
export default CreatePage;
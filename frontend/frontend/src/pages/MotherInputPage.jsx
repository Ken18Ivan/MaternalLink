import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, Send } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { validateVitals } from "../utils"; // Import validation

const MotherInputPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ bp: "", weight: "", temp: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. RUN VALIDATION
    const validationErrors = validateVitals(formData.bp, formData.temp, formData.weight);
    
    // If errors exist, show them and stop
    if (validationErrors.length > 0) {
        validationErrors.forEach(err => toast.error(err));
        setLoading(false);
        return; 
    }

    // 2. SEND TO SERVER
    try {
      // NOTE: Ensure your backend handles /api/patients/log with session/token or proper ID
      await axios.post(`${import.meta.env.VITE_API_URL}/api/patients/log`, formData);
      toast.success("Vitals Sent Successfully!");
      setFormData({ bp: "", weight: "", temp: "", notes: "" });
      navigate("/mother"); // Go back to dashboard
    } catch (err) {
      console.error(err);
      toast.error("Failed to send data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50/30 p-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/mother" className="bg-white p-3 rounded-xl shadow-sm text-gray-600 hover:text-pink-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
            <h1 className="text-2xl font-black text-gray-800">Weekly Log</h1>
            <p className="text-xs font-bold text-pink-500 uppercase tracking-widest">Update your Vitals</p>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-lg border border-pink-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Blood Pressure */}
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">Blood Pressure</label>
                <input 
                    type="text" 
                    placeholder="e.g. 120/80"
                    className="input input-lg w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-pink-500 rounded-2xl font-bold text-gray-700 placeholder:font-normal"
                    value={formData.bp}
                    onChange={e => setFormData({...formData, bp: e.target.value})}
                />
            </div>

            <div className="flex gap-4">
                {/* Weight */}
                <div className="w-1/2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">Weight (kg)</label>
                    <input 
                        type="number" 
                        step="0.1"
                        placeholder="0.0"
                        className="input input-lg w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-pink-500 rounded-2xl font-bold text-gray-700 placeholder:font-normal"
                        value={formData.weight}
                        onChange={e => setFormData({...formData, weight: e.target.value})}
                    />
                </div>
                {/* Temp */}
                <div className="w-1/2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">Temp (°C)</label>
                    <input 
                        type="number" 
                        step="0.1"
                        placeholder="0.0"
                        className="input input-lg w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-pink-500 rounded-2xl font-bold text-gray-700 placeholder:font-normal"
                        value={formData.temp}
                        onChange={e => setFormData({...formData, temp: e.target.value})}
                    />
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">How do you feel?</label>
                <textarea 
                    className="textarea textarea-lg w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-pink-500 rounded-2xl font-medium text-gray-700 h-32 leading-relaxed"
                    placeholder="Type any pain or symptoms here..."
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                ></textarea>
            </div>

            <button disabled={loading} className="btn w-full bg-pink-500 hover:bg-pink-600 text-white border-none rounded-2xl h-14 text-sm font-black uppercase tracking-widest shadow-lg shadow-pink-200 gap-2">
                {loading ? "Sending..." : <><Send className="w-4 h-4" /> Submit Report</>}
            </button>

          </form>
      </div>
    </div>
  );
};
export default MotherInputPage;
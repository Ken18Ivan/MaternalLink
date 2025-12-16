import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { validateVitals } from "../utils"; // Import validation

const MotherInputPage = () => {
  const [formData, setFormData] = useState({ bp: "", weight: "", temp: "", notes: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. RUN VALIDATION
    const validationErrors = validateVitals(formData.bp, formData.temp, formData.weight);
    if (validationErrors.length > 0) {
        validationErrors.forEach(err => toast.error(err));
        return; // Stop function if error exists
    }

    // 2. Submit if valid
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/patients/log`, formData);
      toast.success("Vitals Sent to Clinic!");
      setFormData({ bp: "", weight: "", temp: "", notes: "" });
    } catch (err) {
      toast.error("Failed to send.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-pink-600">Weekly Health Check</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* INPUTS WITH TYPE CHECKING */}
        <div>
            <label className="label font-bold text-gray-500">Blood Pressure (e.g. 120/80)</label>
            <input 
                type="text" 
                placeholder="120/80"
                className="input input-bordered w-full border-pink-200 focus:border-pink-500"
                value={formData.bp}
                onChange={e => setFormData({...formData, bp: e.target.value})}
            />
        </div>

        <div className="flex gap-2">
            <div className="w-1/2">
                <label className="label font-bold text-gray-500">Weight (kg)</label>
                <input 
                    type="number" 
                    step="0.1"
                    className="input input-bordered w-full border-pink-200 focus:border-pink-500"
                    value={formData.weight}
                    onChange={e => setFormData({...formData, weight: e.target.value})}
                />
            </div>
            <div className="w-1/2">
                <label className="label font-bold text-gray-500">Temp (°C)</label>
                <input 
                    type="number" 
                    step="0.1"
                    className="input input-bordered w-full border-pink-200 focus:border-pink-500"
                    value={formData.temp}
                    onChange={e => setFormData({...formData, temp: e.target.value})}
                />
            </div>
        </div>

        <textarea 
            className="textarea textarea-bordered w-full border-pink-200"
            placeholder="How are you feeling?"
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
        ></textarea>

        <button className="btn bg-pink-500 hover:bg-pink-600 text-white w-full">Submit Update</button>
      </form>
    </div>
  );
};
export default MotherInputPage;
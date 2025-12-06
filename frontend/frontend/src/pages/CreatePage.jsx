import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";

const CreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    weight: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if(!formData.name || !formData.bloodPressure) {
      return toast.error("Please fill in Mother's Name and BP");
    }
    try {
      await axios.post("http://localhost:5001/api/patients", formData);
      toast.success("Vitals Recorded Successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to save record.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6">
      
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">New Prenatal Record</h2>
        <p className="text-gray-500 mt-2">Enter the mother's latest vital signs below. All fields are required.</p>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div className="space-y-8">
          
          {/* Section 1: Patient Identity */}
          <div className="form-control">
            <label className="label pl-1 pb-2">
              <span className="label-text text-gray-500 font-bold text-xs uppercase tracking-wider">Mother's Full Name</span>
            </label>
            <input 
              name="name" 
              onChange={handleChange} 
              type="text" 
              placeholder="e.g. Maria Dela Cruz" 
              className="input input-bordered h-16 text-lg pl-6 w-full rounded-2xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
            />
          </div>

          <div className="divider text-xs font-bold text-gray-300 uppercase tracking-widest">Vital Signs</div>

          {/* Section 2: Critical Vitals (BP & HR) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="form-control">
               <label className="label pl-1 pb-2">
                 <span className="label-text text-gray-500 font-bold text-xs uppercase tracking-wider">Blood Pressure (mmHg)</span>
               </label>
               <input name="bloodPressure" onChange={handleChange} placeholder="120/80" className="input input-bordered h-14 pl-5 rounded-2xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold text-gray-700" />
            </div>
            <div className="form-control">
               <label className="label pl-1 pb-2">
                 <span className="label-text text-gray-500 font-bold text-xs uppercase tracking-wider">Heart Rate (BPM)</span>
               </label>
               <input name="heartRate" onChange={handleChange} type="number" placeholder="78" className="input input-bordered h-14 pl-5 rounded-2xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold text-gray-700" />
            </div>
          </div>

          {/* Section 3: Physical Stats (Temp & Weight) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="form-control">
               <label className="label pl-1 pb-2">
                 <span className="label-text text-gray-500 font-bold text-xs uppercase tracking-wider">Temperature (°C)</span>
               </label>
               <input name="temperature" onChange={handleChange} type="number" placeholder="36.5" className="input input-bordered h-14 pl-5 rounded-2xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold text-gray-700" />
            </div>
            <div className="form-control">
               <label className="label pl-1 pb-2">
                 <span className="label-text text-gray-500 font-bold text-xs uppercase tracking-wider">Weight (kg)</span>
               </label>
               <input name="weight" onChange={handleChange} type="number" placeholder="65" className="input input-bordered h-14 pl-5 rounded-2xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold text-gray-700" />
            </div>
          </div>

          {/* Section 4: Respiratory (RR & SpO2) */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="form-control">
               <label className="label pl-1 pb-2">
                 <span className="label-text text-gray-500 font-bold text-xs uppercase tracking-wider">Respiratory Rate</span>
               </label>
               <input name="respiratoryRate" onChange={handleChange} type="number" placeholder="16" className="input input-bordered h-14 pl-5 rounded-2xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold text-gray-700" />
            </div>
            <div className="form-control">
               <label className="label pl-1 pb-2">
                 <span className="label-text text-gray-500 font-bold text-xs uppercase tracking-wider">Oxygen Saturation (%)</span>
               </label>
               <input name="oxygenSaturation" onChange={handleChange} type="number" placeholder="98" className="input input-bordered h-14 pl-5 rounded-2xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold text-gray-700" />
            </div>
          </div>

          {/* UPDATED SUBMIT BUTTON */}
          <div className="pt-8">
            <button 
              onClick={handleAdd} 
              className="btn btn-primary w-full h-16 rounded-2xl text-white text-xl font-extrabold uppercase tracking-widest shadow-xl shadow-primary/40 hover:scale-[1.01] hover:shadow-2xl transition-all flex items-center justify-center gap-3 border-none"
            >
              <Save className="w-7 h-7" />
              <span>Submit Record</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreatePage;
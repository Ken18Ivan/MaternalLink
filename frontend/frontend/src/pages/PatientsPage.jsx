import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderPlus, Trash2, Search, Eye, X, Send, Calendar, MessageSquare, Hash, Clock, CheckCircle, Download, PlusCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { validateVitals, calculateWeeks } from "../utils"; // Import Helpers

const PatientsPage = () => {
  // ... existing state ...
  const [patients, setPatients] = useState([]); 
  const [allLogs, setAllLogs] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // NEW STATE FOR CLINIC INPUT
  const [clinicInput, setClinicInput] = useState({ bp: "", weight: "", temp: "", notes: "" });
  const [showClinicForm, setShowClinicForm] = useState(false);

  // ... fetchPatients existing code ...

  // --- NEW: HANDLE CLINIC VISIT SUBMISSION ---
  const handleClinicSubmit = async (e) => {
    e.preventDefault();
    const errors = validateVitals(clinicInput.bp, clinicInput.temp, clinicInput.weight);
    if(errors.length > 0) {
        errors.forEach(err => toast.error(err));
        return;
    }

    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/patients/log`, {
            ...clinicInput,
            patientId: selectedPatient.patientId, 
            isSelfReport: false // This marks it as OFFICIAL CLINIC DATA
        });
        toast.success("Clinic Visit Recorded");
        setClinicInput({ bp: "", weight: "", temp: "", notes: "" });
        setShowClinicForm(false);
        fetchPatients(); // Refresh data
        // Ideally also refresh local history here without full refetch
    } catch (err) {
        toast.error("Failed to save visit");
    }
  };

  // ... PDF generation code ...

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* ... Header and Search code ... */}

      {/* PATIENT TABLE (UPDATED WITH DYNAMIC WEEKS) */}
      <table className="table w-full">
         {/* ... thead ... */}
         <tbody>
            {filteredPatients.map((patient) => (
                <tr key={patient._id}>
                   {/* ... name column ... */}
                   <td className="py-6">
                     <div className="badge badge-lg bg-pink-50 text-pink-600 border-pink-100 font-black">
                       {/* DYNAMIC WEEKS CALCULATION */}
                       {calculateWeeks(patient.pregnancyWeeks, patient.createdAt)} Weeks
                     </div>
                   </td>
                   {/* ... status and action columns ... */}
                </tr>
            ))}
         </tbody>
      </table>

      {/* MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header ... */}

            <div className="p-6 overflow-y-auto">
              
              {/* --- NEW: CLINIC VISIT ENTRY BUTTON --- */}
              <div className="mb-6">
                 {!showClinicForm ? (
                    <button onClick={() => setShowClinicForm(true)} className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-colors">
                        <PlusCircle className="w-4 h-4"/> Add Clinic Visit Data
                    </button>
                 ) : (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-in fade-in zoom-in">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-gray-700">New Clinic Visit</h3>
                            <button onClick={() => setShowClinicForm(false)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4"/></button>
                        </div>
                        <form onSubmit={handleClinicSubmit} className="space-y-3">
                            <input placeholder="BP (120/80)" value={clinicInput.bp} onChange={e=>setClinicInput({...clinicInput, bp: e.target.value})} className="input input-sm w-full input-bordered"/>
                            <div className="flex gap-2">
                                <input placeholder="Weight (kg)" value={clinicInput.weight} onChange={e=>setClinicInput({...clinicInput, weight: e.target.value})} className="input input-sm w-full input-bordered"/>
                                <input placeholder="Temp (°C)" value={clinicInput.temp} onChange={e=>setClinicInput({...clinicInput, temp: e.target.value})} className="input input-sm w-full input-bordered"/>
                            </div>
                            <input placeholder="Midwife Notes" value={clinicInput.notes} onChange={e=>setClinicInput({...clinicInput, notes: e.target.value})} className="input input-sm w-full input-bordered"/>
                            <button type="submit" className="btn btn-sm btn-neutral w-full">Save Record</button>
                        </form>
                    </div>
                 )}
              </div>

              {/* ... Existing Appointment Manager ... */}
              {/* ... Existing History List ... */}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PatientsPage;
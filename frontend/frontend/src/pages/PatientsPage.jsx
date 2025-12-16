import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderPlus, Trash2, Search, Eye, X, Send, Calendar, MessageSquare, Hash, Clock, CheckCircle, Download, PlusCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// --- HELPER FUNCTIONS (Internal to avoid import errors if utils.js is missing) ---
const validateVitals = (bp, temp, weight) => {
    const errors = [];
    const bpRegex = /^\d{2,3}\/\d{2,3}$/;
    if (!bpRegex.test(bp)) errors.push("BP must be format '120/80'");
    
    const tempNum = parseFloat(temp);
    if (isNaN(tempNum) || tempNum < 30 || tempNum > 45) errors.push("Temperature invalid (30-45°C)");
    
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum < 30 || weightNum > 200) errors.push("Weight invalid (30-200kg)");
    
    return errors;
};

const calculateWeeks = (startWeeks, dateCreated) => {
    if (!startWeeks || !dateCreated) return "N/A";
    const start = new Date(dateCreated);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)); 
    return parseInt(startWeeks) + diffWeeks;
};
// ---------------------------------------------------------------------------

const PatientsPage = () => {
  const [patients, setPatients] = useState([]); 
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [feedback, setFeedback] = useState(""); 
  
  // Appointment Inputs
  const [appointDate, setAppointDate] = useState("");
  const [appointTime, setAppointTime] = useState("");

  // Clinic Visit Input State
  const [clinicInput, setClinicInput] = useState({ bp: "", weight: "", temp: "", notes: "" });
  const [showClinicForm, setShowClinicForm] = useState(false);

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients`);
      const data = response.data;
      const sortedData = data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllLogs(sortedData);

      const uniqueMap = new Map();
      sortedData.forEach(item => {
        const key = item.patientId || item.name; 
        if(!uniqueMap.has(key)) {
          uniqueMap.set(key, {
            ...item,
            totalLogs: sortedData.filter(r => (r.patientId === item.patientId) || (r.name === item.name)).length
          });
        }
      });
      setPatients(Array.from(uniqueMap.values()));
      setLoading(false);
    } catch (error) { setLoading(false); }
  };

  const handleViewPatient = (patient) => {
    const history = allLogs.filter(log => 
      (patient.patientId && log.patientId === patient.patientId) || 
      log.name === patient.name
    );
    setPatientHistory(history);
    setSelectedPatient(patient);
    setFeedback(""); 
    setAppointDate("");
    setAppointTime("");
    setShowClinicForm(false);
  };

  // --- PDF REPORT GENERATION ---
  const generatePDF = () => {
    try {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("Maternal Health Record", 105, 15, null, null, "center");
        doc.setFontSize(10);
        doc.text("LGU Iligan City • Official Medical Document", 105, 25, null, null, "center");

        // Patient Info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Patient Name: ${selectedPatient.name}`, 14, 50);
        doc.text(`Patient ID: ${selectedPatient.patientId}`, 14, 58);
        doc.text(`Pregnancy Stage: ${calculateWeeks(selectedPatient.pregnancyWeeks, selectedPatient.createdAt)} Weeks`, 14, 66);
        doc.text(`Status: ${selectedPatient.status}`, 14, 74);

        // Table
        const tableColumn = ["Date", "Type", "BP", "Weight", "Temp", "Notes"];
        const tableRows = [];

        patientHistory.forEach(log => {
          const logData = [
              new Date(log.createdAt).toLocaleDateString(),
              log.isSelfReport ? "Self-Report" : "Clinic Visit",
              log.bloodPressure,
              log.weight ? `${log.weight}kg` : "-",
              log.temperature ? `${log.temperature}°C` : "-",
              log.notes || "-"
          ];
          tableRows.push(logData);
        });

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 85,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235] }
        });

        // Footer
        const finalY = (doc).lastAutoTable ? (doc).lastAutoTable.finalY + 30 : 150;
        doc.setFontSize(10);
        doc.text("Generated by MaternalLink System", 14, finalY);
        doc.text("_________________________", 140, finalY - 5);
        doc.text("Midwife Signature", 140, finalY);

        doc.save(`${selectedPatient.name.replace(/\s+/g, '_')}_Record.pdf`);
        toast.success("Medical Record Downloaded");

    } catch (error) {
        console.error("PDF Error:", error);
        alert("Failed to download PDF. Please check console.");
    }
  };

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
            name: selectedPatient.name, // Ensure name is sent for matching
            patientId: selectedPatient.patientId, 
            pregnancyWeeks: selectedPatient.pregnancyWeeks, // Pass existing weeks
            isSelfReport: false // Marks as OFFICIAL CLINIC DATA
        });
        toast.success("Clinic Visit Recorded");
        setClinicInput({ bp: "", weight: "", temp: "", notes: "" });
        setShowClinicForm(false);
        fetchPatients(); 
    } catch (err) {
        console.error(err);
        toast.error("Failed to save visit");
    }
  };

  const handleFinishAppointment = async () => {
     if(!confirm("Mark this appointment as completed?")) return;
     try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/patients/${selectedPatient._id}/feedback`, {
            nextCheckup: null 
        });
        const updatedPatient = {...selectedPatient, nextCheckup: null};
        setSelectedPatient(updatedPatient);
        setPatients(patients.map(p => p._id === selectedPatient._id ? updatedPatient : p));
        toast.success("Appointment Marked Completed!");
     } catch (err) { toast.error("Error updating record"); }
  };

  const addAppointment = () => {
    if (!appointDate || !appointTime) {
      toast.error("Please pick a Date and Time first");
      return;
    }
    const dateStr = new Date(appointDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const timeStr = new Date(`2000-01-01T${appointTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    
    const appointmentMsg = `APPOINTMENT CONFIRMED: Please visit the center on ${dateStr} at ${timeStr}.`;
    setFeedback(prev => prev ? `${prev}\n\n${appointmentMsg}` : appointmentMsg);
    toast.success("Appointment added to message!");
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if(!feedback) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/patients/${selectedPatient._id}/feedback`, {
        feedback: feedback,
        nextCheckup: appointDate 
      });
      const updatedPatient = { ...selectedPatient, adminFeedback: feedback, nextCheckup: appointDate || selectedPatient.nextCheckup };
      setSelectedPatient(updatedPatient);
      setPatients(patients.map(p => p._id === selectedPatient._id ? updatedPatient : p));
      toast.success(`Message & Schedule Sent!`);
      setFeedback(""); 
      setAppointDate(""); 
      setAppointTime("");
    } catch (error) { toast.error("Failed to save message"); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("CONFIRM: Delete this record?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/patients/${id}`);
      fetchPatients();
      toast.success("Record removed.");
    } catch (error) { toast.error("Error deleting"); }
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.patientId && patient.patientId.includes(searchTerm))
  );

  return (
    <div className="max-w-7xl mx-auto relative">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight uppercase">Maternal Health Registry</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Master List • LGU Iligan</p>
        </div>
        <Link to="/create" className="btn bg-blue-600 hover:bg-blue-700 border-none text-white gap-2 rounded-xl shadow-lg shadow-blue-200 font-bold uppercase text-xs tracking-wider">
          <FolderPlus className="w-4 h-4" /> Enroll Patient
        </Link>
      </div>

      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 mb-6 relative">
          <Search className="absolute left-6 top-6 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search by Name or ID..." className="input input-bordered pl-12 w-full border-gray-200 bg-gray-50 focus:bg-white rounded-xl font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-5 pl-8 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Mother's Name</th>
                <th className="py-5 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Pregnancy Stage</th> 
                <th className="py-5 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="py-5 pr-8 text-xs font-extrabold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-50/80 border-b border-gray-100 last:border-none">
                  <td className="pl-8 py-6">
                    <div className="font-bold text-gray-800 text-lg">{patient.name}</div>
                    <div className="flex items-center gap-1 mt-1">
                        <Hash className="w-3 h-3 text-blue-400"/>
                        <span className="text-xs font-mono font-bold text-blue-500">{patient.patientId || "No ID"}</span>
                    </div>
                    {patient.adminFeedback && (
                      <div className="flex items-center gap-1 mt-1 text-green-600">
                         <MessageSquare className="w-3 h-3" />
                         <span className="text-[10px] font-bold uppercase">Feedback Sent</span>
                      </div>
                    )}
                  </td>
                  <td className="py-6">
                    <div className="badge badge-lg bg-pink-50 text-pink-600 border-pink-100 font-black">
                      {calculateWeeks(patient.pregnancyWeeks, patient.createdAt)} Weeks
                    </div>
                  </td>
                  <td className="py-6">
                     <span className={`badge border-none font-bold text-[10px] uppercase p-3 ${patient.status === 'For Referral' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {patient.status}
                     </span>
                  </td>
                  <td className="pr-8 py-6 text-right">
                    <button onClick={() => handleViewPatient(patient)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white inline-flex items-center justify-center transition-colors shadow-sm border border-blue-100 mr-2">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(patient._id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white inline-flex items-center justify-center transition-colors shadow-sm border border-red-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-blue-600 p-6 flex justify-between items-center text-white shrink-0">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">{selectedPatient.name}</h2>
                <div className="flex items-center gap-3 mt-2">
                    <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20">
                        <p className="text-[10px] uppercase font-bold text-blue-100 tracking-widest">Patient ID</p>
                        <p className="font-mono text-lg font-bold tracking-widest">{selectedPatient.patientId || "N/A"}</p>
                    </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={generatePDF} className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors text-white" title="Download Medical Record">
                    <Download className="w-5 h-5" />
                </button>
                <button onClick={() => setSelectedPatient(null)} className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              
              {/* --- NEW: CLINIC VISIT ENTRY FORM --- */}
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

              <div className="bg-blue-50 border-2 border-blue-100 p-5 rounded-2xl mb-8 shadow-sm">
                <h3 className="text-sm font-black text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Appointment Manager
                </h3>

                {selectedPatient.nextCheckup ? (
                   <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                          <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Scheduled Date</p>
                              <p className="text-xl font-black text-blue-600">
                                {new Date(selectedPatient.nextCheckup).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                              </p>
                              <p className="text-xs font-bold text-gray-500 mt-1">
                                {new Date(selectedPatient.nextCheckup).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                              </p>
                          </div>
                          <div className="bg-blue-100 p-3 rounded-full">
                            <Calendar className="w-8 h-8 text-blue-600" />
                          </div>
                      </div>
                      
                      <button onClick={handleFinishAppointment} className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold uppercase text-xs tracking-widest shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95">
                          <CheckCircle className="w-5 h-5"/> Mark as Completed
                      </button>
                   </div>
                ) : (
                   <div className="bg-white p-4 rounded-xl border border-blue-200">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-2">Set New Schedule</p>
                      
                      <div className="flex gap-2 mb-3">
                        <input 
                          type="date" 
                          style={{ colorScheme: "light" }} 
                          className="input input-sm w-full bg-gray-50 border-gray-200 text-gray-900 font-bold focus:bg-white" 
                          value={appointDate} 
                          onChange={e => setAppointDate(e.target.value)} 
                        />
                        <input 
                          type="time" 
                          style={{ colorScheme: "light" }} 
                          className="input input-sm w-full bg-gray-50 border-gray-200 text-gray-900 font-bold focus:bg-white" 
                          value={appointTime} 
                          onChange={e => setAppointTime(e.target.value)} 
                        />
                      </div>
                      
                      <button type="button" onClick={addAppointment} className="btn btn-sm w-full bg-blue-100 text-blue-700 border-none hover:bg-blue-200 font-bold uppercase text-[10px]">
                         + Add Date to Message Box
                      </button>
                   </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Message to Mother</p>
                  <form onSubmit={handleSendFeedback} className="space-y-3">
                    <textarea required placeholder="Type message here..." className="textarea w-full h-24 rounded-xl bg-white border-2 border-gray-100 focus:border-blue-500 text-gray-800 font-medium p-3 leading-relaxed" value={feedback} onChange={(e) => setFeedback(e.target.value)}></textarea>
                    <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> Save & Send SMS
                    </button>
                  </form>
                </div>
              </div>

              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Patient History</h3>
              <div className="space-y-3">
                {patientHistory.map((log) => (
                  <div key={log._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center hover:bg-white hover:shadow-sm transition-all">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-3 h-3 text-gray-400"/>
                          <p className="text-xs font-bold text-gray-700">{new Date(log.createdAt).toLocaleString()}</p>
                       </div>
                       <p className="text-[10px] text-gray-500 italic">"{log.notes || "No notes provided"}"</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-800 text-lg">{log.bloodPressure}</p>
                      {log.isSelfReport && <span className="text-[9px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-bold uppercase">Self-Report</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PatientsPage;
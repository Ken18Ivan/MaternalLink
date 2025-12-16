import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderPlus, Trash2, Search, Eye, X, Send, Calendar, MessageSquare, Hash, Clock, Download, PlusCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// --- VALIDATION HELPER ---
const validateVitals = (bp, temp, weight, heartRate) => {
    const errors = [];
    const bpRegex = /^\d{2,3}\/\d{2,3}$/;
    if (!bpRegex.test(bp)) errors.push("BP must be format '120/80'");
    
    const tempNum = parseFloat(temp);
    if (isNaN(tempNum) || tempNum < 30 || tempNum > 45) errors.push("Temperature invalid (30-45°C)");
    
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum < 30 || weightNum > 300) errors.push("Weight invalid (30-300kg)");

    const hrNum = parseFloat(heartRate);
    if (isNaN(hrNum) || hrNum < 30 || hrNum > 200) errors.push("Heart Rate invalid");
    
    return errors;
};

const PatientsPage = () => {
  const [patients, setPatients] = useState([]); 
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [feedback, setFeedback] = useState(""); 
  
  const [appointDate, setAppointDate] = useState("");
  const [appointTime, setAppointTime] = useState("");

  // FIXED: Added 'heartRate' to state
  const [clinicInput, setClinicInput] = useState({ bp: "", weight: "", temp: "", heartRate: "", notes: "" });
  const [showClinicForm, setShowClinicForm] = useState(false);

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients`);
      const data = response.data;
      
      const sortedData = data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllLogs(sortedData);

      const logCounts = {};
      sortedData.forEach(log => {
          const key = log.patientId || log.name;
          logCounts[key] = (logCounts[key] || 0) + 1;
      });

      const uniqueMap = new Map();
      sortedData.forEach(item => {
        const key = item.patientId || item.name; 
        if(!uniqueMap.has(key)) {
          uniqueMap.set(key, {
            ...item,
            totalLogs: logCounts[key] 
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

  const generatePDF = () => {
    try {
        const doc = new jsPDF();
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("Maternal Health Record", 105, 15, null, null, "center");
        doc.setFontSize(10);
        doc.text("LGU Iligan City • Official Medical Document", 105, 25, null, null, "center");

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Patient Name: ${selectedPatient.name}`, 14, 50);
        doc.text(`Patient ID: ${selectedPatient.patientId}`, 14, 58);
        doc.text(`Pregnancy Weeks: ${selectedPatient.pregnancyWeeks}`, 14, 66);
        doc.text(`Status: ${selectedPatient.status}`, 14, 74);

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

        doc.save(`${selectedPatient.name}_Record.pdf`);
        toast.success("Downloaded");
    } catch (error) {
        alert("PDF Error. Check console.");
    }
  };

  // --- HANDLE CLINIC SUBMIT (FIXED) ---
  const handleClinicSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation
    const errors = validateVitals(clinicInput.bp, clinicInput.temp, clinicInput.weight, clinicInput.heartRate);
    if(errors.length > 0) {
        errors.forEach(err => toast.error(err));
        return;
    }

    // 2. Prepare Payload (Mapping fields correctly)
    const payload = {
        name: selectedPatient.name, 
        patientId: selectedPatient.patientId, 
        pregnancyWeeks: selectedPatient.pregnancyWeeks,
        isSelfReport: false,
        // Mapping Inputs to Backend Field Names
        bloodPressure: clinicInput.bp,
        temperature: clinicInput.temp,
        weight: clinicInput.weight,
        heartRate: clinicInput.heartRate, // Backend requires this!
        notes: clinicInput.notes
    };

    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/patients`, payload);
        toast.success("Clinic Visit Recorded");
        setClinicInput({ bp: "", weight: "", temp: "", heartRate: "", notes: "" });
        setShowClinicForm(false);
        fetchPatients(); 
    } catch (err) {
        console.error(err);
        toast.error("Failed to save visit: " + (err.response?.data?.message || err.message));
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
        toast.success("Completed!");
     } catch (err) { toast.error("Error updating"); }
  };

  const addAppointment = () => {
    if (!appointDate || !appointTime) return toast.error("Pick Date & Time");
    const dateStr = new Date(appointDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const timeStr = new Date(`2000-01-01T${appointTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    setFeedback(prev => prev ? `${prev}\n\nAppt: ${dateStr} @ ${timeStr}` : `APPOINTMENT: ${dateStr} @ ${timeStr}`);
    toast.success("Added to message box");
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
      toast.success(`Sent!`);
      setFeedback(""); 
    } catch (error) { toast.error("Failed"); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete record?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/patients/${id}`);
      fetchPatients();
      toast.success("Deleted");
    } catch (error) { toast.error("Error deleting"); }
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.patientId && patient.patientId.includes(searchTerm))
  );

  return (
    <div className="max-w-7xl mx-auto relative pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 uppercase">Maternal Health Registry</h1>
          <p className="text-xs font-bold text-gray-400 uppercase mt-2">LGU Iligan City</p>
        </div>
        <Link to="/create" className="btn bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl font-bold uppercase text-xs">
          <FolderPlus className="w-4 h-4" /> Enroll Patient
        </Link>
      </div>

      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 mb-6 relative">
          <Search className="absolute left-6 top-6 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search..." className="input input-bordered pl-12 w-full border-gray-200 bg-gray-50 focus:bg-white rounded-xl font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400 font-bold animate-pulse">Loading Records...</div>
      ) : (
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="table w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="py-5 pl-8 text-xs font-extrabold text-gray-400 uppercase">Name</th>
                    <th className="py-5 text-xs font-extrabold text-gray-400 uppercase">Stage</th> 
                    <th className="py-5 text-xs font-extrabold text-gray-400 uppercase">Status</th>
                    <th className="py-5 pr-8 text-xs font-extrabold text-gray-400 uppercase text-right">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredPatients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-none">
                    <td className="pl-8 py-6">
                        <div className="font-bold text-gray-800 text-lg">{patient.name}</div>
                        <div className="flex items-center gap-1 mt-1">
                            <Hash className="w-3 h-3 text-blue-400"/>
                            <span className="text-xs font-mono font-bold text-blue-500">{patient.patientId}</span>
                        </div>
                        {patient.adminFeedback && (
                        <div className="flex items-center gap-1 mt-1 text-green-600"><MessageSquare className="w-3 h-3"/><span className="text-[10px] font-bold uppercase">Msg Sent</span></div>
                        )}
                    </td>
                    <td className="py-6">
                        <div className="badge badge-lg bg-pink-50 text-pink-600 border-pink-100 font-black">{patient.pregnancyWeeks} Weeks</div>
                    </td>
                    <td className="py-6">
                        <span className={`badge border-none font-bold text-[10px] uppercase p-3 ${patient.status === 'For Referral' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{patient.status}</span>
                    </td>
                    <td className="pr-8 py-6 text-right">
                        <button onClick={() => handleViewPatient(patient)} className="btn btn-sm bg-blue-50 text-blue-600 border-none mr-2"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(patient._id)} className="btn btn-sm bg-red-50 text-red-600 border-none"><Trash2 className="w-4 h-4" /></button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
      )}

      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-blue-600 p-6 flex justify-between items-center text-white shrink-0">
              <div>
                <h2 className="text-xl font-black uppercase">{selectedPatient.name}</h2>
                <p className="font-mono text-sm opacity-80">{selectedPatient.patientId}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={generatePDF} className="bg-white/20 p-2 rounded-full hover:bg-white/30"><Download className="w-5 h-5" /></button>
                <button onClick={() => setSelectedPatient(null)} className="bg-white/20 p-2 rounded-full hover:bg-white/30"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              
              {/* --- FIXED CLINIC VISIT FORM --- */}
              <div className="mb-6">
                  {!showClinicForm ? (
                    <button onClick={() => setShowClinicForm(true)} className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors">
                        <PlusCircle className="w-4 h-4"/> Add Clinic Visit Data
                    </button>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-in fade-in zoom-in">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-gray-700">New Clinic Visit</h3>
                            <button onClick={() => setShowClinicForm(false)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4"/></button>
                        </div>
                        <form onSubmit={handleClinicSubmit} className="space-y-3">
                            <input 
                                placeholder="BP (120/80)" 
                                value={clinicInput.bp} 
                                onChange={e=>setClinicInput({...clinicInput, bp: e.target.value})} 
                                className="input input-sm w-full input-bordered bg-white text-gray-900 border-gray-300 placeholder:text-gray-400 font-bold"
                            />
                            <div className="flex gap-2">
                                <input 
                                    placeholder="Weight (kg)" 
                                    value={clinicInput.weight} 
                                    onChange={e=>setClinicInput({...clinicInput, weight: e.target.value})} 
                                    className="input input-sm w-full input-bordered bg-white text-gray-900 border-gray-300 placeholder:text-gray-400 font-bold"
                                />
                                <input 
                                    placeholder="Temp (°C)" 
                                    value={clinicInput.temp} 
                                    onChange={e=>setClinicInput({...clinicInput, temp: e.target.value})} 
                                    className="input input-sm w-full input-bordered bg-white text-gray-900 border-gray-300 placeholder:text-gray-400 font-bold"
                                />
                            </div>
                            
                            {/* ADDED: Heart Rate Input */}
                            <input 
                                placeholder="Heart Rate (bpm)" 
                                value={clinicInput.heartRate} 
                                onChange={e=>setClinicInput({...clinicInput, heartRate: e.target.value})} 
                                className="input input-sm w-full input-bordered bg-white text-gray-900 border-gray-300 placeholder:text-gray-400 font-bold"
                            />

                            <input 
                                placeholder="Midwife Notes" 
                                value={clinicInput.notes} 
                                onChange={e=>setClinicInput({...clinicInput, notes: e.target.value})} 
                                className="input input-sm w-full input-bordered bg-white text-gray-900 border-gray-300 placeholder:text-gray-400"
                            />
                            <button type="submit" className="btn btn-sm btn-neutral w-full">Save Record</button>
                        </form>
                    </div>
                  )}
              </div>

              {/* ... APPOINTMENT SECTION & HISTORY SECTION REMAIN SAME ... */}
              <div className="bg-blue-50 border-2 border-blue-100 p-5 rounded-2xl mb-8">
                <h3 className="text-sm font-black text-blue-800 uppercase mb-4 flex gap-2"><Calendar className="w-5 h-5" /> Appointment</h3>
                {selectedPatient.nextCheckup ? (
                   <div className="bg-white p-4 rounded-xl border border-blue-200">
                      <p className="text-xl font-black text-blue-600">{new Date(selectedPatient.nextCheckup).toLocaleDateString()}</p>
                      <button onClick={handleFinishAppointment} className="w-full mt-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-xs transition-colors">Mark Completed</button>
                   </div>
                ) : (
                   <div className="bg-white p-4 rounded-xl border border-blue-200 space-y-3">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-700 pointer-events-none" />
                        <input 
                            type="date" 
                            className="input input-sm w-full pl-10 bg-white border-gray-300 text-gray-900 font-bold focus:border-blue-500 rounded-lg h-10" 
                            value={appointDate} 
                            onChange={e => setAppointDate(e.target.value)} 
                        />
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-700 pointer-events-none" />
                        <input 
                            type="time" 
                            className="input input-sm w-full pl-10 bg-white border-gray-300 text-gray-900 font-bold focus:border-blue-500 rounded-lg h-10" 
                            value={appointTime} 
                            onChange={e => setAppointTime(e.target.value)} 
                        />
                      </div>
                      <button onClick={addAppointment} className="btn btn-sm w-full bg-blue-100 hover:bg-blue-200 text-blue-700 border-none font-bold uppercase text-[10px] tracking-wide h-10">+ Add to Msg</button>
                   </div>
                )}
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Message</p>
                  <form onSubmit={handleSendFeedback} className="space-y-2">
                    <textarea required placeholder="Message..." className="textarea w-full h-20 rounded-xl bg-white border-gray-300 text-black font-medium focus:border-blue-500" value={feedback} onChange={(e) => setFeedback(e.target.value)}></textarea>
                    <button className="btn btn-sm w-full bg-blue-600 hover:bg-blue-700 text-white h-10"><Send className="w-4 h-4" /> Send SMS</button>
                  </form>
                </div>
              </div>

              <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">History</h3>
              <div className="space-y-3">
                {patientHistory.map((log) => (
                  <div key={log._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center hover:bg-gray-100 transition-colors">
                    <div>
                        <p className="text-xs font-bold text-gray-700">{new Date(log.createdAt).toLocaleString()}</p>
                        <p className="text-[10px] text-gray-500">"{log.notes || "-"}"</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-800 text-lg">{log.bloodPressure}</p>
                      {log.isSelfReport && <span className="text-[9px] bg-pink-100 text-pink-600 px-2 rounded-full font-bold uppercase">Self-Report</span>}
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
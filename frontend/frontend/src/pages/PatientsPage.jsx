import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderPlus, Trash2, Search, Printer, Download, Eye, FileText } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/patients");
      setPatients(response.data);
      setLoading(false);
    } catch (error) { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("CONFIRM DELETION: This action will be logged.")) return;
    try {
      await axios.delete(`http://localhost:5001/api/patients/${id}`);
      setPatients(patients.filter(p => p._id !== id)); 
      toast.success("Record removed.");
    } catch (error) { toast.error("Error deleting"); }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" ? true : filter === "Critical" ? patient.status === "For Referral" : patient.status === "Normal";
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight uppercase">Maternal Health Registry</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Master List • Region X</p>
        </div>
        <div className="flex gap-3">
          <button className="btn bg-white border border-gray-300 gap-2 rounded-xl shadow-sm"><Printer className="w-4 h-4"/><span className="text-xs font-bold uppercase">Print</span></button>
          <Link to="/create" className="btn btn-primary text-white gap-2 rounded-xl shadow-lg"><FolderPlus className="w-4 h-4"/><span className="text-xs font-bold uppercase">New Record</span></Link>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search Registry..." className="input input-bordered pl-12 w-full border-transparent bg-transparent focus:bg-gray-50 rounded-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {["All", "Normal", "Critical"].map((type) => (
            <button key={type} onClick={() => setFilter(type)} className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${filter === type ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>{type === "Critical" ? "Referrals" : type}</button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-5 pl-8 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Identity</th>
                <th className="py-5 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Latest Vitals</th>
                <th className="py-5 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="py-5 pr-8 text-xs font-extrabold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-50/80 border-b border-gray-100 last:border-none">
                  <td className="pl-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{patient.name.charAt(0)}</div>
                      <div>
                        <div className="font-bold text-gray-800">{patient.name}</div>
                        <div className="text-[10px] font-mono text-gray-400 uppercase">ID: {patient._id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex gap-4 text-xs">
                       <div className="flex flex-col"><span className="text-gray-400 font-bold uppercase text-[10px]">BP</span><span className="font-bold text-gray-700">{patient.bloodPressure}</span></div>
                       <div className="flex flex-col"><span className="text-gray-400 font-bold uppercase text-[10px]">HR</span><span className="font-bold text-gray-700">{patient.heartRate}</span></div>
                       <div className="flex flex-col"><span className="text-gray-400 font-bold uppercase text-[10px]">Temp</span><span className={`font-bold ${patient.temperature >= 38.5 ? 'text-red-500' : 'text-gray-700'}`}>{patient.temperature}°C</span></div>
                    </div>
                  </td>
                  <td className="py-6">
                    {patient.status === 'For Referral' ? 
                      <div className="badge bg-red-50 text-red-600 border-red-200 p-3 font-bold text-[10px] uppercase">Referral</div> : 
                      <div className="badge bg-green-50 text-green-600 border-green-200 p-3 font-bold text-[10px] uppercase">Normal</div>
                    }
                  </td>
                  <td className="pr-8 py-6 text-right">
                     <button onClick={() => handleDelete(patient._id)} className="btn btn-sm btn-square btn-ghost text-gray-300 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default PatientsPage;
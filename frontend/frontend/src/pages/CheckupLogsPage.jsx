import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Calendar, Filter, Printer, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";

const CheckupLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]); // Default to Today

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    // FILTER LOGIC
    let results = logs;

    // 1. Filter by Search (Name or ID)
    if (searchTerm) {
      results = results.filter(log => 
        log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.patientId && log.patientId.includes(searchTerm))
      );
    }

    // 2. Filter by Date (Compare YYYY-MM-DD)
    if (filterDate) {
      results = results.filter(log => 
        new Date(log.createdAt).toISOString().split('T')[0] === filterDate
      );
    }

    setFilteredLogs(results);
  }, [searchTerm, filterDate, logs]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients`);
      // Sort newest first
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLogs(sorted);
      setFilteredLogs(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const printReport = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Daily Checkup Log", 14, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${filterDate || "All Records"}`, 160, 20);

    // Table
    const tableColumn = ["Time", "Patient Name", "ID", "BP", "Status", "Source"];
    const tableRows = [];

    filteredLogs.forEach(log => {
      const row = [
        new Date(log.createdAt).toLocaleTimeString(),
        log.name,
        log.patientId,
        log.bloodPressure,
        log.status,
        log.isSelfReport ? "App Input" : "Clinic"
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save(`CheckupLog_${filterDate}.pdf`);
    toast.success("Log Report Generated");
  };

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight uppercase">Checkup Logs</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Audit Trail & History</p>
        </div>
        <button onClick={printReport} className="btn bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 gap-2 rounded-xl font-bold uppercase text-xs shadow-sm">
          <Printer className="w-4 h-4" /> Print Report
        </button>
      </div>

      {/* CONTROLS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
           <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search Patient..." 
             className="input input-bordered w-full pl-10 bg-gray-50 focus:bg-white border-gray-200 rounded-xl text-sm font-bold"
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
        </div>

        {/* Date Filter */}
        <div className="relative w-full md:w-auto">
            <div className="absolute left-3 top-3.5 pointer-events-none">
                <Calendar className="w-4 h-4 text-gray-500" />
            </div>
            <input 
              type="date" 
              style={{ colorScheme: "light" }} 
              className="input input-bordered pl-10 bg-gray-50 focus:bg-white border-gray-200 rounded-xl text-sm font-bold w-full"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
        </div>
        
        {/* Clear Filter */}
        <button onClick={() => setFilterDate("")} className="btn btn-ghost btn-sm text-xs font-bold text-gray-400">
            Show All
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-4 pl-6 text-xs font-extrabold uppercase tracking-widest">Date & Time</th>
                <th className="py-4 text-xs font-extrabold uppercase tracking-widest">Patient Details</th>
                <th className="py-4 text-xs font-extrabold uppercase tracking-widest">Vitals</th>
                <th className="py-4 text-xs font-extrabold uppercase tracking-widest">Source</th>
                <th className="py-4 pr-6 text-xs font-extrabold uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                 <tr><td colSpan="5" className="text-center py-10 text-gray-400 font-bold uppercase text-xs">No logs found for this date</td></tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-none">
                    <td className="pl-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className="bg-blue-50 p-2 rounded-lg"><Calendar className="w-4 h-4 text-blue-500"/></div>
                          <div>
                              <p className="text-xs font-bold text-gray-800">{new Date(log.createdAt).toLocaleDateString()}</p>
                              <p className="text-[10px] font-mono text-gray-400">{new Date(log.createdAt).toLocaleTimeString()}</p>
                          </div>
                       </div>
                    </td>
                    <td className="py-4">
                       <p className="font-bold text-gray-800">{log.name}</p>
                       <p className="text-[10px] font-mono text-blue-500 font-bold">{log.patientId}</p>
                    </td>
                    <td className="py-4">
                       <div className="flex gap-2">
                          <span className="badge badge-sm bg-gray-100 border-none font-bold text-[10px] text-gray-600">BP: {log.bloodPressure}</span>
                          <span className="badge badge-sm bg-gray-100 border-none font-bold text-[10px] text-gray-600">{log.weight} kg</span>
                       </div>
                    </td>
                    <td className="py-4">
                       {log.isSelfReport ? (
                          <span className="flex items-center gap-1 text-[10px] font-black text-pink-500 uppercase"><FileText className="w-3 h-3"/> App Input</span>
                       ) : (
                          <span className="flex items-center gap-1 text-[10px] font-black text-blue-500 uppercase"><FileText className="w-3 h-3"/> Clinic Visit</span>
                       )}
                    </td>
                    <td className="pr-6 py-4 text-right">
                        <span className={`badge border-none font-bold text-[10px] uppercase p-2 ${log.status === 'For Referral' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {log.status}
                        </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default CheckupLogsPage;
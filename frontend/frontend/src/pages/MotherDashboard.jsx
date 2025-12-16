import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Phone, Calendar, Activity, User, AlertTriangle, MessageSquare, X, Trash, TrendingUp } from "lucide-react";
import { toast } from "react-hot-toast";

// --- YOUR NEW COMPONENTS (These make the graph/info board look better) ---
import MothersInfoBoard from "../components/MothersInfoBoard";
import VitalSignGraph from "../components/VitalSignGraph";

const MotherDashboard = () => {
  const { user } = useAuth();

  // --- 1. YOUR ORIGINAL DATA LOGIC (UNTOUCHED) ---
  const [latestVitals, setLatestVitals] = useState(null);
  const [pregnancyWeeks, setPregnancyWeeks] = useState("Unknown");
  const [realName, setRealName] = useState("Mommy");
  const [graphData, setGraphData] = useState([]);
  const [allMessages, setAllMessages] = useState([]); 
  const [latestMessage, setLatestMessage] = useState(""); 
  const [showInbox, setShowInbox] = useState(false); 
  const [checkupDate, setCheckupDate] = useState(null); 
  const [messageRecordId, setMessageRecordId] = useState(null);

  // --- 2. THE REAL-TIME FIX (Added Auto-Refresh) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients`);
        
        // Sorting logic preserved
        const myRecords = res.data
          .filter(record => record.patientId === user.name) 
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (myRecords.length > 0) {
          setLatestVitals(myRecords[0]); 
          setRealName(myRecords[0].name);
          
          // Logic for weeks, messages, and schedule preserved
          const recordWithWeeks = myRecords.find(r => r.pregnancyWeeks && r.pregnancyWeeks > 0);
          if (recordWithWeeks) setPregnancyWeeks(recordWithWeeks.pregnancyWeeks);

          const msgs = myRecords.filter(r => r.adminFeedback && r.adminFeedback !== "");
          setAllMessages(msgs);
          if (msgs.length > 0) {
            setLatestMessage(msgs[0].adminFeedback);
            setMessageRecordId(msgs[0]._id); 
          }

          const recordWithDate = myRecords.find(r => r.nextCheckup);
          if (recordWithDate) setCheckupDate(new Date(recordWithDate.nextCheckup));

          // Formatting data for the NEW Clear Graph
          const formattedGraph = myRecords.slice(0, 5).reverse().map(r => {
                const parts = r.bloodPressure ? r.bloodPressure.split('/') : ['0','0'];
                return {
                    date: new Date(r.createdAt).toLocaleDateString('en-US', {month:'short', day:'numeric'}),
                    systolic: parseInt(parts[0]),
                    diastolic: parseInt(parts[1]),
                };
            });
          setGraphData(formattedGraph);
        }
      } catch (err) { console.error("Fetch Error:", err); }
    };

    if (user?.name) {
      fetchData(); 
      // Auto-refresh every 5 seconds so you see updates instantly during demo
      const interval = setInterval(() => fetchData(), 5000); 
      return () => clearInterval(interval);
    }
  }, [user.name, showInbox]); 

  // --- 3. YOUR HELPERS (UNTOUCHED) ---
  const isHighRisk = (vitals) => {
    if (!vitals || !vitals.bloodPressure) return false;
    const [systolic, diastolic] = vitals.bloodPressure.split('/').map(Number);
    return systolic >= 130 || diastolic >= 85 || vitals.heartRate > 100;
  };

  const handleEmergency = () => {
    window.location.href = "tel:09123456789"; 
    toast.custom((t) => (
      <div className="bg-red-600 text-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 max-w-md mx-auto animate-bounce">
        <AlertTriangle className="w-10 h-10 text-yellow-300" />
        <div><h1 className="font-black text-xl uppercase">Emergency Alert Sent!</h1></div>
      </div>
    ), { duration: 5000 });
  };

  const handleClearInbox = async () => {
    if(!confirm("Clear inbox?")) return;
    try {
        if (messageRecordId) {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/patients/${messageRecordId}/feedback`, { feedback: "" });
            setAllMessages([]);
            setLatestMessage("");
            toast.success("Inbox Cleared");
            setShowInbox(false);
        }
    } catch(e) { toast.error("Failed to clear"); }
  };

  return (
    // NOTE: Removed <MotherLayout> wrapper here because it's already in App.jsx. 
    // This fixes the "Double Footer" bug.
    <div className="pb-24 bg-gray-50 min-h-screen">
      
      {/* --- 4. YOUR EXACT HEADER UI (Gradient, Rounded Corners Preserved) --- */}
      <div className={`pb-24 pt-12 px-8 rounded-b-[3rem] shadow-xl text-white relative transition-colors duration-500 ${latestVitals && isHighRisk(latestVitals) ? 'bg-red-600' : 'bg-gradient-to-b from-pink-500 to-rose-600'}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/30"><User className="w-8 h-8 text-white" /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Welcome Mommy</p>
            <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-sm capitalize">{realName}</h1>
            <p className="text-[10px] text-pink-200 font-mono mt-1">ID: {user?.name}</p>
          </div>
        </div>

        {/* Message Banner Logic Preserved */}
        {latestMessage && !isHighRisk(latestVitals) && (
           <div onClick={() => setShowInbox(true)} className="cursor-pointer bg-blue-900/40 backdrop-blur-md border border-blue-200/30 p-4 rounded-xl flex gap-3 mb-4 shadow-sm">
             <div className="bg-white/20 p-2 rounded-full h-fit"><MessageSquare className="w-4 h-4 text-white" /></div>
             <div>
               <p className="font-bold text-[10px] uppercase text-blue-100 tracking-wider mb-1">New Message</p>
               <p className="text-sm font-medium text-white italic line-clamp-1">"{latestMessage}"</p>
             </div>
           </div>
        )}

        <div className="flex justify-between items-end border-t border-white/20 pt-4">
          <div><p className="text-4xl font-black text-white">{pregnancyWeeks}</p><p className="text-[10px] uppercase">Weeks</p></div>
          <div className="text-right"><span className="text-sm font-bold text-white uppercase">{checkupDate ? checkupDate.toLocaleDateString() : "No Sched"}</span><p className="text-[10px] uppercase">Next Checkup</p></div>
        </div>
      </div>

      {/* --- 5. MAIN CONTENT (Padding & Layout Preserved) --- */}
      <div className="px-6 -mt-16 relative z-10 space-y-6">
        
        {/* Vitals Card UI Preserved */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200 border border-gray-100">
          <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2"><Activity className="w-5 h-5 text-rose-500" /><h3 className="font-extrabold text-gray-800 uppercase text-sm">Latest Vitals</h3></div>
            {latestVitals && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-bold">{new Date(latestVitals.createdAt).toLocaleDateString()}</span>}
          </div>
          {latestVitals ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl text-center border bg-rose-50 border-rose-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">BP</p>
                <p className="text-2xl font-black text-gray-800">{latestVitals.bloodPressure}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Weight</p>
                <p className="text-2xl font-black text-gray-800">{latestVitals.weight} kg</p>
              </div>
            </div>
          ) : (<div className="text-center py-4 text-gray-400">Waiting for data...</div>)}
        </div>

        {/* --- 6. NEW FEATURE: Info Board (Added below Vitals) --- */}
        <MothersInfoBoard />

        {/* --- 7. NEW FEATURE: Clear Graph (Replaced unclear weight chart) --- */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-5 pb-0 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-purple-500" /><h3 className="font-bold text-gray-800 uppercase text-xs tracking-widest">BP History</h3></div>
           <VitalSignGraph data={graphData} />
        </div>

        {/* --- 8. EMERGENCY BUTTON (Bounce Animation Preserved) --- */}
        <div className="pb-6">
          <button onClick={handleEmergency} className="w-full bg-red-500 text-white p-4 h-24 rounded-[2rem] shadow-lg flex items-center justify-center gap-4 active:scale-95 transition-all">
            <div className="bg-white/20 p-3 rounded-full animate-pulse"><Phone className="w-6 h-6 text-white" /></div>
            <div className="text-left"><span className="font-black uppercase text-lg block">Emergency Call</span></div>
          </button>
        </div>
      </div>

      {/* --- 9. INBOX MODAL (Logic Preserved) --- */}
      {showInbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
           <div className="bg-white w-full max-w-md rounded-[2rem] h-[80vh] flex flex-col shadow-2xl">
             <div className="bg-blue-600 p-6 flex justify-between items-center text-white"><h2 className="text-lg font-black uppercase">Inbox</h2><button onClick={() => setShowInbox(false)}><X className="w-5 h-5" /></button></div>
             <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-gray-50">
                {allMessages.map((msg) => (
                    <div key={msg._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-800 font-medium">"{msg.adminFeedback}"</p>
                    </div>
                ))}
             </div>
             <div className="p-4 bg-white border-t border-gray-200 flex gap-4"><button onClick={handleClearInbox} className="btn flex-1 bg-red-50 text-red-500 rounded-xl font-bold uppercase text-xs">Clear Inbox</button><button onClick={() => setShowInbox(false)} className="btn flex-1 bg-gray-100 text-gray-500 rounded-xl font-bold uppercase text-xs">Close</button></div>
           </div>
        </div>
      )}
    </div>
  );
};
export default MotherDashboard;
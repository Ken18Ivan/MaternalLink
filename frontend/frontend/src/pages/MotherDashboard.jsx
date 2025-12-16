import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Phone, Calendar, Activity, User, Clock, AlertTriangle, MessageSquare, X, Trash, TrendingUp } from "lucide-react";
import { toast } from "react-hot-toast";

const MotherDashboard = () => {
  const { user } = useAuth();
  const [latestVitals, setLatestVitals] = useState(null);
  const [history, setHistory] = useState([]);
  const [pregnancyWeeks, setPregnancyWeeks] = useState("Unknown");
  const [realName, setRealName] = useState("Mommy");
  
  // Graph Data State
  const [graphData, setGraphData] = useState([]);

  // Inbox State
  const [allMessages, setAllMessages] = useState([]); 
  const [latestMessage, setLatestMessage] = useState(""); 
  const [showInbox, setShowInbox] = useState(false); 
  const [checkupDate, setCheckupDate] = useState(null); 
  const [messageRecordId, setMessageRecordId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients`);
        
        const myRecords = res.data
          .filter(record => record.patientId === user.name) 
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (myRecords.length > 0) {
          setLatestVitals(myRecords[0]); 
          setHistory(myRecords.slice(0, 3));
          setRealName(myRecords[0].name);
          
          const recordWithWeeks = myRecords.find(r => r.pregnancyWeeks && r.pregnancyWeeks > 0);
          if (recordWithWeeks) {
            setPregnancyWeeks(recordWithWeeks.pregnancyWeeks);
          }

          // Messages
          const msgs = myRecords.filter(r => r.adminFeedback && r.adminFeedback !== "");
          setAllMessages(msgs);
          if (msgs.length > 0) {
            setLatestMessage(msgs[0].adminFeedback);
            setMessageRecordId(msgs[0]._id); 
          }

          // Schedule
          const recordWithDate = myRecords.find(r => r.nextCheckup);
          if (recordWithDate) {
            setCheckupDate(new Date(recordWithDate.nextCheckup));
          } else {
             setCheckupDate(null); 
          }

          // --- PREPARE GRAPH DATA (Last 5 Weights) ---
          // 1. Filter records that have weight
          // 2. Take top 5
          // 3. Reverse them so oldest is on the left, newest on right
          const weights = myRecords
            .filter(r => r.weight)
            .slice(0, 5)
            .reverse() 
            .map(r => ({
                date: new Date(r.createdAt).toLocaleDateString('en-US', {month:'short', day:'numeric'}),
                value: r.weight
            }));
          setGraphData(weights);
        }
      } catch (err) { console.error(err); }
    };

    if (user?.name) {
      fetchData();
    }
  }, [user.name, showInbox]); 

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
        <div>
          <h1 className="font-black text-xl uppercase">Emergency Alert Sent!</h1>
          <p className="text-sm font-medium">Midwife has been notified of your location.</p>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleClearInbox = async () => {
    if(!confirm("Clear all messages?")) return;
    try {
        if (messageRecordId) {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/patients/${messageRecordId}/feedback`, {
                feedback: "" 
            });
            setAllMessages([]);
            setLatestMessage("");
            toast.success("Inbox Cleared");
            setShowInbox(false);
        }
    } catch(e) { toast.error("Failed to clear"); }
  };

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className={`pb-24 pt-12 px-8 rounded-b-[3rem] shadow-xl text-white relative transition-colors duration-500 ${latestVitals && isHighRisk(latestVitals) ? 'bg-red-600' : 'bg-gradient-to-b from-pink-500 to-rose-600'}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/30"><User className="w-8 h-8 text-white" /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Welcome Mommy</p>
            <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-sm capitalize">{realName}</h1>
            <p className="text-[10px] text-pink-200 font-mono mt-1">ID: {user?.name}</p>
          </div>
        </div>

        {latestVitals && isHighRisk(latestVitals) && (
           <div className="bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-xl flex items-center gap-3 mb-4 animate-pulse">
             <AlertTriangle className="w-6 h-6 text-yellow-300" />
             <div>
               <p className="font-black text-sm uppercase text-white">Action Required</p>
               <p className="text-xs text-white">Your vitals are abnormal. Please visit the center.</p>
             </div>
           </div>
        )}

        {latestMessage && !isHighRisk(latestVitals) && (
           <div onClick={() => setShowInbox(true)} className="cursor-pointer bg-blue-900/40 backdrop-blur-md border border-blue-200/30 p-4 rounded-xl flex gap-3 mb-4 shadow-sm hover:bg-blue-900/60 transition-colors">
             <div className="bg-white/20 p-2 rounded-full h-fit"><MessageSquare className="w-4 h-4 text-white" /></div>
             <div>
               <p className="font-bold text-[10px] uppercase text-blue-100 tracking-wider mb-1">New Message from Midwife</p>
               <p className="text-sm font-medium text-white italic line-clamp-1">"{latestMessage}"</p>
               <p className="text-[9px] text-blue-200 mt-1 uppercase font-bold tracking-widest">Tap to view full inbox</p>
             </div>
           </div>
        )}

        <div className="flex justify-between items-end border-t border-white/20 pt-4">
          <div>
            <p className="text-4xl font-black text-white">{pregnancyWeeks} Weeks</p>
            <p className="text-[10px] opacity-90 font-bold uppercase tracking-widest">Pregnancy Stage</p>
          </div>
          <div className="text-right">
             <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/30 flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white uppercase">
                  {checkupDate ? checkupDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : "No Sched"}
                </span>
             </div>
             <p className="text-[10px] opacity-80 uppercase tracking-widest mr-1">Checkup Sched</p>
          </div>
        </div>
      </div>

      {/* VITALS CARD */}
      <div className="px-6 -mt-16 relative z-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200 border border-gray-100">
          <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className={`w-5 h-5 ${latestVitals && isHighRisk(latestVitals) ? 'text-red-500' : 'text-rose-500'}`} />
              <h3 className="font-extrabold text-gray-800 uppercase text-sm tracking-wider">Latest Vitals</h3>
            </div>
            {latestVitals && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-bold">{new Date(latestVitals.createdAt).toLocaleDateString()}</span>}
          </div>
          
          {latestVitals ? (
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl text-center border ${isHighRisk(latestVitals) ? 'bg-red-50 border-red-200' : 'bg-rose-50 border-rose-100'}`}>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Blood Pressure</p>
                <p className={`text-2xl font-black ${isHighRisk(latestVitals) ? 'text-red-600' : 'text-gray-800'}`}>{latestVitals.bloodPressure}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Weight</p>
                <p className="text-2xl font-black text-gray-800">{latestVitals.weight} kg</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400 text-sm font-medium">No records found.</div>
          )}
        </div>
      </div>

      {/* --- REPLACED BUTTON WITH WEIGHT GRAPH --- */}
      <div className="px-6 mt-6">
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="font-bold text-gray-800 uppercase text-xs tracking-widest">Weight Trend (Last 5)</h3>
          </div>
          
          <div className="flex items-end justify-between h-32 px-2 gap-2">
            {graphData.length > 0 ? graphData.map((data, index) => {
               // Simple math to make bars visualize relative height
               const maxWeight = Math.max(...graphData.map(d => d.value));
               const heightPercent = (data.value / maxWeight) * 100;
               return (
                  <div key={index} className="flex flex-col items-center gap-2 w-full">
                    <div 
                      className="w-full bg-purple-200 rounded-t-lg relative group transition-all hover:bg-purple-300" 
                      style={{ height: `${heightPercent}%` }}
                    >
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                        {data.value}kg
                      </div>
                    </div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">{data.date}</p>
                  </div>
               )
            }) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-bold">
                Not enough data for graph
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EMERGENCY BUTTON (Now Full Width) */}
      <div className="px-6 mt-6 pb-6">
        <button onClick={handleEmergency} className="w-full bg-red-500 hover:bg-red-600 text-white p-4 h-24 rounded-[2rem] shadow-lg shadow-red-500/20 flex flex-row items-center justify-center gap-4 active:scale-95 transition-all border border-red-400">
          <div className="bg-white/20 p-3 rounded-full animate-pulse">
             <Phone className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
             <span className="font-black uppercase text-lg tracking-wider block">Emergency Call</span>
             <span className="text-xs text-red-100">Contact Midwife Immediately</span>
          </div>
        </button>
      </div>

      {/* --- INBOX MODAL --- */}
      {showInbox && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-md rounded-[2rem] h-[80vh] flex flex-col shadow-2xl overflow-hidden">
             <div className="bg-blue-600 p-6 flex justify-between items-center text-white shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full"><MessageSquare className="w-5 h-5"/></div>
                    <div>
                        <h2 className="text-lg font-black uppercase tracking-tight">My Inbox</h2>
                        <p className="text-xs opacity-80 font-mono">Messages from Midwife</p>
                    </div>
                </div>
                <button onClick={() => setShowInbox(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/40"><X className="w-5 h-5" /></button>
             </div>
             <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-gray-50">
                {allMessages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20">
                        <p className="text-sm font-bold uppercase tracking-widest">No messages yet</p>
                    </div>
                ) : (
                    allMessages.map((msg) => (
                        <div key={msg._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Midwife Maria</p>
                                <p className="text-[10px] font-bold text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
                            </div>
                            <p className="text-sm text-gray-800 font-medium leading-relaxed">"{msg.adminFeedback}"</p>
                        </div>
                    ))
                )}
             </div>
             <div className="p-4 bg-white border-t border-gray-200 flex gap-4">
                 <button onClick={handleClearInbox} className="btn flex-1 bg-red-50 text-red-500 hover:bg-red-100 border-none rounded-xl font-bold uppercase text-xs gap-2">
                    <Trash className="w-4 h-4"/> Clear Inbox
                 </button>
                 <button onClick={() => setShowInbox(false)} className="btn flex-1 bg-gray-100 text-gray-500 border-none rounded-xl font-bold uppercase text-xs">Close</button>
             </div>
           </div>
        </div>
      )}

    </div>
  );
};
export default MotherDashboard;
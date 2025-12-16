import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Calendar, Phone, Info, Heart, Apple, AlertTriangle, Baby, Stethoscope } from "lucide-react";
import axios from "axios";
import { calculateWeeks } from "../utils"; // Import helper

const MotherDashboard = () => {
  const [motherData, setMotherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the logged-in mother's data
        // NOTE: Ensure your backend supports /api/patients/me or replace with specific ID for testing
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients/me`); 
        setMotherData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-pink-500 font-bold">Loading...</div>;
  
  // If API fails or no data, show this fallback
  if (!motherData) return <div className="min-h-screen flex items-center justify-center text-gray-400">No Record Found. Please ask Admin to Enroll you.</div>;

  return (
    <div className="min-h-screen bg-pink-50/30 pb-24">
      
      {/* HEADER */}
      <div className="bg-pink-600 p-8 rounded-b-[2.5rem] shadow-xl shadow-pink-200 text-white relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tight mb-1">Hello, Mommy!</h1>
            <p className="text-pink-100 text-xs font-bold uppercase tracking-widest opacity-80">Maternal Health Portal</p>
        </div>
        <Baby className="absolute -right-4 -bottom-8 w-32 h-32 text-pink-500 opacity-20 rotate-12" />
      </div>

      <div className="p-6 max-w-md mx-auto -mt-8 space-y-6 relative z-20">

        {/* STATUS CARD */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-pink-100 flex items-center justify-between">
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pregnancy Stage</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-pink-500">
                        {calculateWeeks(motherData.pregnancyWeeks, motherData.createdAt)}
                    </span>
                    <span className="text-sm font-bold text-gray-600">Weeks</span>
                </div>
            </div>
            <div className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider ${
                motherData.status === 'For Referral' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}>
                {motherData.status}
            </div>
        </div>

        {/* APPOINTMENT CARD */}
        {motherData.nextCheckup ? (
            <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg shadow-blue-200 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Next Checkup</span>
                    </div>
                    <h3 className="text-2xl font-black">
                        {new Date(motherData.nextCheckup).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </h3>
                    <p className="text-blue-100 text-sm mt-2 font-medium">{motherData.adminFeedback || "Please visit the center."}</p>
                </div>
                <Stethoscope className="absolute -right-4 -bottom-4 w-28 h-28 text-blue-500 opacity-20" />
            </div>
        ) : (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-400 text-xs font-bold uppercase">No appointment scheduled</p>
            </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-4">
            <Link to="/mother/input" className="bg-pink-500 hover:bg-pink-600 text-white p-5 rounded-2xl shadow-lg shadow-pink-200 flex flex-col items-center justify-center gap-2 transition-transform active:scale-95">
                <Activity className="w-6 h-6" />
                <span className="font-bold text-sm">Log Vitals</span>
            </Link>

            <a href="tel:911" className="bg-white hover:bg-red-50 text-red-500 border-2 border-red-50 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-transform active:scale-95">
                <Phone className="w-6 h-6" />
                <span className="font-bold text-sm">Emergency</span>
            </a>
        </div>

        {/* MOMMY TIPS BOARD */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100">
            <h3 className="text-lg font-black text-pink-500 flex items-center gap-2 mb-5">
                <Info className="w-5 h-5" /> Mommy Tips
            </h3>
            
            <div className="space-y-4">
                <div className="flex gap-4 items-start bg-green-50 p-4 rounded-2xl">
                    <div className="bg-green-100 p-2 rounded-full text-green-600 shrink-0"><Apple className="w-5 h-5"/></div>
                    <div>
                        <h4 className="font-bold text-green-800 text-sm mb-1">Nutrition</h4>
                        <p className="text-xs text-green-700 leading-relaxed">Eat leafy greens, eggs, and fish. Drink 8-10 glasses of water daily.</p>
                    </div>
                </div>

                <div className="flex gap-4 items-start bg-red-50 p-4 rounded-2xl">
                    <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0"><AlertTriangle className="w-5 h-5"/></div>
                    <div>
                        <h4 className="font-bold text-red-800 text-sm mb-1">Warning Signs</h4>
                        <p className="text-xs text-red-700 leading-relaxed">Go to the clinic immediately if you have: severe headache, blurry vision, or spotting.</p>
                    </div>
                </div>

                <div className="flex gap-4 items-start bg-blue-50 p-4 rounded-2xl">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0"><Heart className="w-5 h-5"/></div>
                    <div>
                        <h4 className="font-bold text-blue-800 text-sm mb-1">Self Care</h4>
                        <p className="text-xs text-blue-700 leading-relaxed">Rest on your left side to improve blood flow to the baby.</p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
export default MotherDashboard;
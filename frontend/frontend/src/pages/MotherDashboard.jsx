import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Activity, 
  Calendar, 
  Phone, 
  Info, 
  Heart, 
  Apple, 
  AlertTriangle, 
  Baby,
  Stethoscope
} from "lucide-react";
import axios from "axios";
import { calculateWeeks } from "../utils"; // Import the helper we made

const MotherDashboard = () => {
  const [motherData, setMotherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH MOTHER'S DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you get ID from localStorage. 
        // For this demo, we assume the backend knows who is logged in via token
        // OR we just fetch the latest patient for demo purposes.
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients/me`);
        setMotherData(res.data);
        setLoading(false);
      } catch (err) {
        // Fallback for demo if no backend auth yet
        console.error("Fetch error", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Show loading skeleton if fetching
  if (loading) return <div className="p-10 text-center text-pink-500 font-bold">Loading your dashboard...</div>;

  // Fallback if no data found
  if (!motherData) return <div className="p-10 text-center text-gray-400">No patient record found.</div>;

  return (
    <div className="min-h-screen bg-pink-50/30 pb-20">
      
      {/* 1. HEADER SECTION */}
      <div className="bg-pink-600 p-6 rounded-b-[2.5rem] shadow-xl shadow-pink-200 text-white relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-2xl font-black tracking-tight mb-1">
              Hello, Mommy {motherData.name.split(" ")[0]}!
            </h1>
            <p className="text-pink-100 text-xs font-bold uppercase tracking-widest opacity-80">
              Maternal Health Portal
            </p>
        </div>
        
        {/* Decorative Background Icon */}
        <Baby className="absolute -right-4 -bottom-8 w-32 h-32 text-pink-500 opacity-20 rotate-12" />
      </div>

      <div className="p-6 max-w-md mx-auto -mt-8 space-y-6 relative z-20">

        {/* 2. STATUS CARD (Dynamic Weeks) */}
        <div className="bg-white p-5 rounded-3xl shadow-lg border border-pink-100 flex items-center justify-between">
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Stage</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-pink-500">
                        {calculateWeeks(motherData.pregnancyWeeks, motherData.createdAt)}
                    </span>
                    <span className="text-sm font-bold text-gray-600">Weeks</span>
                </div>
            </div>
            
            <div className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider ${
                motherData.status === 'For Referral' 
                ? 'bg-red-100 text-red-600' 
                : 'bg-green-100 text-green-600'
            }`}>
                {motherData.status}
            </div>
        </div>

        {/* 3. NEXT APPOINTMENT / MESSAGE BOX */}
        {motherData.nextCheckup ? (
            <div className="bg-blue-600 text-white p-5 rounded-3xl shadow-lg shadow-blue-200 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Next Clinic Visit</span>
                    </div>
                    <h3 className="text-2xl font-black">
                        {new Date(motherData.nextCheckup).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">{motherData.adminFeedback || "Please visit the center."}</p>
                </div>
                <Stethoscope className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500 opacity-20" />
            </div>
        ) : (
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-center text-gray-400 text-xs font-bold uppercase">No appointment scheduled</p>
            </div>
        )}

        {/* 4. MAIN ACTIONS */}
        <div className="grid grid-cols-2 gap-4">
            <Link to="/mother/input" className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-2xl shadow-lg shadow-pink-200 flex flex-col items-center justify-center gap-2 transition-transform active:scale-95">
                <Activity className="w-6 h-6" />
                <span className="font-bold text-sm">Log Vitals</span>
            </Link>

            <a href="tel:911" className="bg-white hover:bg-red-50 text-red-500 border-2 border-red-50 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-transform active:scale-95">
                <Phone className="w-6 h-6" />
                <span className="font-bold text-sm">Emergency</span>
            </a>
        </div>

        {/* 5. NEW: PREGNANCY INFO BOARD (TIPS) */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-pink-100">
            <h3 className="text-lg font-black text-pink-500 flex items-center gap-2 mb-4">
                <Info className="w-5 h-5" /> Mommy Tips
            </h3>
            
            <div className="space-y-4">
                {/* Tip 1: Nutrition */}
                <div className="flex gap-4 items-start bg-green-50 p-4 rounded-2xl">
                    <div className="bg-green-100 p-2 rounded-full text-green-600 shrink-0">
                        <Apple className="w-5 h-5"/>
                    </div>
                    <div>
                        <h4 className="font-bold text-green-800 text-sm mb-1">Healthy Eating</h4>
                        <p className="text-xs text-green-700 leading-relaxed">
                            Eat plenty of leafy vegetables (malunggay), fish, and eggs. Drink 8-10 glasses of water daily to stay hydrated.
                        </p>
                    </div>
                </div>

                {/* Tip 2: Warning Signs */}
                <div className="flex gap-4 items-start bg-red-50 p-4 rounded-2xl">
                    <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
                        <AlertTriangle className="w-5 h-5"/>
                    </div>
                    <div>
                        <h4 className="font-bold text-red-800 text-sm mb-1">Danger Signs</h4>
                        <p className="text-xs text-red-700 leading-relaxed">
                            Go to the clinic immediately if you experience severe headaches, blurry vision, vaginal bleeding, or severe stomach pain.
                        </p>
                    </div>
                </div>

                {/* Tip 3: Self Care */}
                <div className="flex gap-4 items-start bg-blue-50 p-4 rounded-2xl">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0">
                        <Heart className="w-5 h-5"/>
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-800 text-sm mb-1">Daily Care</h4>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            Rest on your left side to improve blood flow to the baby. Take your prenatal vitamins as prescribed.
                        </p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default MotherDashboard;
import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Activity, AlertTriangle, Calendar, Megaphone, Clock, MapPin } from "lucide-react";

const HomePage = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    highRisk: 0,
    todayVisits: 0
  });
  
  // NEW: Store the list of upcoming appointments
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients`);
        const data = res.data;

        // 1. COUNT UNIQUE PATIENTS
        const uniquePatients = new Set(data.map(p => p.patientId)).size;

        // 2. COUNT HIGH RISK
        const highRiskCount = data.filter(p => p.status === 'For Referral').length;

        // 3. COUNT TODAY'S VISITS
        const todayStr = new Date().toDateString();
        const todayCount = data.filter(p => new Date(p.createdAt).toDateString() === todayStr).length;

        setStats({
          totalPatients: uniquePatients,
          highRisk: highRiskCount,
          todayVisits: todayCount
        });

        // 4. GET UPCOMING SCHEDULES (Filter patients with a date, then Sort)
        const upcoming = data
          .filter(p => p.nextCheckup) // Only those with a schedule
          .sort((a, b) => new Date(a.nextCheckup) - new Date(b.nextCheckup)) // Soonest first
          .slice(0, 5); // Show only top 5

        setSchedule(upcoming);

      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase tracking-wider">Dashboard Overview</h2>
      
      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-50 p-4 rounded-xl"><Users className="w-8 h-8 text-blue-600" /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Patients</p>
            <h3 className="text-3xl font-black text-gray-800">{stats.totalPatients}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-red-50 p-4 rounded-xl"><AlertTriangle className="w-8 h-8 text-red-600" /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">High Risk Cases</p>
            <h3 className="text-3xl font-black text-red-600">{stats.highRisk}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-50 p-4 rounded-xl"><Activity className="w-8 h-8 text-green-600" /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Today's Logs</p>
            <h3 className="text-3xl font-black text-gray-800">{stats.todayVisits}</h3>
          </div>
        </div>
      </div>

      {/* --- NEW: INFORMATION BOARD --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COL: ANNOUNCEMENTS (Static) */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="bg-white/20 p-2 rounded-full"><Megaphone className="w-6 h-6 text-white" /></div>
            <h3 className="font-black uppercase tracking-widest text-sm">Center Announcements</h3>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
               <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase mb-2 inline-block">Priority</span>
               <h4 className="font-bold text-lg leading-tight">Dengue Awareness Month</h4>
               <p className="text-sm text-blue-100 mt-2 opacity-90">Please remind all mothers to clean water containers. Fogging scheduled for next Tuesday.</p>
            </div>

            <div className="flex items-start gap-4 opacity-80">
               <Calendar className="w-5 h-5 mt-1" />
               <div>
                  <h5 className="font-bold text-sm uppercase">Barangay Holiday</h5>
                  <p className="text-xs">Clinic will be closed on Dec 25. Emergency team on standby.</p>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COL: UPCOMING SCHEDULES (Dynamic Real Data) */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 p-8">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-pink-50 p-2 rounded-full"><Calendar className="w-6 h-6 text-pink-500" /></div>
                <h3 className="font-black uppercase tracking-widest text-sm text-gray-800">Upcoming Checkups</h3>
              </div>
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{schedule.length} Scheduled</span>
           </div>

           <div className="space-y-4">
              {schedule.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                  <p className="text-sm font-bold uppercase text-gray-400">No scheduled appointments</p>
                </div>
              ) : (
                schedule.map((patient) => (
                  <div key={patient._id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-pink-200 transition-colors">
                    <div>
                       <h4 className="font-bold text-gray-800">{patient.name}</h4>
                       <p className="text-[10px] font-mono font-bold text-blue-500 mt-0.5">ID: {patient.patientId}</p>
                    </div>
                    <div className="text-right">
                       <div className="flex items-center justify-end gap-1 text-pink-600">
                          <Clock className="w-3 h-3" />
                          <p className="text-xs font-black uppercase">
                             {new Date(patient.nextCheckup).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                       </div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(patient.nextCheckup).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
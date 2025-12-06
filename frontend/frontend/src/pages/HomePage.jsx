import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import axios from "axios";

const HomePage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/patients");
        setPatients(res.data);
        setLoading(false);
      } catch (err) { setLoading(false); }
    };
    fetchData();
  }, []);

  const total = patients.length;
  const critical = patients.filter(p => p.status === 'For Referral').length;
  const normal = patients.filter(p => p.status === 'Normal').length;

  if (loading) return <div>Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* WELCOME */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight uppercase">BHS Dashboard</h1>
        <p className="text-gray-500">Real-time status overview.</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-blue-100 flex items-center gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><Users className="w-8 h-8"/></div>
          <div><p className="text-xs font-bold text-gray-400 uppercase">Total Mothers</p><p className="text-4xl font-black text-gray-800">{total}</p></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-red-100 flex items-center gap-4">
          <div className="bg-red-50 p-4 rounded-2xl text-red-600"><AlertTriangle className="w-8 h-8"/></div>
          <div><p className="text-xs font-bold text-red-400 uppercase">Referrals</p><p className="text-4xl font-black text-red-600">{critical}</p></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-green-100 flex items-center gap-4">
          <div className="bg-green-50 p-4 rounded-2xl text-green-600"><CheckCircle className="w-8 h-8"/></div>
          <div><p className="text-xs font-bold text-green-600 uppercase">Stable</p><p className="text-4xl font-black text-gray-800">{normal}</p></div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/create" className="bg-primary/5 border border-primary/20 p-8 rounded-[2rem] hover:bg-primary/10 transition-colors group cursor-pointer">
          <Activity className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform"/>
          <h3 className="text-xl font-bold text-gray-800">Add New Vitals</h3>
          <p className="text-gray-500 text-sm mt-2">Enter new prenatal checkup data.</p>
        </Link>
        <Link to="/patients" className="bg-white border border-gray-200 p-8 rounded-[2rem] hover:shadow-lg transition-all group cursor-pointer">
          <Users className="w-10 h-10 text-gray-400 mb-4 group-hover:text-gray-800 transition-colors"/>
          <h3 className="text-xl font-bold text-gray-800">View Master List</h3>
          <p className="text-gray-500 text-sm mt-2">Search and manage patient records.</p>
        </Link>
      </div>
    </div>
  );
};
export default HomePage;
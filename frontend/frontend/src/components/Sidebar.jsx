import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, PlusCircle, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import dohLogo from "../assets/doh.png"; // Ensure this file exists in src/assets

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  // High Contrast Active State
  const getLinkClass = (path) => 
    location.pathname === path 
      ? "bg-primary text-white shadow-lg shadow-primary/40 scale-105" 
      : "text-gray-500 hover:bg-red-50 hover:text-primary hover:font-bold";

  return (
    <div className="w-64 h-screen bg-white flex flex-col fixed left-0 top-0 border-r border-gray-200 z-40 pt-10">
      
      {/* LOGO SECTION - DOH ONLY */}
      <div className="px-6 pb-8 flex flex-col items-center border-b border-gray-100">
        
        {/* Just the DOH Logo now, slightly larger for impact */}
        <div className="mb-4 bg-white rounded-full p-1">
          <img src={dohLogo} className="w-16 h-16 object-contain" alt="DOH Logo"/>
        </div>
        
        <h2 className="text-[10px] font-extrabold text-gray-400 tracking-[0.2em] uppercase text-center mb-1">Department of Health</h2>
        <h1 className="text-xl font-black text-gray-800 text-center leading-none tracking-tight">
          MaternalLink<br/>
          <span className="text-primary text-xs font-bold tracking-widest uppercase">Region X Portal</span>
        </h1>
      </div>

      {/* NAV LINKS */}
      <nav className="flex-1 px-4 py-8 space-y-3">
        
        <p className="px-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2">Main Menu</p>

        <Link to="/" className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${getLinkClass('/')}`}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-xs font-extrabold uppercase tracking-widest">Dashboard</span>
        </Link>

        <Link to="/patients" className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${getLinkClass('/patients')}`}>
          <Users className="w-5 h-5" />
          <span className="text-xs font-extrabold uppercase tracking-widest">Records</span>
        </Link>

        <Link to="/create" className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${getLinkClass('/create')}`}>
          <PlusCircle className="w-5 h-5" />
          <span className="text-xs font-extrabold uppercase tracking-widest">Add Vitals</span>
        </Link>
      </nav>

      {/* BOTTOM PROFILE */}
      <div className="p-5 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="avatar placeholder">
            <div className="bg-primary text-white rounded-xl w-10 h-10 flex items-center justify-center shadow-md">
              <span className="text-xs font-black">RM</span>
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-800 truncate">Midwife Maria</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Brgy. Health Worker</p>
          </div>
        </div>
        
        <button 
          onClick={logout} 
          className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-xl bg-white border border-gray-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-gray-500 text-xs font-extrabold uppercase tracking-wider shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
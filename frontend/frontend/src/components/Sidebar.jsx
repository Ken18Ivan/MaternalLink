import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Users, LogOut, UserCircle, ClipboardList } from "lucide-react"; // Added ClipboardList

const Sidebar = () => {
  const { logout } = useAuth();
  const useNavigateHook = useNavigate();

  const handleLogout = () => {
    logout();
    useNavigateHook("/login");
  };

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col justify-between z-50">
      
      <div>
        <div className="h-24 flex flex-col items-center justify-center border-b border-gray-100 bg-blue-50/50">
          <h1 className="text-2xl font-black text-blue-600 tracking-tighter">MATERNAL<span className="text-gray-800">LINK</span></h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">LGU Iligan City</p>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors font-bold text-sm uppercase tracking-wide">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/patients" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors font-bold text-sm uppercase tracking-wide">
            <Users className="w-5 h-5" /> Patient Records
          </Link>
          
          {/* --- NEW CHECKUP LOGS BUTTON --- */}
          <Link to="/logs" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors font-bold text-sm uppercase tracking-wide">
            <ClipboardList className="w-5 h-5" /> Checkup Logs
          </Link>

        </nav>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="bg-blue-200 p-2 rounded-full">
            <UserCircle className="w-8 h-8 text-blue-700" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-gray-800 truncate">Midwife Admin</p>
            <p className="text-[10px] font-bold text-green-600 uppercase">● Online</p>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-2 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-lg transition-colors font-bold text-xs uppercase tracking-wide shadow-sm">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
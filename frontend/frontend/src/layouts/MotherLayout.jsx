import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, Settings } from "lucide-react";

const MotherLayout = ({ children }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    // 1. OUTER WRAPPER: Centers the "Phone" on the screen
    <div className="min-h-screen bg-gray-200 flex justify-center">
      
      {/* 2. THE "PHONE" CONTAINER: Limits width to mobile size (max-w-md) */}
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative shadow-2xl overflow-hidden font-sans text-gray-900 pb-20">
        
        {/* PAGE CONTENT */}
        {children}

        {/* BOTTOM NAVIGATION BAR */}
        {/* Added 'absolute' positioning relative to the phone container, not the window */}
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] rounded-t-[2rem]">
          
          <Link to="/mother" className={`flex flex-col items-center gap-1 transition-all ${isActive('/mother') ? 'text-pink-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
             <Home className={`w-6 h-6 ${isActive('/mother') ? 'fill-pink-100' : ''}`} />
             <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
          </Link>

          <Link to="/mother/input" className="bg-gradient-to-tr from-pink-500 to-rose-500 text-white p-4 rounded-full -mt-10 shadow-lg shadow-pink-200 border-4 border-gray-50 hover:scale-105 transition-transform">
             <PlusCircle className="w-8 h-8" />
          </Link>

          <Link to="/mother/settings" className={`flex flex-col items-center gap-1 transition-all ${isActive('/mother/settings') ? 'text-pink-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
             <Settings className={`w-6 h-6 ${isActive('/mother/settings') ? 'fill-pink-100' : ''}`} />
             <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default MotherLayout;
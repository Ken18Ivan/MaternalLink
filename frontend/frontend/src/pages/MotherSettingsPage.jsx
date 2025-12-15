import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Shield, FileText, ChevronRight, User } from "lucide-react";

const MotherSettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if(confirm("Are you sure you want to sign out?")) {
        logout();
        navigate("/login");
    }
  };

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="bg-white p-6 pt-12 pb-8 rounded-b-[2rem] shadow-sm border-b border-gray-100">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Account & Legal</h1>
        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Manage your profile</p>
      </div>

      <div className="p-6 space-y-6">
        
        {/* PROFILE CARD */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
            <div className="bg-pink-100 p-3 rounded-full">
                <User className="w-6 h-6 text-pink-500" />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Currently Logged In</p>
                <p className="text-lg font-black text-gray-800">{user?.name || "Mommy"}</p>
            </div>
        </div>

        {/* LEGAL SECTION */}
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Legal Information</h3>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            
            {/* ITEM 1: DATA PRIVACY */}
            <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <span className="font-bold text-gray-700">Data Privacy Policy</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed pl-8">
                    By using this app, you verify that your data is processed in compliance with <span className="font-bold text-blue-500">RA 10173 (Data Privacy Act of 2012)</span>. Your health records are encrypted and accessible only by authorized LGU Health Personnel.
                </p>
            </div>

            {/* ITEM 2: TERMS AND CONDITIONS */}
            <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-orange-500" />
                        <span className="font-bold text-gray-700">Terms & Conditions</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500" />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed pl-8">
                    This application is a property of LGU Iligan. Unauthorized access or falsification of medical records is punishable by law.
                </p>
            </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button onClick={handleLogout} className="w-full bg-white border-2 border-red-100 text-red-500 p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-50 transition-colors flex items-center justify-center gap-2 mt-8 shadow-sm">
            <LogOut className="w-5 h-5" /> Sign Out
        </button>

        <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-4">
            Version 1.0.0 • Built for Thesis
        </p>

      </div>
    </div>
  );
};
export default MotherSettingsPage;
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User, ArrowLeft, Heart, Activity } from "lucide-react";
import axios from "axios"; // IMPORT AXIOS
import toast from "react-hot-toast";

const LoginPage = () => {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // WORKER LOGIN
    if (role === 'worker') {
      if (email === "midwife@doh.gov.ph" && password === "admin123") {
        login({ name: "Midwife Maria", role: "admin" });
        navigate("/"); 
        toast.success("Welcome back, Midwife!");
      } else {
        toast.error("Invalid Government Credentials");
      }
      setLoading(false);
    } 
    // MOTHER LOGIN (SECURE CHECK)
    else if (role === 'patient') {
      if (email !== "") { 
        try {
            // 1. CHECK DATABASE IF ID EXISTS
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients`);
            const foundUser = res.data.find(p => p.patientId === email);

            if (foundUser) {
                // 2. ID FOUND -> LOGIN
                login({ name: email, role: "patient" });
                navigate("/mother"); 
                toast.success(`Welcome back, Mommy ${foundUser.name}!`);
            } else {
                // 3. ID NOT FOUND -> REJECT
                toast.error("Access Denied: ID not found in database.");
            }
        } catch (error) {
            toast.error("Connection Error. Please try again.");
        }
      } else {
        toast.error("Please enter your Patient ID");
      }
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row items-center justify-center p-6 gap-8">
        <div onClick={() => setRole('worker')} className="group cursor-pointer bg-white border-l-8 border-blue-600 p-8 rounded-r-xl shadow-lg hover:shadow-2xl transition-all w-full max-w-sm flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Activity className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest">Health Worker</h2>
          <p className="text-gray-400 text-xs mt-2">Log in to the LGU Portal</p>
          <span className="mt-6 text-xs font-bold text-blue-600 uppercase border-b border-blue-200 pb-1">Authorized Access Only</span>
        </div>

        <div onClick={() => setRole('patient')} className="group cursor-pointer bg-gradient-to-br from-pink-400 to-rose-500 p-8 rounded-[2.5rem] shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-105 transition-all w-full max-w-sm flex flex-col items-center text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">I am a Mommy</h2>
          <p className="text-white/80 text-sm mt-2 font-medium">View vitals & checkups</p>
          <button className="mt-6 bg-white text-rose-500 px-6 py-2 rounded-full text-xs font-bold uppercase shadow-sm">Tap to Enter</button>
        </div>
      </div>
    );
  }

  if (role === 'worker') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-blue-600 relative">
          <button onClick={() => setRole(null)} className="absolute top-6 left-6 text-gray-400 hover:text-gray-700"><ArrowLeft className="w-5 h-5" /></button>
          <div className="text-center mb-8 mt-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"><span className="font-serif text-2xl font-bold text-blue-800">DOH</span></div>
            <h1 className="text-xl font-bold text-gray-800 uppercase tracking-widest">MaternalLink</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Official Personnel Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Official Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type="email" placeholder="midwife@doh.gov.ph" className="input input-bordered w-full pl-12 rounded-lg bg-gray-50 focus:bg-white text-gray-900 transition-colors" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Secure Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type="password" placeholder="••••••••" className="input input-bordered w-full pl-12 rounded-lg bg-gray-50 focus:bg-white text-gray-900 transition-colors" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <button disabled={loading} className="btn bg-blue-700 hover:bg-blue-800 text-white w-full rounded-lg font-bold uppercase tracking-wider shadow-lg shadow-blue-200 mt-2 h-12 border-none">
                {loading ? "Verifying..." : "Access Records"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (role === 'patient') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-pink-200 w-full max-w-sm border border-pink-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-pink-500 to-rose-500 rounded-b-[50%] scale-x-150"></div>
          <div className="relative z-10">
            <button onClick={() => setRole(null)} className="absolute -top-2 left-0 text-white hover:scale-110 transition-transform bg-white/20 p-2 rounded-full backdrop-blur-sm"><ArrowLeft className="w-5 h-5" /></button>
            <div className="text-center mt-10 mb-8">
              <div className="w-24 h-24 bg-white p-2 rounded-full mx-auto mb-4 shadow-lg flex items-center justify-center"><User className="w-12 h-12 text-pink-500" /></div>
              <h1 className="text-3xl font-black text-gray-800">Hello Mommy!</h1>
              <p className="text-sm text-gray-400 font-bold mt-1">Please log in to continue</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-rose-400 uppercase ml-4 tracking-wider">Enter Patient ID</label>
                <input type="text" placeholder="e.g. 2025-1234" className="input input-lg w-full h-16 rounded-[2rem] bg-pink-50 border-2 border-pink-100 text-center font-bold text-xl text-gray-900 focus:outline-none focus:border-pink-400 focus:bg-white transition-all placeholder:text-pink-200 placeholder:text-lg placeholder:font-normal" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button disabled={loading} className="w-full h-16 rounded-[2rem] bg-gradient-to-r from-pink-500 to-rose-500 hover:to-rose-600 text-white text-xl font-black uppercase tracking-widest shadow-xl shadow-pink-300 transform active:scale-95 transition-all flex items-center justify-center gap-3">
                {loading ? <span>Searching ID...</span> : <><span>Access Profile</span><Heart className="w-6 h-6 fill-white" /></>}
              </button>
            </form>
            <p className="text-center text-xs text-gray-300 mt-8 font-bold uppercase tracking-widest">MaternalLink App</p>
          </div>
        </div>
      </div>
    );
  }
};
export default LoginPage;
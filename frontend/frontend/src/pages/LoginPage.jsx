import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Activity, Lock, Mail } from "lucide-react";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("Welcome, Midwife!");
      navigate("/");
    } else {
      toast.error("Try password: admin123");
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      {/* Increased max-width and padding for breathing room */}
      <div className="card w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden p-10 border border-primary/10">
        
        {/* Header Section - Added margin bottom */}
        <div className="text-center mb-10">
          <div className="bg-primary w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-primary/30">
            <Activity className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">MaternalLink</h1>
          <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mt-2">Barangay Health Portal</p>
        </div>

        {/* Login Form - Added GAP (space-y-6) */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          <div className="form-control">
            <label className="label pl-1 pb-2">
              <span className="label-text text-gray-500 font-bold text-xs uppercase">Email Address</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-primary" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="midwife@doh.gov.ph" 
                className="input input-bordered h-14 pl-12 w-full rounded-2xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-base transition-all"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label pl-1 pb-2">
              <span className="label-text text-gray-500 font-bold text-xs uppercase">Password</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-primary" />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="input input-bordered h-14 pl-12 w-full rounded-2xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-base transition-all"
              />
            </div>
          </div>

          {/* Spacer before button */}
          <div className="pt-4">
            <button className="btn btn-primary w-full rounded-2xl text-white font-bold text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform h-14">
              SIGN IN
            </button>
          </div>

        </form>

        {/* Footer Text */}
        <div className="text-center mt-10 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium leading-relaxed">
            Department of Health • Region X<br/>
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
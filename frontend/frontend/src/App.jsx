import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import CheckupLogsPage from "./pages/CheckupLogsPage";

// Pages
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PatientsPage from "./pages/PatientsPage";
import CreatePage from "./pages/CreatePage";
import MotherDashboard from "./pages/MotherDashboard";
import MotherInputPage from "./pages/MotherInputPage";
import MotherSettingsPage from "./pages/MotherSettingsPage"; // 1. IMPORT THIS

// Components
import Sidebar from "./components/Sidebar";
import GovFooter from "./components/GovFooter"; 
import MotherLayout from "./layouts/MotherLayout";

// Admin Layout Wrapper
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col relative">
        <main className="flex-1 p-8 pb-20">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Barangay Pugaan</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Health Center System • LGU Iligan
              </p>
            </div>
          </div>
          {children}
        </main>
        <GovFooter />
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* ADMIN ROUTES */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout><HomePage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><DashboardLayout><PatientsPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><DashboardLayout><CreatePage /></DashboardLayout></ProtectedRoute>} />
        
        {/* 2. Add This Route */}
        <Route path="/logs" element={<ProtectedRoute><DashboardLayout><CheckupLogsPage /></DashboardLayout></ProtectedRoute>} />

        {/* MOTHER ROUTES */}
        <Route path="/mother" element={<ProtectedRoute><MotherLayout><MotherDashboard /></MotherLayout></ProtectedRoute>} />
        <Route path="/mother/input" element={<ProtectedRoute><MotherLayout><MotherInputPage /></MotherLayout></ProtectedRoute>} />
        <Route path="/mother/settings" element={<ProtectedRoute><MotherLayout><MotherSettingsPage /></MotherLayout></ProtectedRoute>} />

      </Routes>
    </AuthProvider>
  );
}

export default App;
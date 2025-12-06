import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// --- CONTEXT & SECURITY ---
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// --- LAYOUT COMPONENTS ---
import Sidebar from "./components/Sidebar";
import GovBanner from "./components/GovBanner";
import GovFooter from "./components/GovFooter";

// --- PAGES ---
import HomePage from "./pages/HomePage";       // The Dashboard (Cards)
import PatientsPage from "./pages/PatientsPage"; // The Registry (Table)
import CreatePage from "./pages/CreatePage";   // The Input Form
import LoginPage from "./pages/LoginPage";     // The Login Screen

// --- DASHBOARD LAYOUT (The "Government Shell") ---
// This wraps all pages EXCEPT Login.
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* 1. Official Top Banner (GOV.PH) */}
      <GovBanner />

      <div className="flex flex-1 relative">
        
        {/* 2. Fixed Sidebar */}
        <Sidebar />

        {/* 3. Main Content Area */}
        {/* ml-64 pushes content right to not hide behind sidebar */}
        <main className="flex-1 ml-64 p-8 min-h-[85vh]">
          
          {/* Internal Header Strip (Barangay Branding) */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Barangay Poblacion</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Health Center System • Region X
              </p>
            </div>
            
            {/* Quick Actions / Date */}
            <div className="flex flex-col items-end">
              <p className="text-sm font-bold text-gray-700">Dr. Natasha Atokolo</p>
              <p className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                ● ACTIVE SESSION
              </p>
            </div>
          </div>

          {/* The Page Content Renders Here */}
          {children}

        </main>
      </div>

      {/* 4. Official Footer (Pushed right) */}
      <div className="ml-64">
        <GovFooter />
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  return (
    <AuthProvider>
      <div className="font-sans antialiased text-gray-900 bg-gray-50">
        <Routes>
          
          {/* PUBLIC ROUTE: Login (No Sidebar/Footer) */}
          <Route path="/login" element={<LoginPage />} />

          {/* PROTECTED ROUTES (Requires Login) */}
          
          {/* 1. Dashboard */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout>
                <HomePage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* 2. Patient Registry (Table) */}
          <Route path="/patients" element={
            <ProtectedRoute>
              <DashboardLayout>
                <PatientsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* 3. Add New Record (Form) */}
          <Route path="/create" element={
            <ProtectedRoute>
              <DashboardLayout>
                <CreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

        </Routes>

        {/* Notification Popups */}
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </AuthProvider>
  );
}

export default App;
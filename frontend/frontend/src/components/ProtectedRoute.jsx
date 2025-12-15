import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // If not logged in, kick back to Login Page
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
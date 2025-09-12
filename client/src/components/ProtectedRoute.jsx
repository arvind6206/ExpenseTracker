import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth(); // get token from context

  // if user is not logged in, redirect to login
  return token ? children : <Navigate to="/login" replace />;
}

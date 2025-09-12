import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Fetch user data when component mounts
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get("http://localhost:5000/api/auth/me");
          setUser(response.data);
        } catch (error) {
          console.error("Failed to load user:", error);
          // If token is invalid, clear it
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  // Only render children when we're done loading the user
  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddTransactionPage from "./pages/AddTransactionPage";
import EditTransactionPage from "./pages/EditTransactionPage";
import ReportsPage from "./pages/ReportsPage";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 bg-white dark:bg-gray-900">
            <Routes>
              {/* Public page */}
              <Route path="/" element={<Home />} />

              {/* Auth pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected pages */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-transaction"
                element={
                  <ProtectedRoute>
                    <AddTransactionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-transaction/:id"
                element={
                  <ProtectedRoute>
                    <EditTransactionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}

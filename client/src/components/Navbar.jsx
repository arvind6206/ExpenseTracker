import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState, useRef, useEffect } from 'react';
import { LogOut, User, Home, PieChart, Wallet, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Show loading state while checking auth status
  if (loading) {
    return (
      <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-gray-900 dark:to-gray-800 text-white px-6 py-3 shadow-lg transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="text-yellow-300" size={28} />
            <span className="hidden sm:inline">Finance Tracker</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-indigo-500/20 animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-gray-900 dark:to-gray-800 text-white px-6 py-3 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="text-yellow-300" size={28} />
          <span className="hidden sm:inline">Finance Tracker</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-indigo-500/20 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon size={20} className="text-white" />
            ) : (
              <Sun size={20} className="text-yellow-300" />
            )}
          </button>
          
          {!user ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-lg hover:bg-indigo-500/20 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-600 dark:bg-indigo-800 dark:hover:bg-indigo-700 px-4 py-2 rounded-full transition-colors"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <span className="font-medium">{user.name || 'Account'}</span>
              </button>
              
              <div 
                className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 z-50 border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
                  isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              >
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                  Dashboard
                </Link>
                <Link
                  to="/reports"
                  className="flex items-center px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <PieChart size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                  Reports
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut size={16} className="mr-3" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

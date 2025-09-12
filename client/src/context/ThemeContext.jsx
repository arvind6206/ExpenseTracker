import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Helper function to get initial theme
const getInitialTheme = () => {
  // Check for saved theme first
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    // Fallback to system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  }
  return 'light'; // Default for server-side rendering
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => getInitialTheme());

  // Apply theme on initial render (before hydration)
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    
    // Listen for system theme changes (only if no explicit theme is set)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (!localStorage.getItem('theme')) {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        setTheme(newTheme);
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
        root.setAttribute('data-theme', newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Always save the theme preference to localStorage when it changes
    localStorage.setItem('theme', theme);
    
    // Update the class list and attributes
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    
    // For Tailwind's dark mode
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

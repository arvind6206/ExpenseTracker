const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://expense-tracker-server-sandy.vercel.app'  // Replace with your Vercel backend URL
  : 'http://localhost:5000';

export { API_BASE_URL };

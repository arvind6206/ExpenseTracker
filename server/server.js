import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();
const app = express();

// Configure CORS
const allowedOrigins = ['http://localhost:5173'];

// Apply CORS middleware with specific origin
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});
app.use(express.json());

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });});

// Connect to MongoDB first, then start the server
const startServer = async () => {
  try {
    await connectDB();
    
    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/transactions", transactionRoutes);

    // Test route
    app.get('/api/test', (req, res) => {
      res.json({ status: 'API is working', timestamp: new Date().toISOString() });
    });

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n✅ Server running on http://localhost:${PORT}`);
      console.log(`   - Test API: http://localhost:${PORT}/api/test`);
      console.log(`   - MongoDB: ${process.env.MONGO_URI ? 'Configured' : 'Not configured'}`);
      console.log(`   - Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use. Please free the port or use a different one.\n`);
      } else {
        console.error('\n❌ Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('\n❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

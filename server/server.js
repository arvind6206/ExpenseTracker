import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();
const app = express();

// ✅ Configure CORS
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://expense-tracker-pearl-delta-34.vercel.app" // deployed frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.json({ status: "API is working", timestamp: new Date().toISOString() });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.message || err);
  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Server error"
  });
});

// ✅ Connect DB and start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n✅ Server running on http://localhost:${PORT}`);
      console.log(`   - Test API: http://localhost:${PORT}/api/test`);
      console.log(
        `   - MongoDB: ${process.env.MONGO_URI ? "Configured" : "Not configured"}`
      );
      console.log(`   - Environment: ${process.env.NODE_ENV || "development"}\n`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `\n❌ Port ${PORT} is already in use. Please free the port or use a different one.\n`
        );
      } else {
        console.error("\n❌ Server error:", error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("\n❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

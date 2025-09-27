import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";

dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // you can restrict to your frontend origin later
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

// Global error handler (optional, good for debugging)
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

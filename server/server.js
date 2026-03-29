import express from "express";
import dotenv from "dotenv";
import authRoutes from "./authRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

// API
app.use("/api", authRoutes);

// health check
app.get("/", (req, res) => {
  res.json({ message: "Eco Tracker API is running" });
});

// RENDER
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
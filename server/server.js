import express from "express";
import dotenv from "dotenv";
import authRoutes from "./authRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://eco-tracker-pwa.onrender.com");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use("/api", authRoutes);

app.get("/", (req, res) => res.json({ message: "Eco Tracker API is running" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("🔥 Backend running on port", PORT));
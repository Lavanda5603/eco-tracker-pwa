/**
 * 🚀 server.js
 * Основной сервер (FIXED CORS)
 */

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./authRoutes.js";

dotenv.config();

const app = express();

// Парсинг JSON
app.use(express.json());

// Настройка CORS
app.use((req, res, next) => {
  const allowedOrigin = "https://symmetrical-space-guacamole-97g776jxqg6qc7jwx-8080.app.github.dev";

  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // Обработка preflight-запросов
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

//  Роуты
app.use("/api", authRoutes);

// Проверка сервера
app.get("/", (req, res) => {
  res.json({ message: "Eco Tracker API is running" });
});

// Запуск
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Auth server running on port ${PORT}`);
});
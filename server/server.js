/**
 * 🚀 server.js
 * Основной сервер
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
  // Получаю origin из запроса (откуда пришёл фронтенд)
  const origin = req.headers.origin;
  
  // Список разрешённых доменов
  const allowedOrigins = [
    'https://eco-tracker-pwa.onrender.com', // Фронтенд на Render
    'https://symmetrical-space-guacamole-97g776jxqg6qc7jwx-8080.app.github.dev', // Codespaces
    'http://localhost:3000', // Локальный Docker
    'http://localhost:8080', // Локальный serve
    'http://127.0.0.1:5500', // Локальный Live Server
    'https://symmetrical-space-guacamole-97g776jxqg6qc7jwx-5500.app.github.dev' // GitHub Codespaces альт
  ];
  
  // Проверяю, разрешён ли origin
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else if (origin) {
    // Для неизвестных origin в development можно закомментировать, в production лучше не разрешать
    console.warn(`⚠️ CORS: Blocked origin ${origin}`);
  }
  
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

// Роуты
app.use("/api", authRoutes);

// Проверка сервера (для health check на Render)
app.get("/api", (req, res) => {
  res.json({ message: "Eco Tracker API is running" });
});

// Запуск
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Auth server running on port ${PORT}`);
  console.log(`📡 CORS allowed origins: production + localhost + codespaces`);
});
/**
 * 🚀 main.js
 * 
 * Точка входа приложения
 * Инициализирует все модули и сервисы
 */

import { initRouter } from "./core/router.js";
import { initUI } from "./core/uiContainer.js";
import "./serviceWorker.js";

/**
 * Инициализация приложения
 */
function initApp() {
  console.log("🌱 Eco Tracker starting...");
  
  initUI();
  initRouter();
  
  console.log("✅ Eco Tracker ready");
}

// Запуск
initApp();
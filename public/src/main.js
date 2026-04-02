/**
 * 🚀 main.js
 * Точка входа приложения
 */

import { initRouter } from "./core/router.js";
import { initUI } from "./core/uiContainer.js";
import { isAuthenticated, getSession } from "./core/authService.js";
import "./serviceWorker.js";

function initApp() {
  console.log("🌱 Eco Tracker starting...");
  
  initUI();
  initRouter();
  
  // Проверяю авторизацию
  if (!isAuthenticated()) {
    console.log("🔐 Not authenticated, redirecting to login");
    import("./core/router.js").then(router => {
      router.navigate("/auth");
    });
  } else {
    console.log("✅ User already logged in");
    const session = getSession();
    console.log("👤 User:", session.user?.email);
  }
  
  console.log("✅ Eco Tracker ready");
}

initApp();
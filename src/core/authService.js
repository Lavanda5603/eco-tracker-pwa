/**
 * 🔐 authService.js
 * Фронтенд для работы с сервером авторизации
 */

const API_URL = "/api";

// Регистрация пользователя
export async function registerUser(email, password) {
  try {
    console.log("📡 Registering:", email);
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    console.log("📡 Register response:", data);
    return data;
  } catch (error) {
    console.error("❌ Registration error:", error);
    return { error: error.message };
  }
}

// Вход пользователя
export async function loginUser(email, password) {
  try {
    console.log("📡 Logging in:", email);
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    console.log("📡 Login response:", data);
    return data;
  } catch (error) {
    console.error("❌ Login error:", error);
    return { error: error.message };
  }
}

// Сохранить сессию
export function saveSession(session) {
  localStorage.setItem("supabase_session", JSON.stringify(session));
}

// Получить сессию
export function getSession() {
  const session = localStorage.getItem("supabase_session");
  return session ? JSON.parse(session) : null;
}

// Выйти
export function logout() {
  localStorage.removeItem("supabase_session");
  console.log("👋 Logged out");
}

// Проверить авторизацию
export function isAuthenticated() {
  return getSession() !== null;
}

// Получить текущего пользователя
export function getCurrentUser() {
  const session = getSession();
  if (session && session.user) {
    return session.user;
  }
  return {
    id: "guest",
    name: "Гость",
    email: "guest@example.com"
  };
}
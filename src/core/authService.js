/**
 * 🔐 authService.js
 * 
 * Сервис авторизации (заглушка)
 * В MVP просто возвращает тестового пользователя
 * 
 * Входные данные: нет
 * Выходные данные: объект пользователя
 */

// Тестовый пользователь
const MOCK_USER = {
  id: 'user_123',
  name: 'Иван Петров',
  email: 'ivan@example.com',
  avatar: null,
  createdAt: '2024-03-01'
};

/**
 * Получить текущего пользователя
 * @returns {Object} - Объект пользователя
 */
export function getCurrentUser() {
  return { ...MOCK_USER };
}

/**
 * Проверить, авторизован ли пользователь
 * @returns {boolean} - True если авторизован
 */
export function isAuthenticated() {
  return true; // В MVP всегда true
}

/**
 * Выйти из системы
 */
export function logout() {
  console.log('👋 Logout called (mock)');
}
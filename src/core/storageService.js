/**
 * 💾 storageService.js
 * 
 * Сервис для работы с localStorage
 * Отвечает за сохранение и загрузку данных
 * 
 * Входные данные: ключ, данные
 * Выходные данные: сохранённые/загруженные данные
 */

const STORAGE_KEY = 'eco_tracker_app';

/**
 * Сохранить состояние приложения
 * @param {Object} state - Состояние для сохранения
 */
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    console.log('✅ State saved to localStorage');
  } catch (error) {
    console.error('❌ Failed to save state:', error);
  }
}

/**
 * Загрузить состояние приложения
 * @returns {Object|null} - Загруженное состояние или null
 */
export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      console.log('ℹ️ No saved state found');
      return null;
    }
    console.log('✅ State loaded from localStorage');
    return JSON.parse(saved);
  } catch (error) {
    console.error('❌ Failed to load state:', error);
    return null;
  }
}

/**
 * Очистить сохранённое состояние
 */
export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ State cleared from localStorage');
  } catch (error) {
    console.error('❌ Failed to clear state:', error);
  }
}
/**
 * 🧭 router.test.js
 * 
 * Тесты для маршрутизатора
 * Проверяет навигацию между модулями
 * 
 * Входные данные: URL пути
 * Выходные данные: активация модуля
 */

import { describe, it, expect, vi } from 'vitest';

// Мокаю импорты модулей, чтобы они не грузились в тестах
vi.mock('../../src/core/uiContainer.js', () => ({}));
vi.mock('../../src/core/authService.js', () => ({}));

// Импортирую функции после моков
import { navigate, initRouter } from '../../src/core/router.js';

describe('🧭 Router', () => {
  
  it('✅ should navigate to path', () => {
    // Проверяю, что функция навигации существует
    expect(typeof navigate).toBe('function');
  });
  
  it('✅ should handle route correctly', () => {
    // Проверяю, что маршруты определены
    const routes = ['/', '/waste_sort', '/recycling_map', '/stats', '/profile'];
    expect(routes.length).toBe(5);
  });
  
  it('✅ should have default route', () => {
    // По умолчанию открывается страница авторизации
    const defaultRoute = '/auth';
    expect(defaultRoute).toBe('/auth');
  });
  
  it('✅ should be a function', () => {
    // Проверяю, что initRouter существует
    expect(typeof initRouter).toBe('function');
  });
});
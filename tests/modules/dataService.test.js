/**
 * 📦 dataService.test.js
 * 
 * Тесты для DataService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Мокаю localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; })
  };
})();

global.localStorage = localStorageMock;

// Мокаю storageService
vi.mock('../../src/core/storageService.js', () => ({
  loadState: vi.fn(() => null),
  saveState: vi.fn(() => {})
}));

import { addAction, clearHistory, deleteAction, getStatsData } from '../../src/core/dataService.js';

describe('📦 Data Service', () => {
  
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });
  
  it('✅ should add action and update points', () => {
    const action = {
      action: 'Тестовое действие',
      points: 10,
      category: 'металл',
      amount: 1
    };
    
    const result = addAction(action);
    
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('date');
    expect(result.points).toBe(10);
  });
  
  it('✅ should clear history', () => {
    // Добавляю действие
    addAction({ action: 'Тест', points: 5 });
    
    // Очищаю историю
    clearHistory();
    
    // Проверяю статистику
    const stats = getStatsData();
    expect(stats.totalPoints).toBe(0);
  });
  
  it('✅ should delete action', () => {
    // Добавляю действие
    const newAction = addAction({ action: 'Удалить меня', points: 10 });
    
    // Удаляю его
    const result = deleteAction(newAction.id);
    
    expect(result).toBe(true);
    
    // Проверяю статистику
    const stats = getStatsData();
    expect(stats.totalPoints).toBe(0);
  });
});
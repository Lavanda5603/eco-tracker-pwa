/**
 * 📦 dataService.js
 * Центральное хранилище данных
 */

import { loadState, saveState } from './storageService.js';

// Функция получения текущей даты
function getToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}

// Начальное состояние
const INITIAL_STATE = {
  user: {
    name: 'Иван Петров',
    email: 'ivan@example.com',
    city: 'Санкт-Петербург',
    birthdate: '1990-03-30',
    avatar: null,
    joinDate: getToday(),
    level: 1,
    totalPoints: 0,
    co2Saved: 0,
    co2Goal: 300,
    streakDays: 0,
    lastActive: getToday()
  },
  
  actions: [], // Все действия пользователя
  achievements: [
    { id: 1, name: 'Первые шаги', description: 'Сдать 1 кг отходов', icon: '🌱', goal: 1, progress: 0, earned: false },
    { id: 2, name: 'Защитник леса', description: 'Сдать 100 кг макулатуры', icon: '🌲', goal: 100, progress: 0, earned: false },
    { id: 3, name: 'Энерджайзер', description: '7 дней подряд', icon: '⚡', goal: 7, progress: 0, earned: false },
    { id: 4, name: 'Металлист', description: 'Сдать 50 кг металла', icon: '🥫', goal: 50, progress: 0, earned: false },
    { id: 5, name: 'Стеклодув', description: 'Сдать 50 кг стекла', icon: '🥛', goal: 50, progress: 0, earned: false },
    { id: 6, name: 'Бумажный тигр', description: 'Сдать 50 кг бумаги', icon: '📄', goal: 50, progress: 0, earned: false },
    { id: 7, name: 'Эко-герой', description: 'Сдать 500 кг отходов', icon: '🏆', goal: 500, progress: 0, earned: false }
  ],
  
  leaderboard: [
    { name: 'Анна', points: 2850, avatar: '👩' },
    { name: 'Пётр', points: 2410, avatar: '👨' },
    { name: 'Вы', points: 0, avatar: '👤', isCurrentUser: true },
    { name: 'Мария', points: 1100, avatar: '👩' }
  ]
};

// Загружаю состояние
let appState = { ...INITIAL_STATE };
const saved = loadState();
if (saved) {
  appState = { ...INITIAL_STATE, ...saved };
  appState.actions = saved.actions || [];
  appState.achievements = saved.achievements || INITIAL_STATE.achievements;
}

// Сохраняю
function persist() {
  saveState(appState);
}

// Обновление уровня
function updateLevel() {
  const points = appState.user.totalPoints;
  if (points < 100) appState.user.level = 1;
  else if (points < 250) appState.user.level = 2;
  else if (points < 500) appState.user.level = 3;
  else if (points < 1000) appState.user.level = 4;
  else appState.user.level = 5;
}

// Обновление streak
function updateStreak() {
  const today = getToday();
  if (appState.user.lastActive !== today) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;
    
    if (appState.user.lastActive === yesterdayStr) {
      appState.user.streakDays++;
    } else {
      appState.user.streakDays = 1;
    }
    appState.user.lastActive = today;
  }
}

// Добавление действия
export function addAction(action) {
  const newAction = {
    id: Date.now(),
    date: getToday(),
    ...action
  };
  
  appState.actions.unshift(newAction);
  appState.user.totalPoints += action.points || 0;
  appState.user.co2Saved += action.co2 || 0;
  
  // Обновляю статистику по категориям
  if (action.category) {
    if (!appState.statsByCategory) appState.statsByCategory = {};
    if (!appState.statsByCategory[action.category]) {
      appState.statsByCategory[action.category] = 0;
    }
    appState.statsByCategory[action.category] += action.amount || 0;
  }
  
  // Обновляю достижения
  appState.achievements.forEach(ach => {
    if (ach.earned) return;
    
    if (ach.id === 1) ach.progress += action.amount || 0;
    if (ach.id === 2 && action.category === 'бумага') ach.progress += action.amount || 0;
    if (ach.id === 4 && action.category === 'металл') ach.progress += action.amount || 0;
    if (ach.id === 5 && action.category === 'стекло') ach.progress += action.amount || 0;
    if (ach.id === 6 && action.category === 'бумага') ach.progress += action.amount || 0;
    if (ach.id === 7) ach.progress += action.amount || 0;
    
    if (ach.progress >= ach.goal) {
      ach.earned = true;
    }
  });
  
  // Обновляю streak
  updateStreak();
  
  // Обновляю уровень
  updateLevel();
  
  // Обновляю таблицу лидеров
  appState.leaderboard[2].points = appState.user.totalPoints;
  
  persist();
  return newAction;
}

// Получить данные для главной
export function getDashboardData() {
  const today = getToday();
  const todayActions = appState.actions.filter(a => a.date === today);
  const weekActions = appState.actions.filter(a => {
    const date = new Date(a.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  });
  
  return {
    user: appState.user,
    todayActions,
    weekActions,
    achievements: appState.achievements.filter(a => a.earned).slice(0, 5),
    statsByCategory: appState.statsByCategory || {}
  };
}

// Получить статистику
export function getStatsData() {
  const byCategory = appState.statsByCategory || {};
  return {
    metal: byCategory.metal || 0,
    paper: byCategory.бумага || 0,
    glass: byCategory.стекло || 0,
    hazardous: byCategory.опасные || 0,
    totalPoints: appState.user.totalPoints,
    level: appState.user.level,
    co2Saved: appState.user.co2Saved,
    streakDays: appState.user.streakDays
  };
}

/**
 * Получить данные пользователя
 * @returns {Object} Данные пользователя
 */
export function getUserData() {
  return { ...appState.user };
}

// Получить достижения
export function getAchievements() {
  return appState.achievements;
}

// Получить таблицу лидеров
export function getLeaderboard() {
  return appState.leaderboard;
}

// Обновить профиль
export function updateProfile(data) {
  appState.user = { ...appState.user, ...data };
  persist();
  return appState.user;
}

// Обновить аватар
export function updateAvatar(avatar) {
  appState.user.avatar = avatar;
  persist();
}
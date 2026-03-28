/**
 * 🧭 router.js
 * Маршрутизация SPA с проверкой авторизации
 */

import { isAuthenticated } from "./authService.js";

let routes = {};
let defaultRoute = '/auth'; // По умолчанию страница входа

export function initRouter() {
  routes = {
    '/auth': () => import('../modules/auth/authUI.js').then(m => m.renderAuthUI()),
    '/': () => import('../modules/dashboard/dashboardUI.js').then(m => m.renderDashboardUI()),
    '/waste_sort': () => import('../modules/waste_sort/wasteSortUI.js').then(m => m.renderWasteSortUI()),
    '/recycling_map': () => import('../modules/recycling_map/recyclingMapUI.js').then(m => m.renderRecyclingMapUI()),
    '/stats': () => import('../modules/stats/statsUI.js').then(m => m.renderStatsUI()),
    '/profile': () => import('../modules/profile/profileUI.js').then(m => m.renderProfileUI())
  };

  window.addEventListener('popstate', handleRoute);
  handleRoute();
}

export function navigate(path) {
  history.pushState({}, '', path);
  handleRoute();
}

function handleRoute() {
  const path = window.location.pathname;
  console.log('📍 Current path:', path);
  
  // Проверяю авторизацию
  const isAuthPage = path === '/auth';
  const userAuthenticated = isAuthenticated();
  
  // Если пользователь не авторизован и пытается зайти не на страницу входа
  if (!userAuthenticated && !isAuthPage) {
    console.log('🔐 Not authenticated, redirecting to login');
    navigate('/auth');
    return;
  }
  
  // Если пользователь авторизован и пытается зайти на страницу входа
  if (userAuthenticated && isAuthPage) {
    console.log('✅ Already logged in, redirecting to home');
    navigate('/');
    return;
  }
  
  const route = routes[path] ? path : defaultRoute;
  
  // Подсвечиваю активную вкладку в нижнем меню (только если не на странице входа)
  if (!isAuthPage) {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-path') === route);
    });
  }
  
  routes[route]();
}
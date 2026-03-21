/**
 * 🧭 router.js
 * Маршрутизация SPA
 */

let routes = {};
let defaultRoute = '/'; // Главная по умолчанию

export function initRouter() {
  routes = {
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
  
  const route = routes[path] ? path : defaultRoute;
  
  // Подсвечиваю активную вкладку в нижнем меню
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-path') === route);
  });
  
  routes[route]();
}
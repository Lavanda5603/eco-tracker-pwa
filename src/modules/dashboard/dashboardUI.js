/**
 * 🌱 dashboardUI.js
 * Главный экран
 */

(function loadCSS() {
  if (!document.querySelector('link[href*="dashboard.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/modules/dashboard/dashboard.css';
    document.head.appendChild(link);
  }
})();

import { getMainContainer } from "../../core/uiContainer.js";
import { getDashboardData, getAchievements } from "../../core/dataService.js";
import { navigate } from "../../core/router.js";

export function renderDashboardUI() {
  const container = getMainContainer();
  if (!container) return;

  const data = getDashboardData();
  const achievements = getAchievements().filter(a => a.earned);
  
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const weekActivity = weekDays.map(day => {
    const count = data.weekActions.filter(a => {
      const date = new Date(a.date);
      const dayName = weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1];
      return dayName === day;
    }).length;
    return count;
  });

  container.innerHTML = `
    <div class="dashboard-container">
      <!-- Верхняя панель -->
      <div class="dashboard-header">
        <button class="icon-btn" id="profileBtn">
          <img src="/public/icons/custom/profile-icon.png" alt="Профиль" class="icon-btn-img">
        </button>
        <div class="logo">ECOTRACKER</div>
        <button class="icon-btn" id="notifyBtn">
          <img src="/public/icons/custom/bell-icon.png" alt="Уведомления" class="icon-btn-img">
        </button>
      </div>

      <!-- Карточка Мой эко-след -->
      <div class="eco-card">
        <div class="eco-card-outer">
          <div class="eco-card-inner">
            <h2>МОЙ ЭКО-СЛЕД</h2>
            <div class="trees-row">
              <img src="/public/icons/trees/tree-small.png" alt="Маленькое дерево" class="tree-icon small">
              <img src="/public/icons/trees/tree-medium.png" alt="Среднее дерево" class="tree-icon medium">
              <img src="/public/icons/trees/tree-large.png" alt="Большое дерево" class="tree-icon large">
            </div>
            <div class="day-counter">День ${data.user.streakDays || 1}</div>
          </div>
          <div class="divider-line"></div>
          <div class="co2-stats">
            <p>● ${data.user.co2Saved || 0} кг CO₂ сэкономлено</p>
            <div class="dotted-line"></div>
            <p>● Цель: ${data.user.co2Goal} кг</p>
          </div>
        </div>
      </div>

      <!-- Активность за неделю -->
      <div class="week-card">
        <h3>Эко-активность за неделю</h3>
        <div class="week-grid">
          ${weekDays.map((day, i) => `
            <div>
              <span>${day}</span>
              <b>${'┃'.repeat(Math.min(4, weekActivity[i]))}</b>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Последние действия -->
      <div class="actions-card">
        <h3>Последние действия</h3>
        <ul class="actions-list">
          ${data.todayActions.slice(0, 3).map(action => {
            let iconPath = '';
            const actionText = action.action.toLowerCase();

            if (actionText.includes('батарей')) {
              iconPath = '/public/icons/actions/battery.png';
            } else if (actionText.includes('стекл') || actionText.includes('бутылк')) {
              iconPath = '/public/icons/actions/glass.png';
            } else if (actionText.includes('металл') || actionText.includes('банк') || actionText.includes('консервн')) {
              iconPath = '/public/icons/actions/metal.png';
            } else if (actionText.includes('бумаг') || actionText.includes('газет') || actionText.includes('картон')) {
              iconPath = '/public/icons/actions/paper.png';
            } else if (actionText.includes('пластик') || actionText.includes('тетрапак')) {
              iconPath = '/public/icons/actions/plastic.png';
            } else if (actionText.includes('ламп') || actionText.includes('опасн')) {
              iconPath = '/public/icons/actions/hazardous.png';
            }

            return `
              <li>
                <span class="action-item">
                  ${iconPath ? `<img src="${iconPath}" alt="action" class="action-icon">` : ''}
                  ${action.action}
                </span>
                <strong class="action-points">+${action.points || 0}</strong>
              </li>
            `;
          }).join('')}
          ${data.todayActions.length === 0 ? '<li class="empty">Пока нет действий сегодня</li>' : ''}
          <li class="all-link" id="toStatsBtn">
            <span class="action-item">
              <img src="/public/icons/actions/achievements.png" alt="Достижения" class="action-icon" style="width: 36px; height: 36px;">
              Все достижения
            </span>
            <strong>→</strong>
          </li>
        </ul>
      </div>

      <!-- Достижения -->
      <div class="achievements-card">
        <h3>★ Достижения (${achievements.length}/${getAchievements().length})</h3>
        <div class="badges">
          ${achievements.slice(0, 5).map(ach => {
            let achIcon = '/public/icons/achievements/default.png';
            if (ach.id === 1) achIcon = '/public/icons/achievements/step1.png';
            if (ach.id === 2) achIcon = '/public/icons/achievements/forest.png';
            if (ach.id === 3) achIcon = '/public/icons/achievements/energy.png';
            if (ach.id === 4) achIcon = '/public/icons/achievements/metal.png';
            if (ach.id === 5) achIcon = '/public/icons/achievements/glass.png';
            if (ach.id === 6) achIcon = '/public/icons/achievements/paper.png';
            if (ach.id === 7) achIcon = '/public/icons/achievements/hero.png';
            
            return `
              <span class="earned" title="${ach.name}">
                <img src="${achIcon}" alt="achievement" class="achievement-icon">
              </span>
            `;
          }).join('')}
          ${[...Array(Math.max(0, 5 - achievements.length))].map(() => 
            '<span class="locked">✕</span>'
          ).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('profileBtn').addEventListener('click', () => navigate('/profile'));
  document.getElementById('notifyBtn').addEventListener('click', () => alert('🔔 Уведомления в разработке'));
  document.getElementById('toStatsBtn').addEventListener('click', () => navigate('/stats'));
}
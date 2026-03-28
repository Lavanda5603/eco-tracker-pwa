/**
 * 📊 statsUI.js
 * Статистика с реальными данными
 */

(function loadCSS() {
  if (!document.querySelector('link[href*="stats.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/modules/stats/stats.css';
    document.head.appendChild(link);
  }
})();

import { getMainContainer } from "../../core/uiContainer.js";
import { getStatsData, getAchievements, getLeaderboard, getUserData } from "../../core/dataService.js";
import { navigate } from "../../core/router.js";

export function renderStatsUI() {
  const container = getMainContainer();
  if (!container) return;

  const stats = getStatsData();
  const achievements = getAchievements();
  let leaderboard = getLeaderboard();
  const user = getUserData();

  leaderboard = [...leaderboard].sort((a, b) => b.points - a.points);
  
  const userIndex = leaderboard.findIndex(item => item.isCurrentUser);
  if (userIndex !== -1) {
    leaderboard[userIndex].points = stats.totalPoints;
    leaderboard[userIndex].name = 'Вы';
    leaderboard.sort((a, b) => b.points - a.points);
  }

  const metalPercent = Math.min(100, Math.round((stats.metal / 500) * 100));
  const paperPercent = Math.min(100, Math.round((stats.paper / 500) * 100));
  const glassPercent = Math.min(100, Math.round((stats.glass / 500) * 100));
  const hazardousPercent = Math.min(100, Math.round((stats.hazardous / 100) * 100));

  container.innerHTML = `
    <div class="stats-container">
      <div class="header-with-back">
        <button class="back-btn" data-path="/">←</button>
        <h2>МОЯ СТАТИСТИКА</h2>
      </div>

      <div class="stats-profile">
        <img src="/public/icons/custom/profile-icon.png" alt="profile" class="stats-profile-icon">
        <div class="stats-user-info">
          <h3>${user.name}</h3>
          <p>${stats.totalPoints} баллов</p>
          <p>${stats.streakDays} дней подряд</p>
        </div>
      </div>

      <h3 class="section-title">Статистика по категориям</h3>
      
      <div class="stats-category">
        <div class="category-header">
          <span><img src="/public/icons/materials/metal.png" alt="metal" class="cat-icon-img"> Металл</span>
          <strong>${stats.metal} кг / 500 кг</strong>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${metalPercent}%"></div>
        </div>
        <div class="category-percent">${metalPercent}%</div>
      </div>

      <div class="stats-category dark">
        <div class="category-header">
          <span><img src="/public/icons/materials/paper.png" alt="paper" class="cat-icon-img"> Бумага</span>
          <strong>${stats.paper} кг / 500 кг</strong>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${paperPercent}%"></div>
        </div>
        <div class="category-percent">${paperPercent}%</div>
      </div>

      <div class="stats-category">
        <div class="category-header">
          <span><img src="/public/icons/materials/glass.png" alt="glass" class="cat-icon-img"> Стекло</span>
          <strong>${stats.glass} кг / 500 кг</strong>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${glassPercent}%"></div>
        </div>
        <div class="category-percent">${glassPercent}%</div>
      </div>

      <div class="stats-category dark">
        <div class="category-header">
          <span><img src="/public/icons/materials/battery.png" alt="hazardous" class="cat-icon-img"> Опасные</span>
          <strong>${stats.hazardous} кг / 100 кг</strong>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${hazardousPercent}%"></div>
        </div>
        <div class="category-percent">${hazardousPercent}%</div>
      </div>

      <h3 class="section-title">Достижения</h3>
      <div class="achievements-list">
        ${achievements.map(ach => {
          let achIcon = '/public/icons/achievements/default.png';
          if (ach.id === 1) achIcon = '/public/icons/achievements/step1.png';
          if (ach.id === 2) achIcon = '/public/icons/achievements/forest.png';
          if (ach.id === 3) achIcon = '/public/icons/achievements/energy.png';
          if (ach.id === 4) achIcon = '/public/icons/achievements/metal.png';
          if (ach.id === 5) achIcon = '/public/icons/achievements/glass.png';
          if (ach.id === 6) achIcon = '/public/icons/achievements/paper.png';
          if (ach.id === 7) achIcon = '/public/icons/achievements/hero.png';
          
          return `
            <div class="achievement-card ${ach.earned ? 'earned' : 'locked'}">
              <div class="achievement-icon">
                <img src="${achIcon}" alt="achievement" style="width: 36px; height: 36px; object-fit: contain;">
              </div>
              <div class="achievement-content">
                <h4>${ach.name}</h4>
                <p>${ach.description}</p>
                ${ach.earned 
                  ? '<small class="earned-badge">✓ ПОЛУЧЕНО</small>' 
                  : `<small>${ach.progress || 0}/${ach.goal}</small>`
                }
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <h3 class="section-title">Таблица лидеров</h3>
      <div class="leaderboard-simple">
        ${leaderboard.map((person, index) => `
          <div class="leader-simple-item ${person.isCurrentUser ? 'current-user' : ''}">
            <span class="leader-simple-place">${index + 1}</span>
            <span class="leader-simple-name">${person.name}</span>
            <span class="leader-simple-points">${person.points}</span>
          </div>
        `).join('')}
      </div>

      <!-- Кнопка очистки истории -->
      <button id="clear-history-btn" class="clear-history-btn">Очистить историю</button>
    </div>
  `;

  document.querySelector('.back-btn').addEventListener('click', () => navigate('/'));
  
  // Обработчик кнопки очистки
  document.getElementById('clear-history-btn').addEventListener('click', async () => {
    if (confirm('Вы уверены, что хотите очистить всю историю действий? Это действие нельзя отменить.')) {
      // Импортирую функцию очистки из dataService
      const { clearHistory } = await import('../../core/dataService.js');
      clearHistory();
      // Перерисовываю страницу
      renderStatsUI();
    }
  });
}

function getNextLevelPoints(level) {
  const levels = [100, 250, 500, 1000, 2000];
  return levels[level - 1] || 2000;
}

function getLevelProgress(points) {
  if (points < 100) return (points / 100) * 100;
  if (points < 250) return ((points - 100) / 150) * 100;
  if (points < 500) return ((points - 250) / 250) * 100;
  if (points < 1000) return ((points - 500) / 500) * 100;
  return 100;
}
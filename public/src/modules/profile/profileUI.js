/**
 * 👤 profileUI.js
 * Профиль с редактированием и настройками
 */

(function loadCSS() {
  if (!document.querySelector('link[href*="profile.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/modules/profile/profile.css';
    document.head.appendChild(link);
  }
})();

import { getMainContainer } from "../../core/uiContainer.js";
import { getUserData, updateProfile, updateAvatar } from "../../core/dataService.js";
import { navigate } from "../../core/router.js";
import { getSession, logout as authLogout } from "../../core/authService.js";

// Состояние темы
let isDarkTheme = localStorage.getItem('theme') === 'dark';

export function renderProfileUI() {
  const container = getMainContainer();
  if (!container) return;

  const user = getUserData();
  
  // Получаю email из сессии Supabase
  const session = getSession();
  const userEmail = session?.user?.email || user.email;

  container.innerHTML = `
    <div class="profile-container">
      <div class="header-with-back">
        <button class="back-btn" data-path="/">←</button>
        <h2>ПРОФИЛЬ</h2>
      </div>

      <!-- Аватар -->
      <div class="profile-avatar-section">
        <div class="profile-avatar-large" id="avatarContainer">
          ${user.avatar 
            ? `<img src="${user.avatar}" alt="avatar" class="avatar-image">` 
            : '<img src="/public/icons/custom/profile-icon.png" alt="profile" class="avatar-image" style="width: 60px; height: 60px; object-fit: contain;">'
          }
        </div>
        <input type="file" id="avatarInput" accept="image/*" hidden>
        <button class="edit-avatar-btn" id="editAvatarBtn">Редактировать</button>
        <h3 class="profile-name-large" id="displayName">${user.name}</h3>
        <p class="profile-join-date">На эко-тропе с ${formatDate(user.joinDate)}</p>
      </div>

      <!-- Мои данные (редактируемые) -->
      <h3 class="section-title">Мои данные</h3>
      <div class="data-card" id="dataCard">
        <div class="data-item">
          <span class="data-icon">
            <img src="/public/icons/profile/name.png" alt="name" style="width: 28px; height: 28px;">
          </span>
          <input type="text" class="data-input" id="nameInput" value="${user.name}" placeholder="Имя">
        </div>
        <div class="data-item">
          <span class="data-icon">
            <img src="/public/icons/profile/email.png" alt="email" style="width: 28px; height: 24px;">
          </span>
          <input type="email" class="data-input" id="emailInput" value="${userEmail}" placeholder="Email">
        </div>
        <div class="data-item">
          <span class="data-icon">
            <img src="/public/icons/profile/city.png" alt="city" style="width: 26px; height: 28px;">
          </span>
          <input type="text" class="data-input" id="cityInput" value="${user.city || 'Санкт-Петербург'}" placeholder="Город">
        </div>
        <div class="data-item">
          <span class="data-icon">
            <img src="/public/icons/profile/birthday.png" alt="birthday" style="width: 28px; height: 28px;">
          </span>
          <input type="date" class="data-input" id="birthInput" value="${user.birthdate || '1990-01-01'}">
        </div>
      </div>

      <!-- Настройки (рабочие) -->
      <h3 class="section-title">Настройки</h3>
      <div class="settings-card">
        <div class="setting-item">
          <span>
            <img src="/public/icons/profile/notifications.png" alt="notifications" style="width: 28px; height: 28px; margin-right: 10px;">
            Уведомления
          </span>
          <label class="switch">
            <input type="checkbox" id="notificationsToggle" ${localStorage.getItem('notifications') === 'on' ? 'checked' : ''}>
            <span class="slider round"></span>
          </label>
        </div>
        <div class="setting-item">
          <span>
            <img src="/public/icons/profile/theme.png" alt="theme" style="width: 28px; height: 28px; margin-right: 10px;">
            Тёмная тема
          </span>
          <label class="switch">
            <input type="checkbox" id="themeToggle" ${isDarkTheme ? 'checked' : ''}>
            <span class="slider round"></span>
          </label>
        </div>
        <div class="setting-item">
          <span>
            <img src="/public/icons/profile/location.png" alt="location" style="width: 28px; height: 28px; margin-right: 10px;">
            Геолокация
          </span>
          <label class="switch">
            <input type="checkbox" id="geoLocationToggle" ${localStorage.getItem('geolocation') === 'on' ? 'checked' : ''}>
            <span class="slider round"></span>
          </label>
        </div>
        <div class="setting-item">
          <span>
            <img src="/public/icons/profile/offline.png" alt="offline" style="width: 28px; height: 28px; margin-right: 10px;">
            Офлайн-режим
          </span>
          <label class="switch">
            <input type="checkbox" id="offlineToggle" ${localStorage.getItem('offline') === 'on' ? 'checked' : ''}>
            <span class="slider round"></span>
          </label>
        </div>
      </div>

      <!-- Кнопка сохранения -->
      <button class="save-profile-btn" id="saveProfileBtn">Сохранить изменения</button>

      <!-- Меню -->
      <button class="menu-item" data-path="/stats">
        <span>Мои достижения</span>
        <span>→</span>
      </button>
      <button class="menu-item" id="helpBtn">
        <span>Помощь и обратная связь</span>
        <span>→</span>
      </button>
      <button class="menu-item" id="aboutBtn">
        <span>О приложении</span>
        <span>→</span>
      </button>

      <!-- Монетизация -->
      <button class="menu-item donate" id="donateBtn">
        <span>Поддержать проект</span>
        <span>→</span>
      </button>

      <button class="menu-item logout" id="logoutBtn">
        <span>Выйти</span>
        <span>→</span>
      </button>
    </div>
  `;

  // Назад
  document.querySelector('.back-btn').addEventListener('click', () => navigate('/'));

  // Аватар
  document.getElementById('editAvatarBtn').addEventListener('click', () => {
    document.getElementById('avatarInput').click();
  });

  document.getElementById('avatarInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateAvatar(event.target.result);
        renderProfileUI();
      };
      reader.readAsDataURL(file);
    }
  });

  // Сохранение профиля
  document.getElementById('saveProfileBtn').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const city = document.getElementById('cityInput').value;
    const birthdate = document.getElementById('birthInput').value;
    
    updateProfile({ name, email, city, birthdate });
    
    document.getElementById('displayName').textContent = name;
    
    const btn = document.getElementById('saveProfileBtn');
    btn.textContent = '✓ Сохранено!';
    setTimeout(() => {
      btn.textContent = 'Сохранить изменения';
    }, 2000);
  });

  // Тёмная тема
  document.getElementById('themeToggle').addEventListener('change', (e) => {
    isDarkTheme = e.target.checked;
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  });

  // Уведомления
  document.getElementById('notificationsToggle').addEventListener('change', (e) => {
    localStorage.setItem('notifications', e.target.checked ? 'on' : 'off');
    if (e.target.checked) {
      alert('Уведомления включены (тест)');
    }
  });

  // Геолокация
  document.getElementById('geoLocationToggle').addEventListener('change', (e) => {
    if (e.target.checked && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          localStorage.setItem('geolocation', 'on');
          alert(`Местоположение получено`);
        },
        () => {
          alert('Доступ к геолокации запрещён');
          e.target.checked = false;
        }
      );
    } else {
      localStorage.setItem('geolocation', 'off');
    }
  });

  // Офлайн режим
  document.getElementById('offlineToggle').addEventListener('change', (e) => {
    localStorage.setItem('offline', e.target.checked ? 'on' : 'off');
    if (e.target.checked) {
      alert('Офлайн-режим: приложение будет кэшироваться');
    }
  });

  // Статистика
  document.querySelector('[data-path="/stats"]').addEventListener('click', () => navigate('/stats'));

  // Помощь
  document.getElementById('helpBtn').addEventListener('click', () => {
    alert('Помощь и обратная связь\n\nПо всем вопросам: eco-tracker@support.ru\n\nTelegram: @ecotracker_bot');
  });

  // О приложении
  document.getElementById('aboutBtn').addEventListener('click', () => {
    alert('Eco Tracker v1.0\n\nПриложение для отслеживания эко-привычек\nи сортировки отходов.\n\nРазработано с любовью к природе 🌱');
  });

  // Выход
  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Выйти из профиля? Все данные сохранятся.')) {
      // Очищаю все данные
      localStorage.removeItem('eco_tracker_app');
      localStorage.removeItem('supabase_session');
      localStorage.removeItem('theme');
      localStorage.removeItem('notifications');
      localStorage.removeItem('geolocation');
      localStorage.removeItem('offline');
      // Перезагружаю страницу
      window.location.href = '/auth';
    }
  });
  
  // Поддержка проекта
  const donateBtn = document.getElementById('donateBtn');
  if (donateBtn) {
    donateBtn.addEventListener('click', () => {
      window.open('https://t.me/yegaaaaaaa', '_blank');
    });
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Применяю сохранённую тему при загрузке
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-theme');
}
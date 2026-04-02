/**
 * 🖼️ uiContainer.js
 * Базовая оболочка - со своими иконками
 */

import { navigate } from "./router.js";

export function initUI() {
  const app = document.getElementById("app");
  
  app.innerHTML = `
    <div class="app-container">
      <!-- Основной контент -->
      <main id="main-content" class="main-content"></main>

      <!-- Нижняя навигация со своими иконками -->
      <nav class="bottom-nav">
        <a href="#" data-path="/waste_sort" class="nav-item">
          <img src="/public/icons/custom/sort-icon.png" alt="Сортировка" class="nav-icon-img">
          <span class="nav-label">Сортировка</span>
        </a>
        <a href="#" data-path="/recycling_map" class="nav-item">
          <img src="/public/icons/custom/map-icon.png" alt="Карта" class="nav-icon-img">
          <span class="nav-label">Карта</span>
        </a>
        <a href="#" data-path="/stats" class="nav-item">
          <img src="/public/icons/custom/stats-icon.png" alt="Статистика" class="nav-icon-img">
          <span class="nav-label">Статистика</span>
        </a>
      </nav>
    </div>
  `;

  // Обработчики навигации
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('data-path');
      navigate(path);
    });
  });
}

export function getMainContainer() {
  return document.getElementById('main-content');
}
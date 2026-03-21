/**
 * 🗑️ wasteSortUI.js
 * Экран сортировки с добавлением действий
 */

(function loadCSS() {
  if (!document.querySelector('link[href*="wasteSort.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/modules/waste_sort/wasteSort.css';
    document.head.appendChild(link);
  }
})();

import { getMainContainer } from "../../core/uiContainer.js";
import { getWasteDatabase } from "./wasteData.js";
import { addAction } from "../../core/dataService.js";
import { navigate } from "../../core/router.js";

export function renderWasteSortUI() {
  const container = getMainContainer();
  if (!container) return;

  const wasteDB = getWasteDatabase();
  const categories = [...new Set(wasteDB.map(item => item.category))];

  container.innerHTML = `
    <div class="waste-container">
      <div class="header-with-back">
        <button class="back-btn" data-path="/">←</button>
        <h2>СОРТИРОВКА</h2>
      </div>

      <div class="search-section">
        <div class="search-label">⌕ Поиск</div>
        <input type="text" class="search-input" placeholder="Что выбросить?" id="searchInput">
      </div>

      <h3 class="section-title">Популярные категории</h3>
      <div class="categories-grid" id="categoriesGrid">
        ${categories.map(cat => `
          <div class="category-card ${cat === 'опасные' ? 'danger' : ''}" data-category="${cat}">
            <span class="category-icon">${getCategoryIcon(cat)}</span>
            <span class="category-name">${getCategoryName(cat)}</span>
          </div>
        `).join('')}
      </div>

      <h3 class="section-title">Результаты поиска</h3>
      <div class="results-list" id="resultsList">
        ${renderWasteItems(wasteDB)}
      </div>
    </div>
  `;

  // Назад
  document.querySelector('.back-btn').addEventListener('click', () => navigate('/'));

  // Поиск
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = wasteDB.filter(item => 
      item.name.toLowerCase().includes(query)
    );
    document.getElementById('resultsList').innerHTML = renderWasteItems(filtered);
    attachDetailListeners();
  });

  // Категории
  document.querySelectorAll('[data-category]').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      const filtered = wasteDB.filter(item => item.category === category);
      document.getElementById('resultsList').innerHTML = renderWasteItems(filtered);
      attachDetailListeners();
    });
  });

  // Кнопки "Сдал"
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('done-btn')) {
      const itemId = Number(e.target.dataset.id);
      const item = wasteDB.find(i => i.id === itemId);
      if (item && !e.target.disabled) {
        addAction({
          action: item.name,
          points: item.points,
          category: item.category,
          amount: 1,
          co2: item.points * 2
        });
        
        e.target.textContent = '✓ Сдано';
        e.target.disabled = true;
        e.target.style.background = '#4CAF50';
        
        showNotification(`+${item.points} баллов!`);
      }
    }
  });

  attachDetailListeners();
}

function renderWasteItems(items) {
  if (items.length === 0) {
    return '<p class="no-results">Ничего не найдено</p>';
  }
  
  return items.map(item => {
    let iconPath = '/public/icons/waste/default.png';
    if (item.category === 'металл') iconPath = '/public/icons/waste/metal.png';
    if (item.category === 'бумага') iconPath = '/public/icons/waste/paper.png';
    if (item.category === 'стекло') iconPath = '/public/icons/waste/glass.png';
    if (item.category === 'опасные') iconPath = '/public/icons/waste/hazardous.png';
    if (item.category === 'пластик') iconPath = '/public/icons/waste/plastic.png';
    
    return `
      <div class="result-item" data-item-id="${item.id}">
        <div class="result-icon">
          <img src="${iconPath}" alt="${item.category}" style="width: 40px; height: 40px; object-fit: contain;">
        </div>
        <div class="result-content">
          <h4>${item.name}</h4>
          <p>${item.category} → ${item.instructions}</p>
          <div class="result-actions">
            <small class="details-link" data-id="${item.id}" data-name="${item.name}" data-category="${item.category}" data-instructions="${item.instructions}" data-points="${item.points}">Подробнее</small>
            <button class="done-btn" data-id="${item.id}">✓ Сдал (+${item.points})</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function attachDetailListeners() {
  document.querySelectorAll('.details-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = e.target.dataset.id;
      const name = e.target.dataset.name;
      const category = e.target.dataset.category;
      const instructions = e.target.dataset.instructions;
      const points = e.target.dataset.points;
      
      showDetailModal(name, category, instructions, points);
    });
  });
}

function showDetailModal(name, category, instructions, points) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  document.body.appendChild(overlay);
  
  let iconPath = '/public/icons/waste/default.png';
  if (category === 'металл') iconPath = '/public/icons/waste/metal.png';
  if (category === 'бумага') iconPath = '/public/icons/waste/paper.png';
  if (category === 'стекло') iconPath = '/public/icons/waste/glass.png';
  if (category === 'опасные') iconPath = '/public/icons/waste/hazardous.png';
  if (category === 'пластик') iconPath = '/public/icons/waste/plastic.png';
  
  const modal = document.createElement('div');
  modal.className = 'detail-modal';
  modal.innerHTML = `
    <h3>${name}</h3>
    <div style="display: flex; align-items: center; gap: 16px; margin: 16px 0;">
      <img src="${iconPath}" alt="${category}" style="width: 48px; height: 48px; object-fit: contain;">
      <div>
        <p><strong>Категория:</strong> ${getCategoryName(category)}</p>
        <p><strong>Инструкция:</strong> ${instructions}</p>
        <p><strong>Баллы:</strong> +${points}</p>
      </div>
    </div>
    <p style="font-size: 14px; color: #666; margin: 16px 0;">Сдай это и получи ${points} баллов!</p>
    <button class="modal-close">Закрыть</button>
  `;
  
  document.body.appendChild(modal);
  
  const closeModal = () => {
    modal.remove();
    overlay.remove();
  };
  
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--green);
    color: white;
    padding: 16px 24px;
    border-radius: 40px;
    font-size: 20px;
    font-weight: bold;
    z-index: 1000;
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    animation: slideUp 1.5s forwards;
    display: flex;
    align-items: center;
    gap: 12px;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 1500);
}

function getCategoryIcon(cat) {
  const icons = {
    'металл': '<img src="/public/icons/waste/metal.png" style="width: 32px; height: 32px; object-fit: contain;">',
    'бумага': '<img src="/public/icons/waste/paper.png" style="width: 32px; height: 32px; object-fit: contain;">',
    'стекло': '<img src="/public/icons/waste/glass.png" style="width: 32px; height: 32px; object-fit: contain;">',
    'опасные': '<img src="/public/icons/waste/hazardous.png" style="width: 32px; height: 32px; object-fit: contain;">',
    'пластик': '<img src="/public/icons/waste/plastic.png" style="width: 32px; height: 32px; object-fit: contain;">'
  };
  return icons[cat] || '📦';
}

function getCategoryName(cat) {
  const names = {
    'металл': 'Металл',
    'бумага': 'Бумага',
    'стекло': 'Стекло',
    'опасные': 'Опасные',
    'пластик': 'Пластик'
  };
  return names[cat] || cat;
}

// Анимация
const style = document.createElement('style');
style.textContent = `
@keyframes slideUp {
  0% { opacity: 0; transform: translate(-50%, 0); }
  20% { opacity: 1; transform: translate(-50%, -50%); }
  80% { opacity: 1; transform: translate(-50%, -50%); }
  100% { opacity: 0; transform: translate(-50%, -80%); }
}`;
document.head.appendChild(style);
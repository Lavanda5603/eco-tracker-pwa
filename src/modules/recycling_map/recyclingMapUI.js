/**
 * 🗺️ recyclingMapUI.js
 * Карта с реальными точками и геолокацией
 */

(function loadCSS() {
  if (!document.querySelector('link[href*="recyclingMap.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/modules/recycling_map/recyclingMap.css';
    document.head.appendChild(link);
  }
})();

import { getMainContainer } from "../../core/uiContainer.js";
import { getAllPoints, getNearestPoints } from "./mapPointsData.js";
import { addAction } from "../../core/dataService.js";
import { navigate } from "../../core/router.js";

let userLocation = null;

export function renderRecyclingMapUI() {
  const container = getMainContainer();
  if (!container) return;

  const points = getAllPoints();

  container.innerHTML = `
    <div class="map-container">
      <div class="header-with-back">
        <button class="back-btn" data-path="/">←</button>
        <h2>КАРТА ПРИЁМА</h2>
      </div>

      <div class="location-header">
        <span class="location-icon">
          <img src="/public/icons/map/location-icon.png" alt="location">
        </span>
        <span class="location-text">Екатеринбург</span>
      </div>

      <button class="nearby-btn" id="nearbyBtn">
        НАЙТИ РЯДОМ СО МНОЙ
      </button>

      <div id="yandex-map" class="map-placeholder">
        <div class="map-loading">Загрузка карты...</div>
      </div>

      <h3 class="section-title">Ближайшие пункты</h3>
      <div class="points-list" id="pointsList">
        ${renderPointsList(points.slice(0, 5))}
      </div>
    </div>
  `;

  document.querySelector('.back-btn').addEventListener('click', () => navigate('/'));

  document.getElementById('nearbyBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
      document.getElementById('nearbyBtn').textContent = 'ОПРЕДЕЛЯЕМ...';
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          const nearest = getNearestPoints(userLocation.lat, userLocation.lng, 5);
          document.getElementById('pointsList').innerHTML = renderPointsList(nearest);
          
          document.getElementById('nearbyBtn').innerHTML = `
            <span class="nearby-icon">
              <img src="/public/icons/map/check-icon.png" alt="check">
            </span>
            НАЙДЕНО РЯДОМ
          `;
          setTimeout(() => {
            document.getElementById('nearbyBtn').textContent = 'НАЙТИ РЯДОМ СО МНОЙ';
          }, 3000);
          
          addAction({
            action: 'Использовал геолокацию',
            points: 1
          });
        },
        (error) => {
          alert('Не удалось определить местоположение. Разрешите доступ к геолокации.');
          document.getElementById('nearbyBtn').textContent = 'НАЙТИ РЯДОМ СО МНОЙ';
        }
      );
    } else {
      alert('Геолокация не поддерживается вашим браузером');
    }
  });

  loadYandexMaps(points);
}

function renderPointsList(points) {
  return points.map(point => `
    <div class="point-card ${point.distance < 500 ? 'near' : ''}">
      <h4>${point.name}</h4>
      <p class="point-address">${point.address}</p>
      <div class="point-materials">
        ${point.materials.map(m => `
          <span class="material-icon-text">
            <img src="${getMaterialIcon(m)}" alt="material" style="width: 20px; height: 20px;">
            ${m}
          </span>
        `).join('')}
      </div>
      <div class="point-footer">
        <span class="point-distance">● ${Math.round(point.distance)} м</span>
        <button class="route-btn" data-address="${point.address}" data-name="${point.name}">
          Маршрут
        </button>
      </div>
    </div>
  `).join('');
}

function getMaterialIcon(material) {
  const icons = {
    'Металл': '/public/icons/materials/metal.png',
    'Бумага': '/public/icons/materials/paper.png',
    'Стекло': '/public/icons/materials/glass.png',
    'Батарейки': '/public/icons/materials/battery.png',
    'Лампочки': '/public/icons/materials/bulb.png',
    'Аккумуляторы': '/public/icons/materials/battery.png',
    'Пластик': '/public/icons/materials/plastic.png',
    'Тетрапак': '/public/icons/materials/plastic.png',
    'Картон': '/public/icons/materials/paper.png'
  };
  return icons[material] || '/public/icons/materials/paper.png';
}

function loadYandexMaps(points) {
  if (!document.querySelector('script[src*="api-maps.yandex.ru"]')) {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш_ключ&lang=ru_RU';
    script.onload = () => initMap(points);
    document.head.appendChild(script);
  } else if (window.ymaps) {
    initMap(points);
  }
}

function initMap(points) {
  window.ymaps.ready(() => {
    const mapContainer = document.getElementById('yandex-map');
    if (!mapContainer) return;
    
    mapContainer.innerHTML = '';
    mapContainer.style.height = '250px';
    
    const map = new window.ymaps.Map(mapContainer, {
      center: [56.8389, 60.6057],
      zoom: 12,
      controls: ['zoomControl', 'fullscreenControl']
    });
    
    points.forEach(point => {
      const placemark = new window.ymaps.Placemark(
        [point.lat, point.lng],
        {
          hintContent: point.name,
          balloonContent: `
            <strong>${point.name}</strong><br>
            ${point.address}<br>
            Принимает: ${point.materials.join(', ')}
          `
        },
        {
          iconColor: '#61cdb3',
          preset: 'islands#circleIcon'
        }
      );
      map.geoObjects.add(placemark);
    });
    
    if (userLocation) {
      const userPlacemark = new window.ymaps.Placemark(
        [userLocation.lat, userLocation.lng],
        { hintContent: 'Вы здесь' },
        {
          iconColor: '#0f5b4c',
          preset: 'islands#blueCircleIcon'
        }
      );
      map.geoObjects.add(userPlacemark);
      map.setCenter([userLocation.lat, userLocation.lng], 14);
    }
  });
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('route-btn') || e.target.parentElement?.classList.contains('route-btn')) {
    const btn = e.target.classList.contains('route-btn') ? e.target : e.target.parentElement;
    const address = btn.dataset.address;
    const name = btn.dataset.name;
    const url = `https://yandex.ru/maps/?rtext=~${encodeURIComponent(address)}`;
    window.open(url, '_blank');
    
    addAction({
      action: `Построил маршрут до ${name}`,
      points: 1
    });
  }
});
/**
 * 📍 mapPointsData.js
 * Пункты приёма в Екатеринбурге
 */

export const mapPoints = [
  {
    id: 1,
    name: 'ООО "Вторсырьё"',
    address: 'ул. Ленина, 10',
    lat: 56.8375,
    lng: 60.5983,
    materials: ['Металл', 'Бумага', 'Стекло', 'Батарейки'],
    workingHours: '09:00-20:00',
    phone: '+7 (343) 200-45-67',
    distance: 300
  },
  {
    id: 2,
    name: '"ЭкоПойнт"',
    address: 'ул. Попова, 10',
    lat: 56.8328,
    lng: 60.6039,
    materials: ['Батарейки', 'Лампочки', 'Аккумуляторы'],
    workingHours: '10:00-22:00',
    phone: '+7 (343) 234-56-78',
    distance: 650
  },
  {
    id: 3,
    name: '"Бумажный мир"',
    address: 'ул. Восстания, 5',
    lat: 56.8462,
    lng: 60.6124,
    materials: ['Бумага', 'Картон', 'Металл'],
    workingHours: '09:00-19:00',
    phone: '+7 (343) 345-67-89',
    distance: 1200
  },
  {
    id: 4,
    name: 'Стеклоприём',
    address: 'ул. Малышева, 50',
    lat: 56.8286,
    lng: 60.6081,
    materials: ['Стекло'],
    workingHours: '08:00-18:00',
    phone: '+7 (343) 456-78-90',
    distance: 1800
  },
  {
    id: 5,
    name: 'Пластик-Сервис',
    address: 'ул. Щорса, 25',
    lat: 56.8204,
    lng: 60.6189,
    materials: ['Пластик', 'Тетрапак'],
    workingHours: '09:00-18:00',
    phone: '+7 (343) 567-89-01',
    distance: 2200
  },
  {
    id: 6,
    name: 'Эко-Центр',
    address: 'ул. Белинского, 150',
    lat: 56.8147,
    lng: 60.6258,
    materials: ['Металл', 'Бумага', 'Стекло', 'Батарейки', 'Лампочки'],
    workingHours: '09:00-21:00',
    phone: '+7 (343) 678-90-12',
    distance: 2500
  },
  {
    id: 7,
    name: 'Ртутная безопасность',
    address: 'ул. Фрунзе, 50',
    lat: 56.8253,
    lng: 60.6157,
    materials: ['Батарейки', 'Лампочки', 'Аккумуляторы'],
    workingHours: '10:00-18:00',
    phone: '+7 (343) 789-01-23',
    distance: 1950
  },
  {
    id: 8,
    name: 'Макулатура.ру',
    address: 'ул. Восточная, 15',
    lat: 56.8389,
    lng: 60.6321,
    materials: ['Бумага', 'Картон'],
    workingHours: '09:00-20:00',
    phone: '+7 (343) 890-12-34',
    distance: 2800
  },
  {
    id: 9,
    name: 'Стекло-Сервис',
    address: 'ул. Шевченко, 20',
    lat: 56.8425,
    lng: 60.5876,
    materials: ['Стекло'],
    workingHours: '09:00-19:00',
    phone: '+7 (343) 901-23-45',
    distance: 1100
  },
  {
    id: 10,
    name: 'Металл-Ресурс',
    address: 'ул. Челюскинцев, 100',
    lat: 56.8512,
    lng: 60.5989,
    materials: ['Металл'],
    workingHours: '08:00-17:00',
    phone: '+7 (343) 012-34-56',
    distance: 2100
  }
];

export function getAllPoints() {
  return mapPoints;
}

export function getPointsByMaterials(materials) {
  if (!materials || materials.length === 0) return mapPoints;
  return mapPoints.filter(point => 
    materials.some(m => point.materials.includes(m))
  );
}

export function getNearestPoints(userLat, userLng, limit = 5) {
  if (!userLat || !userLng) return mapPoints.slice(0, limit);
  
  const pointsWithDistance = mapPoints.map(point => {
    const distance = calculateDistance(userLat, userLng, point.lat, point.lng);
    return { ...point, distance: Math.round(distance) };
  });
  
  return pointsWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}
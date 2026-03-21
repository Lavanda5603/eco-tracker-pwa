/**
 * 📦 wasteData.js
 * База данных отходов
 */

export const wasteDatabase = [
  { id: 1, name: 'Батарейка', category: 'опасные', instructions: 'Сдать в спецконтейнер в магазине', points: 5 },
  { id: 2, name: 'Консервная банка', category: 'металл', instructions: 'Ополоснуть и сдать в металл', points: 3 },
  { id: 3, name: 'Стеклянная бутылка', category: 'стекло', instructions: 'Сдать в зеленый контейнер', points: 2 },
  { id: 4, name: 'Газета', category: 'бумага', instructions: 'Связать в стопку', points: 1 },
  { id: 5, name: 'Пластиковая бутылка', category: 'пластик', instructions: 'Смять и сдать', points: 2 },
  { id: 6, name: 'Алюминиевая банка', category: 'металл', instructions: 'Сдать в металл', points: 3 },
  { id: 7, name: 'Тетрапак', category: 'пластик', instructions: 'Сдать как пластик', points: 2 },
  { id: 8, name: 'Стеклянная банка', category: 'стекло', instructions: 'В зеленый контейнер', points: 2 },
  { id: 9, name: 'Картон', category: 'бумага', instructions: 'Сложить и сдать', points: 2 },
  { id: 10, name: 'Лампочка', category: 'опасные', instructions: 'Сдать в спецпункт', points: 4 }
];

export function getWasteDatabase() {
  return wasteDatabase;
}

export function getWasteByCategory(category) {
  return wasteDatabase.filter(item => item.category === category);
}

export function searchWaste(query) {
  if (!query) return wasteDatabase;
  return wasteDatabase.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );
}
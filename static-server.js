const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Отдаю статику из папки public
app.use(express.static('public'));

// Явно обрабатываю manifest.json
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

// Все остальные запросы отправляю на index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Static server running on port ${PORT}`);
  console.log(`📁 Serving files from public/ directory`);
});
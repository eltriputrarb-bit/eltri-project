const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const VIEWS_FILE = path.join(__dirname, 'views.json');

app.use(cors());
app.use(express.json());

// Helper: baca views.json
const readViews = () => {
  if (!fs.existsSync(VIEWS_FILE)) {
    fs.writeFileSync(VIEWS_FILE, JSON.stringify({}));
  }
  const data = fs.readFileSync(VIEWS_FILE, 'utf-8');
  return JSON.parse(data);
};

// Helper: tulis views.json
const writeViews = (data) => {
  fs.writeFileSync(VIEWS_FILE, JSON.stringify(data, null, 2));
};

// GET /api/views — ambil semua views
app.get('/api/views', (req, res) => {
  const views = readViews();
  res.json(views);
});

// GET /api/views/:id — ambil views 1 item
app.get('/api/views/:id', (req, res) => {
  const views = readViews();
  const id = req.params.id;
  res.json({ id, views: views[id] || 0 });
});

// POST /api/views/:id — tambah 1 view untuk item tertentu
app.post('/api/views/:id', (req, res) => {
  const views = readViews();
  const id = req.params.id;
  views[id] = (views[id] || 0) + 1;
  writeViews(views);
  res.json({ id, views: views[id] });
});

app.listen(PORT, () => {
  console.log(`✅ Views server running at http://localhost:${PORT}`);
});

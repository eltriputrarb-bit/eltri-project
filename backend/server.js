const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// 🚨 MEMAKAI PORT DINAMIS RAILWAY
const PORT = process.env.PORT || 5000; 

// Folder /tmp/ agar aman dari pembatasan sistem di Railway
const VIEWS_FILE = path.join('/tmp', 'views.json');

// 🚨 UPDATE DI SINI: Izinkan domain localhost dan Vercel kamu agar tidak "0 views"
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://eltriputra4.vercel.app', 
    'https://eltri-project.vercel.app'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

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

// Jalankan server berdasarkan Port yang disediakan Railway
app.listen(PORT, () => {
  console.log(`✅ Views server running at port ${PORT}`);

  // ✏️ EDIT SUNTIK DATA MANUAL KAMU DI SINI:
// ✏️ UPDATE DATA TERBARU:
  const dataEdit = {
    "3": 0,
    "10": 0,
    "11": 0,
    "12": 0,
    "13": 0,
    "14": 0,
    "15": 0
  };
  writeViews(dataEdit);
  console.log("✏️ Database cloud views.json berhasil di-update!");
});
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// 🚨 MEMAKAI PORT DINAMIS RAILWAY
const PORT = process.env.PORT || 5000; 

// Folder /tmp/ agar aman dari pembatasan sistem di Railway
const VIEWS_FILE = path.join('/tmp', 'views.json');

// 🚨 Izinkan domain localhost dan Vercel kamu agar tidak "0 views"
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
  const id = req.params.id.toString(); // 🔒 FIX: Paksa jadi string agar sinkron dengan ID tombol frontend
  res.json({ id, views: views[id] || 0 });
});

// POST /api/views/:id — tambah 1 view untuk item tertentu saat tombol diklik
app.post('/api/views/:id', (req, res) => {
  const views = readViews();
  const id = req.params.id.toString(); // 🔒 FIX: Paksa jadi string agar sinkron dengan ID tombol frontend
  
  views[id] = (Number(views[id]) || 0) + 1; // Pastikan dikonversi ke angka sebelum ditambah 1
  writeViews(views);
  res.json({ id, views: views[id] });
});

// Jalankan server berdasarkan Port yang disediakan Railway
app.listen(PORT, () => {
  console.log(`✅ Views server running at port ${PORT}`);

  try {
    // Pastikan file views.json ada di folder /tmp
    if (!fs.existsSync(VIEWS_FILE)) {
      fs.writeFileSync(VIEWS_FILE, JSON.stringify({}));
    }

    const currentViews = readViews();

    // ✏️ SUNTIK DATA AWAL KAMU SECARA AMAN:
    const dataEdit = {
      "3": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
    };

    // 🔒 UPDATE FIX: Menggunakan Spread Operator (...) 
    // Ini memastikan dataEdit menjadi nilai default, tapi kalau di currentViews sudah ada angka baru (misal hasil klik), angka baru itu yang dipakai!
    const finalViews = { ...dataEdit, ...currentViews };
    writeViews(finalViews);

    console.log("✏️ Database cloud views.json berhasil disinkronisasikan!");
  } catch (error) {
    console.log("⚠️ Gagal sinkronisasi data awal:", error.message);
  }
});
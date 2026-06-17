const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();

// 🚨 MEMAKAI PORT DINAMIS RAILWAY
const PORT = process.env.PORT || 5000; 

// Folder /tmp/ agar aman dari pembatasan sistem di Railway
const VIEWS_FILE = path.join('/tmp', 'views.json');
const GALLERY_FILE = path.join('/tmp', 'gallery-data.json');
const UPLOAD_DIR = path.join('/tmp', 'uploads');

// Buat folder upload kalau belum ada
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 🚨 UPDATE DI SINI: Izinkan domain localhost dan Vercel kamu agar tidak "0 views"
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://eltriputra4.vercel.app', 
    'https://eltri-project.vercel.app'
  ],
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ====== VIEWS COUNTER (sudah ada sebelumnya, tidak diubah) ======

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

// ====== UPLOAD FOTO (FITUR BARU) ======

// Helper: baca gallery-data.json
const readGallery = () => {
  if (!fs.existsSync(GALLERY_FILE)) {
    fs.writeFileSync(GALLERY_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(GALLERY_FILE, 'utf-8');
  return JSON.parse(data);
};

// Helper: tulis gallery-data.json
const writeGallery = (data) => {
  fs.writeFileSync(GALLERY_FILE, JSON.stringify(data, null, 2));
};

// Konfigurasi multer: simpan file dengan nama unik
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `foto-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

// Filter: hanya terima gambar dan video
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Tipe file tidak didukung. Gunakan jpg, png, gif, webp, mp4, atau mov.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // max 50MB
});

// Serve folder uploads sebagai static (biar foto bisa diakses lewat URL)
app.use('/uploads', express.static(UPLOAD_DIR));

// POST /api/upload — upload foto/video baru
app.post('/api/upload', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Tidak ada file yang diupload.' });
    }

    const { date, desc } = req.body;
    const ext = path.extname(req.file.filename).toLowerCase();
    const isVideo = ['.mp4', '.mov'].includes(ext);

    const gallery = readGallery();
    const newItem = {
      id: Date.now(),
      type: isVideo ? 'video' : 'img',
      src: `/uploads/${req.file.filename}`,
      date: date || new Date().toLocaleDateString('id-ID'),
      desc: desc || ''
    };

    gallery.unshift(newItem); // taruh di paling atas
    writeGallery(gallery);

    res.json({ success: true, item: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/gallery — ambil semua data foto yang diupload lewat form
app.get('/api/gallery', (req, res) => {
  res.json(readGallery());
});

// DELETE /api/gallery/:id — hapus foto (opsional)
app.delete('/api/gallery/:id', (req, res) => {
  const gallery = readGallery();
  const item = gallery.find(g => g.id === Number(req.params.id));
  if (item) {
    const filePath = path.join(UPLOAD_DIR, path.basename(item.src));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  const updated = gallery.filter(g => g.id !== Number(req.params.id));
  writeGallery(updated);
  res.json({ success: true });
});

// Jalankan server berdasarkan Port yang disediakan Railway
app.listen(PORT, () => {
  console.log(`✅ Views server running at port ${PORT}`);

  // ✏️ EDIT SUNTIK DATA MANUAL KAMU DI SINI:
// ✏️ UPDATE DATA TERBARU:
  const dataEdit = {
    "3": 1,
    "10": 2,
    "11": 1,
    "12": 1,
    "13": 1,
    "14": 6,
    "15": 4
  };
  writeViews(dataEdit);
  console.log("✏️ Database cloud views.json berhasil di-update!");
});
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://eltriputrarb_db_user:eltri1234@ac-5mmmxdx-shard-00-00.9dejjvu.mongodb.net:27017,ac-5mmmxdx-shard-00-01.9dejjvu.mongodb.net:27017,ac-5mmmxdx-shard-00-02.9dejjvu.mongodb.net:27017/?ssl=true&replicaSet=atlas-nsfg52-shard-0&authSource=admin&appName=eltri'
let db;

// Connect ke MongoDB
MongoClient.connect(MONGO_URI)
  .then(client => {
    db = client.db('eltri');
    console.log('✅ Terhubung ke MongoDB!');

    // Suntik data awal kalau belum ada
    const dataEdit = {
      "3": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "17": 1,
    };

    // Insert data awal hanya kalau collection kosong
    db.collection('views').countDocuments().then(count => {
      if (count === 0) {
        const docs = Object.entries(dataEdit).map(([id, views]) => ({ id, views }));
        db.collection('views').insertMany(docs);
        console.log('✏️ Data awal berhasil dimasukkan!');
      }
    });
  })
  .catch(err => console.error('❌ Gagal connect MongoDB:', err));

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

// GET /api/views — ambil semua views
app.get('/api/views', async (req, res) => {
  const all = await db.collection('views').find().toArray();
  const result = {};
  all.forEach(item => result[item.id] = item.views);
  res.json(result);
});

// GET /api/views/:id — ambil views 1 item
app.get('/api/views/:id', async (req, res) => {
  const id = req.params.id;
  const item = await db.collection('views').findOne({ id });
  res.json({ id, views: item ? item.views : 0 });
});

// POST /api/views/:id — tambah 1 view
app.post('/api/views/:id', async (req, res) => {
  const id = req.params.id;
  const result = await db.collection('views').findOneAndUpdate(
    { id },
    { $inc: { views: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  res.json({ id, views: result.views });
});

app.listen(PORT, () => {
  console.log(`✅ Views server running at port ${PORT}`);
});
const { MongoClient } = require('mongodb');
const MONGO_URI = process.env.MONGO_URI;

let client;
async function getDb() {
  if (!client) {
    client = await MongoClient.connect(MONGO_URI);
  }
  return client.db('eltri');
}

// ---------- Rate limit untuk POST (increment view) ----------
// Mencegah satu IP nge-spam tambah view ribuan kali per detik.
const viewRateMap = new Map();
const VIEW_WINDOW_MS = 60 * 1000; // 1 menit
const VIEW_MAX_PER_WINDOW = 30; // maksimal 30 increment per menit per IP (gabungan semua item)

function checkViewRateLimit(ip) {
  const now = Date.now();
  const entry = viewRateMap.get(ip);

  if (!entry) {
    viewRateMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (now - entry.windowStart > VIEW_WINDOW_MS) {
    viewRateMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= VIEW_MAX_PER_WINDOW) {
    return false;
  }

  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of viewRateMap.entries()) {
    if (now - entry.windowStart > VIEW_WINDOW_MS) viewRateMap.delete(ip);
  }
}, 5 * 60 * 1000);

function getClientIp(req) {
  return (
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID wajib diisi!' });
  }

  const db = await getDb();

  if (req.method === 'GET') {
    try {
      const item = await db.collection('views').findOne({ id });
      return res.json({ id, views: item ? item.views : 0 });
    } catch (err) {
      console.error('Get view error:', err);
      return res.status(500).json({ error: 'Gagal mengambil data.' });
    }
  }

  if (req.method === 'POST') {
    const ip = getClientIp(req);

    if (!checkViewRateLimit(ip)) {
      return res.status(429).json({ error: 'Terlalu banyak request, coba lagi nanti.' });
    }

    try {
      const result = await db.collection('views').findOneAndUpdate(
        { id },
        { $inc: { views: 1 } },
        { upsert: true, returnDocument: 'after' }
      );
      return res.json({ id, views: result.views });
    } catch (err) {
      console.error('Increment view error:', err);
      return res.status(500).json({ error: 'Gagal menambah view.' });
    }
  }

  if (req.method === 'PUT') {
    const token = req.headers['x-admin-token'];
    if (token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { views } = req.body || {};
    const parsedViews = parseInt(views, 10);

    if (views === undefined || Number.isNaN(parsedViews) || parsedViews < 0) {
      return res.status(400).json({ error: 'Views tidak valid!' });
    }

    try {
      await db.collection('views').findOneAndUpdate(
        { id },
        { $set: { views: parsedViews } },
        { upsert: true, returnDocument: 'after' }
      );
      return res.json({ id, views: parsedViews });
    } catch (err) {
      console.error('Update view error:', err);
      return res.status(500).json({ error: 'Gagal menyimpan perubahan.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
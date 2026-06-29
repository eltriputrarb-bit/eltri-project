const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;

let client;
async function getDb() {
  if (!client) {
    client = await MongoClient.connect(MONGO_URI);
  }
  return client.db('eltri');
}

// Rate limiting - simpan IP dan waktu request
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 menit
  const maxRequests = 10; // max 10 request per menit

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }

  const data = rateLimitMap.get(ip);

  // Reset kalau sudah lewat 1 menit
  if (now - data.start > windowMs) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }

  // Cek limit
  if (data.count >= maxRequests) {
    return false;
  }

  data.count++;
  return true;
}

// Input sanitization - hapus karakter berbahaya
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // hapus tag HTML
    .replace(/javascript:/gi, '') // hapus javascript:
    .replace(/on\w+=/gi, '') // hapus event handler
    .slice(0, 500); // max 500 karakter
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = await getDb();

  // POST - simpan pesan baru
  if (req.method === 'POST') {
    // Cek rate limit
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: 'Terlalu banyak request! Coba lagi dalam 1 menit.' });
    }

    // Sanitize input
    const name = sanitize(req.body?.name || '');
    const message = sanitize(req.body?.message || '');

    if (!name || !message) {
      return res.status(400).json({ error: 'Nama dan pesan wajib diisi!' });
    }

    if (name.length < 2) {
      return res.status(400).json({ error: 'Nama terlalu pendek!' });
    }

    if (message.length < 3) {
      return res.status(400).json({ error: 'Pesan terlalu pendek!' });
    }

    await db.collection('messages').insertOne({
      name,
      message,
      createdAt: new Date(),
    });

    return res.json({ success: true, message: 'Pesan berhasil dikirim!' });
  }

  // GET & DELETE - butuh token admin
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const messages = await db.collection('messages')
      .find().sort({ createdAt: -1 }).limit(50).toArray();
    return res.json(messages);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID wajib diisi!' });
    await db.collection('messages').deleteOne({ _id: new ObjectId(id) });
    return res.json({ success: true });
  }
};
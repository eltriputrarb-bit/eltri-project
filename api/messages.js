const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');

const MONGO_URI = process.env.MONGO_URI;
const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
// Set ini ke domain produksi kamu, contoh: 'https://eltri.vercel.app'
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

let client;
async function getDb() {
  if (!client) {
    client = await MongoClient.connect(MONGO_URI);
  }
  try {
    // Pastikan koneksi masih hidup; kalau mati, reconnect
    await client.db('admin').command({ ping: 1 });
  } catch (_) {
    client = await MongoClient.connect(MONGO_URI);
  }
  return client.db('eltri');
}

// ---------- Rate limiting (per IP, per aksi) ----------
const rateLimitMap = new Map();

function checkRateLimit(key, maxRequests, windowMs) {
  const now = Date.now();

  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, start: now });
    return true;
  }

  const data = rateLimitMap.get(key);

  if (now - data.start > windowMs) {
    rateLimitMap.set(key, { count: 1, start: now });
    return true;
  }

  if (data.count >= maxRequests) {
    return false;
  }

  data.count++;
  return true;
}

// Bersihkan entry lama tiap 5 menit biar map nggak numpuk terus
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitMap.entries()) {
    if (now - data.start > 5 * 60 * 1000) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ---------- Sanitasi input ----------
function sanitize(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .slice(0, maxLen);
}

// ---------- Verifikasi hCaptcha di server ----------
async function verifyCaptcha(token, ip) {
  if (!token) return false;
  try {
    const verifyRes = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: HCAPTCHA_SECRET,
        response: token,
        remoteip: ip,
      }),
    });
    const data = await verifyRes.json();
    return !!data.success;
  } catch (err) {
    console.error('hCaptcha verify error:', err);
    return false;
  }
}

// ---------- Perbandingan token admin yang aman dari timing attack ----------
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function getClientIp(req) {
  return (
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const ip = getClientIp(req);
  const db = await getDb();

  // ===== POST - simpan pesan baru (publik, tapi dijaga ketat) =====
  if (req.method === 'POST') {
    if (!checkRateLimit(`post:${ip}`, 10, 60 * 1000)) {
      return res.status(429).json({ error: 'Terlalu banyak request! Coba lagi dalam 1 menit.' });
    }

    const { captchaToken } = req.body || {};

    // Verifikasi captcha di server — INI YANG MEMBUAT CAPTCHA BENAR-BENAR BERFUNGSI
    const captchaValid = await verifyCaptcha(captchaToken, ip);
    if (!captchaValid) {
      return res.status(400).json({ error: 'Verifikasi captcha gagal. Coba lagi.' });
    }

    const name = sanitize(req.body?.name || '', 50);
    const message = sanitize(req.body?.message || '', 500);

    if (!name || !message) {
      return res.status(400).json({ error: 'Nama dan pesan wajib diisi!' });
    }
    if (name.length < 2) {
      return res.status(400).json({ error: 'Nama terlalu pendek!' });
    }
    if (message.length < 3) {
      return res.status(400).json({ error: 'Pesan terlalu pendek!' });
    }

    try {
      await db.collection('messages').insertOne({
        name,
        message,
        ip, // simpan IP buat audit/moderasi kalau perlu blokir penyalahgunaan
        createdAt: new Date(),
      });
      return res.json({ success: true, message: 'Pesan berhasil dikirim!' });
    } catch (err) {
      console.error('Insert message error:', err);
      return res.status(500).json({ error: 'Gagal menyimpan pesan.' });
    }
  }

  // ===== GET & DELETE - khusus admin =====
  if (!checkRateLimit(`admin:${ip}`, 30, 60 * 1000)) {
    return res.status(429).json({ error: 'Terlalu banyak request admin.' });
  }

  const token = req.headers['x-admin-token'];
  if (!safeCompare(token, ADMIN_TOKEN)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const messages = await db.collection('messages')
        .find()
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();
      return res.json(messages);
    } catch (err) {
      console.error('Fetch messages error:', err);
      return res.status(500).json({ error: 'Gagal mengambil pesan.' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID wajib diisi!' });

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (_) {
      return res.status(400).json({ error: 'ID tidak valid.' });
    }

    try {
      const result = await db.collection('messages').deleteOne({ _id: objectId });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Pesan tidak ditemukan.' });
      }
      return res.json({ success: true });
    } catch (err) {
      console.error('Delete message error:', err);
      return res.status(500).json({ error: 'Gagal menghapus pesan.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
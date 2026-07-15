const crypto = require('crypto');

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

// ---------- Rate limit + lockout untuk percobaan login ----------
const attemptMap = new Map();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000; // 5 menit
const LOCKOUT_MS = 5 * 60 * 1000; // lockout 5 menit setelah kena limit

function checkLoginAttempt(ip) {
  const now = Date.now();
  const entry = attemptMap.get(ip);

  if (!entry) {
    attemptMap.set(ip, { count: 1, windowStart: now, lockedUntil: null });
    return { allowed: true };
  }

  // Masih dalam lockout
  if (entry.lockedUntil && now < entry.lockedUntil) {
    const waitSec = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, waitSec };
  }

  // Window sudah lewat, reset
  if (now - entry.windowStart > WINDOW_MS) {
    attemptMap.set(ip, { count: 1, windowStart: now, lockedUntil: null });
    return { allowed: true };
  }

  entry.count++;

  if (entry.count > MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
    attemptMap.set(ip, entry);
    return { allowed: false, waitSec: Math.ceil(LOCKOUT_MS / 1000) };
  }

  attemptMap.set(ip, entry);
  return { allowed: true };
}

function resetAttempts(ip) {
  attemptMap.delete(ip);
}

// Bersihkan entry lama biar map nggak numpuk
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of attemptMap.entries()) {
    const expired =
      (!entry.lockedUntil && now - entry.windowStart > WINDOW_MS) ||
      (entry.lockedUntil && now > entry.lockedUntil);
    if (expired) attemptMap.delete(ip);
  }
}, 10 * 60 * 1000);

// ---------- Constant-time string comparison ----------
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIp(req);

  const attemptCheck = checkLoginAttempt(ip);
  if (!attemptCheck.allowed) {
    console.warn(`[auth] Login dikunci untuk IP ${ip}, sisa ${attemptCheck.waitSec}s`);
    return res.status(429).json({
      success: false,
      error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${attemptCheck.waitSec} detik.`,
    });
  }

  const { password } = req.body || {};

  if (typeof password !== 'string' || !password) {
    return res.status(400).json({ success: false, error: 'Password wajib diisi!' });
  }

  const isValid = safeCompare(password, process.env.ADMIN_PASSWORD);

  if (isValid) {
    resetAttempts(ip); // login sukses, hapus history percobaan gagal
    return res.json({ success: true, token: process.env.ADMIN_TOKEN });
  }

  console.warn(`[auth] Login gagal dari IP ${ip} pada ${new Date().toISOString()}`);
  return res.status(401).json({ success: false, error: 'Password salah!' });
};
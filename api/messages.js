const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;

let client;
async function getDb() {
  if (!client) {
    client = await MongoClient.connect(MONGO_URI);
  }
  return client.db('eltri');
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = await getDb();

  // POST - simpan pesan baru (tidak perlu token)
  if (req.method === 'POST') {
    const { name, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'Nama dan pesan wajib diisi!' });
    }
    await db.collection('messages').insertOne({ name, message, createdAt: new Date() });
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
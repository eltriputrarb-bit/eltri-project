const { MongoClient } = require('mongodb');

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
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Tambahkan ini — cek token admin
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = await getDb();
  const all = await db.collection('views').find().toArray();
  const result = {};
  all.forEach(item => result[item.id] = item.views);
  return res.json(result);
};
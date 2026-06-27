const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://eltriputrarb_db_user:eltri1234@ac-5mmmxdx-shard-00-00.9dejjvu.mongodb.net:27017,ac-5mmmxdx-shard-00-01.9dejjvu.mongodb.net:27017,ac-5mmmxdx-shard-00-02.9dejjvu.mongodb.net:27017/?ssl=true&replicaSet=atlas-nsfg52-shard-0&authSource=admin&appName=eltri';

let client;
async function getDb() {
  if (!client) {
    client = await MongoClient.connect(MONGO_URI);
  }
  return client.db('eltri');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const db = await getDb();

  if (req.method === 'GET') {
    const item = await db.collection('views').findOne({ id });
    return res.json({ id, views: item ? item.views : 0 });
  }

  if (req.method === 'POST') {
    const result = await db.collection('views').findOneAndUpdate(
      { id },
      { $inc: { views: 1 } },
      { upsert: true, returnDocument: 'after' }
    );
    return res.json({ id, views: result.views });
  }
}
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://officialgopal4646_db_user:l6UE789IjDXHCluT@cluster0.k5v4slj.mongodb.net/?appName=Cluster0';
const DB_NAME = process.env.MONGODB_DB || 'retail';

let client;
let db;

async function connectToDatabase() {
  if (db) {
    return db;
  }

  client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  db = client.db(DB_NAME);

  // Verify the connection
  await db.command({ ping: 1 });
  console.log('Connected to MongoDB cluster and ready to use database:', DB_NAME);

  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase() first.');
  }
  return db;
}

async function closeConnection() {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
  }
}

module.exports = {
  connectToDatabase,
  getDb,
  closeConnection,
};


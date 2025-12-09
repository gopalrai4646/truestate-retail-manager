const express = require('express');
const { connectToDatabase, getDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Health check to ensure the server and DB are reachable
app.get('/health', async (_req, res) => {
  try {
    const db = getDb();
    await db.command({ ping: 1 });
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Health check failed', err);
    res.status(500).json({ status: 'error', message: 'Database not reachable' });
  }
});

// Basic transaction list endpoint with pagination
app.get('/transactions', async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.max(parseInt(req.query.limit || '20', 10), 1);
  const skip = (page - 1) * limit;

  try {
    const db = getDb();
    const collection = db.collection('transactions');

    const [items, totalItems] = await Promise.all([
      collection.find({}).skip(skip).limit(limit).toArray(),
      collection.countDocuments({}),
    ]);

    res.json({
      data: items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.max(Math.ceil(totalItems / limit), 1),
      },
    });
  } catch (err) {
    console.error('Failed to fetch transactions', err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// Simple bulk insert endpoint for demo/testing
app.post('/transactions', async (req, res) => {
  const payload = req.body;

  if (!payload || (Array.isArray(payload) && payload.length === 0)) {
    return res.status(400).json({ message: 'Request body must contain transaction data' });
  }

  try {
    const db = getDb();
    const collection = db.collection('transactions');

    if (Array.isArray(payload)) {
      await collection.insertMany(payload);
    } else {
      await collection.insertOne(payload);
    }

    res.status(201).json({ message: 'Transactions stored successfully' });
  } catch (err) {
    console.error('Failed to store transactions', err);
    res.status(500).json({ message: 'Failed to store transactions' });
  }
});

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });


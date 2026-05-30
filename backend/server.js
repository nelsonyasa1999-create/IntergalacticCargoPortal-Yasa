require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./src/database/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

db.get('SELECT 1 AS ok', (err, row) => {
  if (err) {
    console.error('SQLite health check failed:', err.message);
    return;
  }
  console.log('SQLite health check passed:', row);
});

app.get('/health', (req, res) => {
  db.get('SELECT 1 AS ok', (err) => {
    if (err) {
      return res.status(503).json({
        status: 'error',
        database: 'disconnected',
      });
    }
    res.json({ status: 'ok', database: 'connected' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

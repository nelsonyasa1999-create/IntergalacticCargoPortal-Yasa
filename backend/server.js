require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./src/database/db');
const initDatabase = require('./src/database/init');
const authRoutes = require('./src/routes/authRoutes');
const cargoRoutes = require('./src/routes/cargoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(cargoRoutes);

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

initDatabase()
  .then(() => {
    db.get('SELECT 1 AS ok', (err, row) => {
      if (err) {
        console.error('SQLite health check failed:', err.message);
        return;
      }
      console.log('SQLite health check passed:', row);
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database initialization failed:', err.message);
    process.exit(1);
  });

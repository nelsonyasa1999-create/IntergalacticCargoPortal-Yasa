const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('SQLite connection error:', err.message);
    return;
  }
  console.log(`SQLite connected successfully at ${dbPath}`);
});

db.on('error', (err) => {
  console.error('SQLite database error:', err.message);
});

module.exports = db;

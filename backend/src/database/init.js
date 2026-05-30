const db = require('./db');

const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Admin', 'Standard')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

function initDatabase() {
  return new Promise((resolve, reject) => {
    db.run(CREATE_USERS_TABLE, (err) => {
      if (err) {
        console.error('Failed to create users table:', err.message);
        reject(err);
        return;
      }
      console.log('Users table ready');
      resolve();
    });
  });
}

module.exports = initDatabase;

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

const CREATE_CARGO_TABLE = `
  CREATE TABLE IF NOT EXISTS cargo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cargo_id TEXT NOT NULL,
    shipment_date TEXT NOT NULL,
    weight_kg INTEGER NOT NULL,
    destination TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(CREATE_USERS_TABLE, (usersErr) => {
        if (usersErr) {
          console.error('Failed to create users table:', usersErr.message);
          reject(usersErr);
          return;
        }
        console.log('Users table ready');

        db.run(CREATE_CARGO_TABLE, (cargoErr) => {
          if (cargoErr) {
            console.error('Failed to create cargo table:', cargoErr.message);
            reject(cargoErr);
            return;
          }
          console.log('Cargo table ready');
          resolve();
        });
      });
    });
  });
}

module.exports = initDatabase;

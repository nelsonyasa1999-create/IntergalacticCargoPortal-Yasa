const db = require('../database/db');

function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, email, role FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function findUserWithPasswordByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, email, role, password_hash FROM users WHERE email = ?',
      [email],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

function createUser(email, passwordHash, role) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, passwordHash, role],
      function onInsert(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            reject(Object.assign(new Error('Email already exists'), { code: 'DUPLICATE_EMAIL' }));
            return;
          }
          reject(err);
          return;
        }
        resolve({ id: this.lastID, email, role });
      }
    );
  });
}

module.exports = { findUserByEmail, findUserWithPasswordByEmail, createUser };

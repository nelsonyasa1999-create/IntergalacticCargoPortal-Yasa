const db = require('../database/db');

function insertCargoRecords(records) {
  if (records.length === 0) {
    return Promise.resolve({ inserted: 0 });
  }

  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO cargo (cargo_id, shipment_date, weight_kg, destination)
      VALUES (?, ?, ?, ?)
    `;

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      const stmt = db.prepare(sql);
      for (const record of records) {
        stmt.run([
          record.cargo_id,
          record.shipment_date,
          record.weight_kg,
          record.destination,
        ]);
      }

      stmt.finalize((err) => {
        if (err) {
          db.run('ROLLBACK');
          reject(err);
          return;
        }

        db.run('COMMIT', (commitErr) => {
          if (commitErr) {
            reject(commitErr);
            return;
          }
          resolve({ inserted: records.length });
        });
      });
    });
  });
}

function getAllCargo() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, cargo_id, shipment_date, weight_kg, destination, created_at
       FROM cargo
       ORDER BY id ASC`,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

function clearAllCargo() {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM cargo', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = { insertCargoRecords, getAllCargo, clearAllCargo };

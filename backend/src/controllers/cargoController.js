const { parseManifestFile } = require('../services/manifestParser');
const { insertCargoRecords, getAllCargo } = require('../models/cargoModel');

async function uploadManifest(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'manifest.txt file is required.',
      });
    }

    const { saved, skipped } = parseManifestFile(req.file.buffer);

    if (saved.length === 0) {
      return res.status(200).json({
        message: 'Manifest processed. No records were saved.',
        savedCount: 0,
        skippedCount: skipped.length,
        skipped,
      });
    }

    const result = await insertCargoRecords(saved);

    return res.status(201).json({
      message: 'Manifest uploaded and processed successfully.',
      savedCount: result.inserted,
      skippedCount: skipped.length,
      saved,
      skipped,
    });
  } catch (err) {
    console.error('Upload error:', err.message);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
}

async function listCargo(req, res) {
  try {
    const cargo = await getAllCargo();
    return res.json({
      count: cargo.length,
      cargo,
    });
  } catch (err) {
    console.error('List cargo error:', err.message);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
}

module.exports = { uploadManifest, listCargo };

const { isPrime } = require('../utils/prime');

const MANIFEST_LINE_REGEX =
  /^\[([^\]]+)\]\s*\|\|\s*([A-Z0-9-]+)\s*::\s*(\d+(?:\.\d+)?)\s*>>\s*(.+)$/i;

const SECTOR_7_MARKER = 'Sector-7';
const SECTOR_7_MULTIPLIER = 1.45;

function calculateWeight(rawWeight, destination) {
  let weight = Number(rawWeight);
  if (destination.includes(SECTOR_7_MARKER)) {
    weight *= SECTOR_7_MULTIPLIER;
  }
  return Math.round(weight);
}

function parseManifestLine(line) {
  const trimmed = line.trim();
  if (!trimmed) {
    return { skipped: true, reason: 'empty_line' };
  }

  const match = trimmed.match(MANIFEST_LINE_REGEX);
  if (!match) {
    return { skipped: true, reason: 'invalid_format', line: trimmed };
  }

  const [, shipmentDate, cargoId, rawWeight, destination] = match;
  const finalWeight = calculateWeight(rawWeight, destination);

  if (isPrime(finalWeight)) {
    return {
      skipped: true,
      reason: 'prime_weight',
      cargoId,
      finalWeight,
    };
  }

  return {
    skipped: false,
    record: {
      cargo_id: cargoId.toUpperCase(),
      shipment_date: shipmentDate,
      weight_kg: finalWeight,
      destination: destination.trim(),
    },
  };
}

function parseManifestFile(fileContent) {
  const lines = fileContent.toString('utf8').split(/\r?\n/);
  const saved = [];
  const skipped = [];

  for (const line of lines) {
    const result = parseManifestLine(line);
    if (result.skipped) {
      skipped.push(result);
    } else {
      saved.push(result.record);
    }
  }

  return { saved, skipped };
}

module.exports = {
  parseManifestFile,
  parseManifestLine,
  calculateWeight,
  SECTOR_7_MARKER,
};

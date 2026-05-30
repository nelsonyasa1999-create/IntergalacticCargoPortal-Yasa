const LBS_PER_KG = 2.20462;

export function isEarthDestination(destination) {
  return destination.trim().toLowerCase() === 'earth';
}

export function sortCargo(cargo) {
  const nonEarth = [];
  const earth = [];

  for (const item of cargo) {
    if (isEarthDestination(item.destination)) {
      earth.push(item);
    } else {
      nonEarth.push(item);
    }
  }

  const byWeightDesc = (a, b) => b.weight_kg - a.weight_kg;
  return [...nonEarth.sort(byWeightDesc), ...earth.sort(byWeightDesc)];
}

export function formatWeight(weightKg, role) {
  if (role === 'Admin') {
    return `${weightKg} KG`;
  }
  const lbs = weightKg * LBS_PER_KG;
  return `${lbs.toFixed(2)} LBS`;
}

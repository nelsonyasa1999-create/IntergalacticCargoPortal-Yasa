export function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeToken(token);
  if (!payload?.exp) {
    return true;
  }
  return Date.now() >= payload.exp * 1000;
}

export function getTokenExpiryDate(token) {
  const payload = decodeToken(token);
  if (!payload?.exp) {
    return null;
  }
  return new Date(payload.exp * 1000);
}

// Decode the (public) payload of a JWT. This does NOT verify the signature -
// the backend does that. We only read name/email/exp for the UI.
export function decodeJwt(token) {
  if (!token) return null;
  try {
    const part = token.split('.')[1];
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// exp is in seconds. Treat tokens expiring within 5s as already expired.
export function isTokenValid(token) {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return false;
  return payload.exp * 1000 - 5000 > Date.now();
}

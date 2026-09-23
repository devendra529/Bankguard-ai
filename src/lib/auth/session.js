/**
 * Stateless, HMAC-signed session tokens.
 *
 * Built on the Web Crypto API (crypto.subtle) rather than Node's `crypto`
 * module so the exact same code verifies a session in a Server Component /
 * Route Handler (Node runtime) AND in middleware.js (Edge runtime) - Buffer
 * is intentionally never used here, since it is not available on Edge.
 */

const SESSION_SECRET = process.env.SESSION_SECRET || "bankguard-ai-dev-secret-do-not-use-in-production";
const encoder = new TextEncoder();

export const SESSION_COOKIE = "bankguard_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function bytesToBase64Url(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function stringToBase64Url(value) {
  return bytesToBase64Url(encoder.encode(value));
}

function base64UrlToString(value) {
  return new TextDecoder().decode(base64UrlToBytes(value));
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function signPayload(payloadB64) {
  const key = await getSigningKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  return bytesToBase64Url(new Uint8Array(signatureBuffer));
}

/** Build a signed session token for a user: `{sub, role, name, email, iat, exp}`. */
export async function createSessionToken(user, maxAgeSeconds = SESSION_MAX_AGE_SECONDS) {
  const payload = {
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    iat: Date.now(),
    exp: Date.now() + maxAgeSeconds * 1000,
  };
  const payloadB64 = stringToBase64Url(JSON.stringify(payload));
  const signature = await signPayload(payloadB64);
  return `${payloadB64}.${signature}`;
}

/** Verify a token's signature and expiry; returns the payload, or null if invalid. */
export async function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expectedSignature = await signPayload(payloadB64);
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(base64UrlToString(payloadB64));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

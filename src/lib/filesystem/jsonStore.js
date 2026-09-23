import fs from "fs";
import path from "path";

/**
 * Phase-1 file-system database.
 * Every JSON file lives in /data at the project root, OUTSIDE /public, so it
 * is never served by Next.js. Only server code (repositories) should import
 * this module - never call it from a client component.
 */
const DATA_DIR = path.join(process.cwd(), "data");

function resolvePath(fileName) {
  return path.join(DATA_DIR, fileName);
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

/** Read a JSON file, tolerating a missing file, an empty file or invalid JSON. */
export function readJsonFile(fileName, fallback = []) {
  ensureDataDir();
  const fullPath = resolvePath(fileName);
  try {
    if (!fs.existsSync(fullPath)) {
      writeJsonFile(fileName, fallback);
      return structuredClone(fallback);
    }
    const raw = fs.readFileSync(fullPath, "utf-8");
    if (!raw || !raw.trim()) return structuredClone(fallback);
    return JSON.parse(raw);
  } catch (error) {
    console.error(`[jsonStore] Failed to read ${fileName}: ${error.message}`);
    return structuredClone(fallback);
  }
}

/** Write a JSON file atomically (write to a temp file, then rename). */
export function writeJsonFile(fileName, data) {
  ensureDataDir();
  const fullPath = resolvePath(fileName);
  const tmpPath = `${fullPath}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tmpPath, fullPath);
    return true;
  } catch (error) {
    console.error(`[jsonStore] Failed to write ${fileName}: ${error.message}`);
    try {
      fs.rmSync(tmpPath, { force: true });
    } catch {
      /* ignore cleanup failure */
    }
    return false;
  }
}

/** Append one record to a JSON array file and persist it. */
export function appendJsonRecord(fileName, record) {
  const data = readJsonFile(fileName, []);
  data.push(record);
  writeJsonFile(fileName, data);
  return record;
}

/** Merge `updates` into the record whose `id` matches, and persist it. */
export function updateJsonRecord(fileName, id, updates) {
  const data = readJsonFile(fileName, []);
  const index = data.findIndex((record) => record.id === id);
  if (index === -1) return null;
  data[index] = { ...data[index], ...updates, id: data[index].id };
  writeJsonFile(fileName, data);
  return data[index];
}

/** Remove the record whose `id` matches and persist the file. Returns true if removed. */
export function deleteJsonRecord(fileName, id) {
  const data = readJsonFile(fileName, []);
  const next = data.filter((record) => record.id !== id);
  const changed = next.length !== data.length;
  if (changed) writeJsonFile(fileName, next);
  return changed;
}

export const DATA_FILES = Object.freeze({
  USERS: "users.json",
  ACCOUNTS: "accounts.json",
  TRANSACTIONS: "transactions.json",
  ALERTS: "alerts.json",
  FRAUD_CASES: "fraud-cases.json",
  DEVICES: "devices.json",
  LOGIN_HISTORY: "login-history.json",
  AUDIT_LOGS: "audit-logs.json",
  NOTIFICATIONS: "notifications.json",
  FRAUD_RULES: "fraud-rules.json",
});

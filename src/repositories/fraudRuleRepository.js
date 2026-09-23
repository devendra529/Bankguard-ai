import "server-only";
import { DATA_FILES, readJsonFile, updateJsonRecord, writeJsonFile } from "@/lib/filesystem/jsonStore";

const FILE = DATA_FILES.FRAUD_RULES;

export function getAll() {
  return readJsonFile(FILE, []);
}

export function getActive() {
  return getAll().filter((rule) => rule.enabled);
}

export function getById(id) {
  return getAll().find((rule) => rule.id === id) ?? null;
}

export function update(id, updates) {
  return updateJsonRecord(FILE, id, { ...updates, updatedAt: new Date().toISOString() });
}

export function replaceAll(rules) {
  return writeJsonFile(FILE, rules);
}

import "server-only";
import { DATA_FILES, appendJsonRecord, readJsonFile, updateJsonRecord, writeJsonFile } from "@/lib/filesystem/jsonStore";
import { nextSequentialId } from "@/lib/utils/id";

const FILE = DATA_FILES.ALERTS;

export function getAll() {
  return readJsonFile(FILE, []);
}

export function getById(id) {
  return getAll().find((alert) => alert.id === id) ?? null;
}

export function getByTransactionId(transactionId) {
  return getAll().find((alert) => alert.transactionId === transactionId) ?? null;
}

export function getByUserId(userId) {
  return getAll().filter((alert) => alert.userId === userId);
}

export function create(alertData) {
  const alerts = getAll();
  const now = new Date().toISOString();
  const record = {
    id: nextSequentialId(alerts, "ALT"),
    status: "OPEN",
    assignedAnalystId: null,
    notes: [],
    createdAt: now,
    updatedAt: now,
    ...alertData,
  };
  return appendJsonRecord(FILE, record);
}

export function update(id, updates) {
  return updateJsonRecord(FILE, id, { ...updates, updatedAt: new Date().toISOString() });
}

export function addNote(id, note) {
  const alert = getById(id);
  if (!alert) return null;
  const notes = [...(alert.notes ?? []), note];
  return update(id, { notes });
}

export function replaceAll(alerts) {
  return writeJsonFile(FILE, alerts);
}

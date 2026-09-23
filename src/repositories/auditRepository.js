import "server-only";
import { DATA_FILES, appendJsonRecord, readJsonFile, writeJsonFile } from "@/lib/filesystem/jsonStore";
import { nextSequentialId } from "@/lib/utils/id";

const FILE = DATA_FILES.AUDIT_LOGS;

export function getAll() {
  return readJsonFile(FILE, []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function getByUserId(userId) {
  return getAll().filter((log) => log.userId === userId);
}

export function record(logData) {
  const logs = readJsonFile(FILE, []);
  const entry = {
    id: nextSequentialId(logs, "AUD"),
    timestamp: new Date().toISOString(),
    metadata: {},
    ...logData,
  };
  return appendJsonRecord(FILE, entry);
}

export function replaceAll(logs) {
  return writeJsonFile(FILE, logs);
}

import "server-only";
import { DATA_FILES, appendJsonRecord, readJsonFile, writeJsonFile } from "@/lib/filesystem/jsonStore";
import { nextSequentialId } from "@/lib/utils/id";

const FILE = DATA_FILES.LOGIN_HISTORY;

export function getAll() {
  return readJsonFile(FILE, []);
}

export function getByUserId(userId) {
  return getAll()
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getRecentFailedCount(userId, windowMinutes = 30) {
  const cutoff = Date.now() - windowMinutes * 60 * 1000;
  return getByUserId(userId).filter(
    (entry) => entry.status === "FAILED" && new Date(entry.createdAt).getTime() >= cutoff
  ).length;
}

export function record(entryData) {
  const entries = getAll();
  const record = {
    id: nextSequentialId(entries, "LOG"),
    createdAt: new Date().toISOString(),
    ...entryData,
  };
  return appendJsonRecord(FILE, record);
}

export function replaceAll(entries) {
  return writeJsonFile(FILE, entries);
}

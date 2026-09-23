import "server-only";
import { DATA_FILES, appendJsonRecord, readJsonFile, updateJsonRecord, writeJsonFile } from "@/lib/filesystem/jsonStore";
import { nextSequentialId } from "@/lib/utils/id";

const FILE = DATA_FILES.NOTIFICATIONS;

export function getAll() {
  return readJsonFile(FILE, []);
}

export function getByUserId(userId) {
  return getAll()
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function create(notificationData) {
  const notifications = getAll();
  const record = {
    id: nextSequentialId(notifications, "NOT"),
    read: false,
    createdAt: new Date().toISOString(),
    ...notificationData,
  };
  return appendJsonRecord(FILE, record);
}

export function markRead(id) {
  return updateJsonRecord(FILE, id, { read: true });
}

export function replaceAll(notifications) {
  return writeJsonFile(FILE, notifications);
}

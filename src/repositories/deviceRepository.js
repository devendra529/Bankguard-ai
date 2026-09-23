import "server-only";
import { DATA_FILES, appendJsonRecord, readJsonFile, updateJsonRecord, writeJsonFile } from "@/lib/filesystem/jsonStore";
import { nextSequentialId } from "@/lib/utils/id";

const FILE = DATA_FILES.DEVICES;

export function getAll() {
  return readJsonFile(FILE, []);
}

export function getByUserId(userId) {
  return getAll().filter((device) => device.userId === userId);
}

export function findByFingerprint(userId, deviceId) {
  return getAll().find((device) => device.userId === userId && device.deviceId === deviceId) ?? null;
}

export function create(deviceData) {
  const devices = getAll();
  const now = new Date().toISOString();
  const record = {
    id: nextSequentialId(devices, "DEV"),
    firstSeenAt: now,
    lastSeenAt: now,
    ...deviceData,
  };
  return appendJsonRecord(FILE, record);
}

export function touch(id) {
  return updateJsonRecord(FILE, id, { lastSeenAt: new Date().toISOString() });
}

export function replaceAll(devices) {
  return writeJsonFile(FILE, devices);
}

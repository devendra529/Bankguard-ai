import "server-only";
import { DATA_FILES, appendJsonRecord, deleteJsonRecord, readJsonFile, updateJsonRecord, writeJsonFile } from "@/lib/filesystem/jsonStore";
import { nextSequentialId } from "@/lib/utils/id";

const FILE = DATA_FILES.USERS;

export function getAll() {
  return readJsonFile(FILE, []);
}

export function getById(id) {
  return getAll().find((user) => user.id === id) ?? null;
}

export function getByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  return getAll().find((user) => user.email.toLowerCase() === normalized) ?? null;
}

export function getByRole(role) {
  return getAll().filter((user) => user.role === role);
}

export function create(userData) {
  const users = getAll();
  const record = {
    id: nextSequentialId(users, "USR"),
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...userData,
  };
  return appendJsonRecord(FILE, record);
}

export function update(id, updates) {
  return updateJsonRecord(FILE, id, { ...updates, updatedAt: new Date().toISOString() });
}

export function remove(id) {
  return deleteJsonRecord(FILE, id);
}

export function replaceAll(users) {
  return writeJsonFile(FILE, users);
}

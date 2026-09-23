import "server-only";
import { DATA_FILES, appendJsonRecord, readJsonFile, updateJsonRecord, writeJsonFile } from "@/lib/filesystem/jsonStore";
import { nextSequentialId } from "@/lib/utils/id";

const FILE = DATA_FILES.FRAUD_CASES;

export function getAll() {
  return readJsonFile(FILE, []);
}

export function getById(id) {
  return getAll().find((fraudCase) => fraudCase.id === id) ?? null;
}

export function getByAlertId(alertId) {
  return getAll().find((fraudCase) => fraudCase.alertId === alertId) ?? null;
}

export function create(caseData) {
  const cases = getAll();
  const now = new Date().toISOString();
  const record = {
    id: nextSequentialId(cases, "CASE"),
    status: "OPEN",
    createdAt: now,
    updatedAt: now,
    ...caseData,
  };
  return appendJsonRecord(FILE, record);
}

export function update(id, updates) {
  return updateJsonRecord(FILE, id, { ...updates, updatedAt: new Date().toISOString() });
}

export function replaceAll(cases) {
  return writeJsonFile(FILE, cases);
}

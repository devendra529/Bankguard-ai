import "server-only";
import { DATA_FILES, appendJsonRecord, readJsonFile, updateJsonRecord, writeJsonFile } from "@/lib/filesystem/jsonStore";
import { nextSequentialId } from "@/lib/utils/id";

const FILE = DATA_FILES.ACCOUNTS;

export function getAll() {
  return readJsonFile(FILE, []);
}

export function getById(id) {
  return getAll().find((account) => account.id === id) ?? null;
}

export function getByAccountNumber(accountNumber) {
  const digits = String(accountNumber || "").replace(/\s/g, "");
  return getAll().find((account) => account.accountNumber === digits) ?? null;
}

export function getByUserId(userId) {
  return getAll().filter((account) => account.userId === userId);
}

export function create(accountData) {
  const accounts = getAll();
  const record = {
    id: nextSequentialId(accounts, "ACC"),
    status: "ACTIVE",
    currency: "INR",
    createdAt: new Date().toISOString(),
    ...accountData,
  };
  return appendJsonRecord(FILE, record);
}

export function update(id, updates) {
  return updateJsonRecord(FILE, id, updates);
}

export function adjustBalance(id, delta) {
  const account = getById(id);
  if (!account) return null;
  const balance = Number(account.balance) + delta;
  const availableBalance = Number(account.availableBalance) + delta;
  return update(id, { balance, availableBalance });
}

export function replaceAll(accounts) {
  return writeJsonFile(FILE, accounts);
}

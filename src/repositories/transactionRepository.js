import "server-only";
import { DATA_FILES, appendJsonRecord, readJsonFile, updateJsonRecord, writeJsonFile } from "@/lib/filesystem/jsonStore";
import { nextSequentialId } from "@/lib/utils/id";

const FILE = DATA_FILES.TRANSACTIONS;

export function getAll() {
  return readJsonFile(FILE, []);
}

export function getById(id) {
  return getAll().find((txn) => txn.id === id) ?? null;
}

export function getByUserId(userId) {
  return getAll()
    .filter((txn) => txn.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getByAccountId(accountId) {
  return getAll().filter((txn) => txn.accountId === accountId);
}

/** Transactions from this account within the last `windowMinutes` (used for velocity checks). */
export function getRecentByAccountId(accountId, windowMinutes = 10, beforeIso = new Date().toISOString()) {
  const cutoff = new Date(beforeIso).getTime() - windowMinutes * 60 * 1000;
  return getByAccountId(accountId).filter((txn) => new Date(txn.createdAt).getTime() >= cutoff);
}

export function create(transactionData) {
  const transactions = getAll();
  const record = {
    id: nextSequentialId(transactions, "TXN", 5),
    createdAt: new Date().toISOString(),
    ...transactionData,
  };
  return appendJsonRecord(FILE, record);
}

export function update(id, updates) {
  return updateJsonRecord(FILE, id, updates);
}

export function replaceAll(transactions) {
  return writeJsonFile(FILE, transactions);
}

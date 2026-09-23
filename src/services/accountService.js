import "server-only";
import * as accountRepository from "@/repositories/accountRepository";

export function listForUser(userId) {
  return accountRepository.getByUserId(userId);
}

/** Returns the account only if it belongs to this user - enforces data ownership. */
export function getForUser(userId, accountId) {
  const account = accountRepository.getById(accountId);
  if (!account || account.userId !== userId) return null;
  return account;
}

export function totalsForUser(userId) {
  const accounts = listForUser(userId);
  return {
    accounts,
    totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0),
    totalAvailable: accounts.reduce((sum, account) => sum + account.availableBalance, 0),
  };
}

export function getById(accountId) {
  return accountRepository.getById(accountId);
}

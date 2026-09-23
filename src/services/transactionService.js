import "server-only";
import * as accountRepository from "@/repositories/accountRepository";
import * as transactionRepository from "@/repositories/transactionRepository";
import * as notificationRepository from "@/repositories/notificationRepository";
import * as fraudService from "@/services/fraudService";
import * as alertService from "@/services/alertService";
import * as auditService from "@/services/auditService";
import { validateTransferInput } from "@/lib/validation/rules";
import { formatCurrency } from "@/lib/utils/format";

export class TransferError extends Error {
  constructor(message, fieldErrors = {}) {
    super(message);
    this.name = "TransferError";
    this.fieldErrors = fieldErrors;
  }
}

// LOW/MEDIUM post immediately; HIGH holds the funds until an analyst decides.
const STATUS_BY_DECISION = { APPROVED: "COMPLETED", REVIEW: "REVIEW", FLAGGED: "FLAGGED" };

/**
 * Transfer Request -> transactionService -> fraudService -> transactionRepository
 * -> alertRepository -> auditRepository  (per the Phase-1 architecture)
 */
export function createTransfer(user, input) {
  const errors = validateTransferInput(input);
  if (Object.keys(errors).length) throw new TransferError("Enter valid transfer details.", errors);

  const account = accountRepository.getById(input.accountId);
  if (!account || account.userId !== user.id) {
    throw new TransferError("Select a valid account to send from.", { accountId: "Account not found." });
  }
  if (account.status !== "ACTIVE") {
    throw new TransferError("This account cannot send money right now.");
  }

  const amount = Number(input.amount);
  if (amount > account.availableBalance) {
    throw new TransferError("Insufficient balance for this transfer.", { amount: "Amount exceeds your available balance." });
  }

  const receiverDigits = String(input.receiverAccount).replace(/\s/g, "");
  if (receiverDigits === account.accountNumber) {
    throw new TransferError("You cannot transfer to the same account.", { receiverAccount: "Enter a different account." });
  }

  const timestamp = new Date().toISOString();
  const analysis = fraudService.analyzeTransfer({
    account,
    user,
    amount,
    timestamp,
    deviceFingerprint: input.deviceFingerprint,
    location: input.location,
  });

  fraudService.registerDeviceIfNeeded({
    user,
    deviceFingerprint: input.deviceFingerprint,
    deviceLabel: input.deviceLabel,
  });

  const status = STATUS_BY_DECISION[analysis.decision];

  const transaction = transactionRepository.create({
    accountId: account.id,
    userId: user.id,
    type: input.transactionType,
    amount,
    description: input.description?.trim() || `Transfer to ${receiverDigits.slice(-4)}`,
    receiverAccount: receiverDigits,
    receiverName: "External account",
    device: input.deviceLabel || "Unrecognised device",
    location: input.location || user.homeCity || "-",
    fraudProbability: analysis.fraudProbability,
    riskLevel: analysis.riskLevel,
    reasons: analysis.reasons,
    status,
    createdAt: timestamp,
  });

  if (status === "COMPLETED" || status === "REVIEW") {
    accountRepository.adjustBalance(account.id, -amount);
  }

  auditService.log({
    userId: user.id,
    userName: user.name,
    action: "TRANSACTION_CREATED",
    resourceType: "TRANSACTION",
    resourceId: transaction.id,
    metadata: { amount, riskLevel: analysis.riskLevel, status },
  });

  let alert = null;
  if (analysis.riskLevel === "HIGH") {
    alert = alertService.createFromTransaction(transaction);
    notificationRepository.create({
      userId: user.id,
      type: "SECURITY",
      title: "Transaction flagged for review",
      message: `Your transfer of ${formatCurrency(amount)} was flagged and is being reviewed by our fraud team.`,
    });
  }

  return { transaction, analysis, alert };
}

export function listForUser(userId) {
  return transactionRepository.getByUserId(userId);
}

export function getForUser(userId, transactionId) {
  const txn = transactionRepository.getById(transactionId);
  if (!txn || txn.userId !== userId) return null;
  return txn;
}

export function listAll(filters = {}) {
  let all = transactionRepository.getAll();
  if (filters.riskLevel) all = all.filter((t) => t.riskLevel === filters.riskLevel);
  if (filters.status) all = all.filter((t) => t.status === filters.status);
  if (filters.type) all = all.filter((t) => t.type === filters.type);
  return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getById(id) {
  return transactionRepository.getById(id);
}

export function recentActivityForAccount(accountId, excludeId, limit = 6) {
  return transactionRepository
    .getByAccountId(accountId)
    .filter((t) => t.id !== excludeId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}

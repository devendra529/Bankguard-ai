import "server-only";
import * as transactionRepository from "@/repositories/transactionRepository";
import * as deviceRepository from "@/repositories/deviceRepository";
import * as fraudRuleRepository from "@/repositories/fraudRuleRepository";
import * as loginHistoryRepository from "@/repositories/loginHistoryRepository";
import * as auditService from "@/services/auditService";
import { analyzeTransaction } from "@/lib/fraud/fraudEngine";
import { getDecision } from "@/lib/fraud/fraudConfig";

/**
 * Runs the simulated fraud engine for a proposed transfer. Pure read - does
 * not persist anything. Callers (transactionService) decide what to do with
 * the result.
 */
export function analyzeTransfer({ account, user, amount, timestamp, deviceFingerprint, location }) {
  const rules = fraudRuleRepository.getActive();
  const recentTransactionCount = transactionRepository.getRecentByAccountId(account.id, 10, timestamp).length;

  let isNewDevice = true;
  if (deviceFingerprint) {
    isNewDevice = !deviceRepository.findByFingerprint(user.id, deviceFingerprint);
  }

  const isNewLocation = Boolean(location) && Boolean(user.homeCity) && location !== user.homeCity;
  const recentFailedLogins = loginHistoryRepository.getRecentFailedCount(user.id, 30);

  const context = {
    amount,
    balanceBeforeTransaction: account.availableBalance,
    recentTransactionCount,
    isNewDevice,
    isNewLocation,
    recentFailedLogins,
    timestamp,
  };

  const result = analyzeTransaction(context, rules);
  return { ...result, decision: getDecision(result.riskLevel), isNewDevice, isNewLocation };
}

/** Remembers this browser/device fingerprint against the user for next time. */
export function registerDeviceIfNeeded({ user, deviceFingerprint, deviceLabel }) {
  if (!deviceFingerprint) return null;
  const existing = deviceRepository.findByFingerprint(user.id, deviceFingerprint);
  if (existing) {
    deviceRepository.touch(existing.id);
    return existing;
  }
  return deviceRepository.create({
    userId: user.id,
    deviceId: deviceFingerprint,
    deviceName: deviceLabel || "Unrecognised device",
    os: "-",
    browser: "-",
    isTrusted: true,
  });
}

// ---- Fraud rule management (used by the admin /admin/rules page) ----

export function listRules() {
  return fraudRuleRepository.getAll();
}

export function updateRule(id, updates, actor) {
  const updated = fraudRuleRepository.update(id, updates);
  if (updated) {
    auditService.log({
      userId: actor.id,
      userName: actor.name,
      action: "RULE_UPDATED",
      resourceType: "FRAUD_RULE",
      resourceId: id,
      metadata: updates,
    });
  }
  return updated;
}

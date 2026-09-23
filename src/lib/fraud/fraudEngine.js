import { getRiskLevel } from "@/lib/fraud/fraudConfig";

/**
 * Simulated fraud detection engine - NOT a machine-learning model.
 *
 * Each "signal" below is a small, independent function that inspects one
 * aspect of the transaction and, if it fires, contributes its configured
 * weight to the overall fraud probability along with a human-readable
 * reason. Signals only use the rule from `rules` matching their key, and
 * skip entirely when that rule is disabled - so an admin's rule changes
 * take effect immediately.
 *
 * This module is intentionally isolated (no imports from services or
 * repositories) so a real ML model can be dropped in behind the same
 * `analyzeTransaction()` signature in Phase 2.
 */

function findRule(rules, key) {
  return rules.find((rule) => rule.key === key && rule.enabled);
}

function signalLargeTransaction(context, rules) {
  const rule = findRule(rules, "LARGE_TRANSACTION");
  if (!rule) return null;
  if (context.amount >= rule.threshold) {
    return { weight: rule.weight, reason: "Unusually high transaction amount" };
  }
  return null;
}

function signalAmountToBalanceRatio(context, rules) {
  const rule = findRule(rules, "HIGH_AMOUNT_RATIO");
  if (!rule || !context.balanceBeforeTransaction) return null;
  const ratio = context.amount / context.balanceBeforeTransaction;
  if (ratio >= rule.threshold) {
    return { weight: rule.weight, reason: "High amount-to-balance ratio" };
  }
  return null;
}

function signalVelocity(context, rules) {
  const rule = findRule(rules, "HIGH_VELOCITY");
  if (!rule) return null;
  if (context.recentTransactionCount >= rule.threshold) {
    return { weight: rule.weight, reason: "High transaction velocity" };
  }
  return null;
}

function signalNewDevice(context, rules) {
  const rule = findRule(rules, "NEW_DEVICE");
  if (!rule) return null;
  if (context.isNewDevice) {
    return { weight: rule.weight, reason: "New device detected" };
  }
  return null;
}

function signalNewLocation(context, rules) {
  const rule = findRule(rules, "NEW_LOCATION");
  if (!rule) return null;
  if (context.isNewLocation) {
    return { weight: rule.weight, reason: "Unusual location for this account" };
  }
  return null;
}

function signalUnusualTime(context, rules) {
  const rule = findRule(rules, "UNUSUAL_TIME");
  if (!rule) return null;
  const hour = new Date(context.timestamp).getHours();
  if (hour >= 0 && hour < 5) {
    return { weight: rule.weight, reason: "Unusual transaction time" };
  }
  return null;
}

function signalFailedLogins(context) {
  // Not tied to an editable rule - a direct account-security signal.
  if (context.recentFailedLogins >= 3) {
    return { weight: 0.1, reason: "Multiple recent failed login attempts" };
  }
  return null;
}

const SIGNALS = [
  signalLargeTransaction,
  signalAmountToBalanceRatio,
  signalVelocity,
  signalNewDevice,
  signalNewLocation,
  signalUnusualTime,
  signalFailedLogins,
];

/**
 * @param {object} context
 * @param {number} context.amount
 * @param {number} context.balanceBeforeTransaction
 * @param {number} context.recentTransactionCount  transactions by this account in the last 10 minutes
 * @param {boolean} context.isNewDevice
 * @param {boolean} context.isNewLocation
 * @param {number} context.recentFailedLogins
 * @param {string} context.timestamp  ISO date string
 * @param {Array} rules  active fraud rules (from fraud-rules.json)
 * @returns {{ fraudProbability: number, riskLevel: string, reasons: string[] }}
 */
export function analyzeTransaction(context, rules) {
  let probability = 0;
  const reasons = [];

  for (const signal of SIGNALS) {
    const result = signal(context, rules);
    if (result) {
      probability += result.weight;
      reasons.push(result.reason);
    }
  }

  const fraudProbability = Math.min(Math.round(probability * 100) / 100, 1);
  const riskLevel = getRiskLevel(fraudProbability);

  return { fraudProbability, riskLevel, reasons };
}

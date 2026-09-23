/**
 * Single source of truth for fraud risk thresholds and the resulting
 * decision. Nothing else in the app should hard-code these numbers.
 */
export const RISK_THRESHOLDS = Object.freeze({
  LOW_MAX: 0.3, // 0.00 - 0.30 -> LOW
  MEDIUM_MAX: 0.7, // 0.30 - 0.70 -> MEDIUM, 0.70 - 1.00 -> HIGH
});

export const RISK_LEVELS = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
});

export const DECISION_BY_RISK = Object.freeze({
  LOW: "APPROVED",
  MEDIUM: "REVIEW",
  HIGH: "FLAGGED",
});

export function getRiskLevel(fraudProbability) {
  if (fraudProbability >= RISK_THRESHOLDS.MEDIUM_MAX) return RISK_LEVELS.HIGH;
  if (fraudProbability >= RISK_THRESHOLDS.LOW_MAX) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.LOW;
}

export function getDecision(riskLevel) {
  return DECISION_BY_RISK[riskLevel] ?? DECISION_BY_RISK.LOW;
}

/**
 * Default fraud rules. Seeded into data/fraud-rules.json and editable by an
 * admin at /admin/rules. `key` maps a rule to the signal function in
 * fraudEngine.js that it configures; `weight` is how much that signal can
 * contribute to the fraud probability when it fires.
 */
export const DEFAULT_FRAUD_RULES = [
  {
    key: "LARGE_TRANSACTION",
    name: "Large Transaction",
    description: "Flags transfers above a fixed rupee amount.",
    threshold: 50000,
    weight: 0.3,
    severity: "HIGH",
  },
  {
    key: "HIGH_VELOCITY",
    name: "High Transaction Velocity",
    description: "Flags accounts sending several transfers in a short window.",
    threshold: 3,
    weight: 0.2,
    severity: "MEDIUM",
  },
  {
    key: "NEW_DEVICE",
    name: "New Device",
    description: "Flags a transfer made from a device not seen on this account before.",
    threshold: 1,
    weight: 0.2,
    severity: "MEDIUM",
  },
  {
    key: "NEW_LOCATION",
    name: "New Location",
    description: "Flags a transfer made from a city not seen on this account before.",
    threshold: 1,
    weight: 0.15,
    severity: "MEDIUM",
  },
  {
    key: "UNUSUAL_TIME",
    name: "Unusual Transaction Time",
    description: "Flags transfers initiated late at night (00:00-05:00).",
    threshold: 1,
    weight: 0.1,
    severity: "LOW",
  },
  {
    key: "HIGH_AMOUNT_RATIO",
    name: "High Amount-to-Balance Ratio",
    description: "Flags a transfer that moves a large share of the available balance.",
    threshold: 0.5,
    weight: 0.25,
    severity: "HIGH",
  },
];

import { AlertTriangle, CheckCircle2 } from "lucide-react";

/** Bullet list of the fraud engine's reasons for a transaction's risk level. */
export default function FraudReasonList({ reasons = [], riskLevel = "LOW" }) {
  if (!reasons.length) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <CheckCircle2 className="h-4 w-4 text-risk-low" aria-hidden="true" />
        No risk signals were detected for this transaction.
      </p>
    );
  }

  const dotClass = riskLevel === "HIGH" ? "bg-risk-high" : riskLevel === "MEDIUM" ? "bg-risk-medium" : "bg-risk-low";

  return (
    <ul className="space-y-2">
      {reasons.map((reason) => (
        <li key={reason} className="flex items-start gap-2.5 text-sm">
          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} aria-hidden="true" />
          {reason}
        </li>
      ))}
    </ul>
  );
}

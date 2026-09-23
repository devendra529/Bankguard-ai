import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import RiskGauge from "@/components/fraud/RiskGauge";
import FraudReasonList from "@/components/fraud/FraudReasonList";

const META_BY_LEVEL = {
  LOW: { icon: ShieldCheck, text: "This transaction looks safe to proceed.", tone: "text-risk-low" },
  MEDIUM: { icon: ShieldQuestion, text: "Some risk signals were detected. This transaction is held for review.", tone: "text-risk-medium" },
  HIGH: { icon: ShieldAlert, text: "Potential risk detected. A fraud alert has been created.", tone: "text-risk-high" },
};

/** Full risk-analysis card: gauge + reasons + a short verdict. Used on the transfer result and alert pages. */
export default function FraudRiskCard({ fraudProbability, riskLevel, reasons, title = "Fraud security check", className = "" }) {
  const meta = META_BY_LEVEL[riskLevel] ?? META_BY_LEVEL.LOW;
  const Icon = meta.icon;

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 shrink-0 ${meta.tone}`} aria-hidden="true" />
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-0.5 text-sm text-muted">{meta.text}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row">
        <RiskGauge value={fraudProbability} level={riskLevel} trackClassName="text-border" className="text-foreground" />
        <div className="w-full flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Risk factors</p>
          <FraudReasonList reasons={reasons} riskLevel={riskLevel} />
        </div>
      </div>
    </div>
  );
}

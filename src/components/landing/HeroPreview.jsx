import { CheckCircle2, ShieldAlert, Siren } from "lucide-react";
import RiskGauge from "@/components/fraud/RiskGauge";
import MiniAreaChart from "@/components/charts/MiniAreaChart";

const REASONS = [
  "Unusual transaction amount",
  "New device detected",
  "High transaction velocity",
  "Unusual transaction time",
];

const DECISIONS = [
  { id: "TXN-10979", amount: "₹1,200", level: "LOW", status: "Approved" },
  { id: "TXN-10981", amount: "₹42,500", level: "MEDIUM", status: "Review" },
  { id: "TXN-10982", amount: "₹85,000", level: "HIGH", status: "Flagged" },
];

const LEVEL_STYLE = {
  LOW: "bg-risk-low/20 text-emerald-300",
  MEDIUM: "bg-risk-medium/20 text-amber-300",
  HIGH: "bg-risk-high/20 text-red-300",
};

/**
 * The hero's product preview: a static, sample-data view of what the
 * simulated fraud engine produces for a transaction. Not live data.
 */
export default function HeroPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand/20 blur-3xl" aria-hidden="true" />

      <div className="glass rounded-2xl p-5 shadow-float sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-white">Transaction risk analysis</p>
            <p className="mt-0.5 text-xs text-white/55">
              <span className="font-mono">TXN-10982</span> &nbsp;Transfer of ₹85,000
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-risk-high/20 px-2.5 py-1 text-xs font-semibold text-red-300">
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
            Flagged
          </span>
        </div>

        <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
          <RiskGauge value={0.94} level="HIGH" className="text-white" />
          <ul className="w-full flex-1 space-y-2.5">
            {REASONS.map((reason) => (
              <li key={reason} className="flex items-center gap-2.5 text-sm text-white/85">
                <span className="h-2 w-2 shrink-0 rounded-full bg-risk-high" aria-hidden="true" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex items-center gap-2.5 rounded-lg bg-risk-high/15 px-3.5 py-2.5 text-sm text-red-200">
          <Siren className="h-4 w-4 shrink-0" aria-hidden="true" />
          Fraud alert created and assigned for investigation.
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-2xl p-4">
          <p className="text-sm font-semibold text-white">Fraud alerts, last 7 days</p>
          <div className="mt-2">
            <MiniAreaChart height={120} />
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <p className="text-sm font-semibold text-white">Recent decisions</p>
          <ul className="mt-3 space-y-3">
            {DECISIONS.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs text-white/80">{row.id}</p>
                  <p className="text-xs text-white/50">{row.amount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${LEVEL_STYLE[row.level]}`}>
                    {row.level}
                  </span>
                  <span className="inline-flex w-[4.5rem] items-center gap-1 text-xs text-white/70">
                    {row.status === "Approved" && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-risk-low" aria-hidden="true" />
                    )}
                    {row.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-white/45">Sample data from the simulated environment</p>
    </div>
  );
}

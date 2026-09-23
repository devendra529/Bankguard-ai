import { cn } from "@/lib/utils/cn";

/**
 * KPI card: icon, label, big value, optional delta ("+8.4% this month").
 * `tone` colours the icon chip and, for LOW/MEDIUM/HIGH, doubles as a risk cue.
 */
const TONE_CLASSES = {
  default: "bg-navy-900 text-white dark:bg-brand/15 dark:text-brand-soft",
  brand: "bg-brand/10 text-brand",
  low: "bg-risk-low/10 text-emerald-600 dark:text-emerald-300",
  medium: "bg-risk-medium/15 text-amber-600 dark:text-amber-300",
  high: "bg-risk-high/10 text-red-600 dark:text-red-300",
};

export default function StatCard({ icon: Icon, label, value, delta, deltaTone = "positive", tone = "default", className }) {
  return (
    <div className={cn("card flex flex-col gap-3 p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        {Icon && (
          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", TONE_CLASSES[tone] ?? TONE_CLASSES.default)}>
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      {delta && (
        <p className={cn("text-xs font-medium", deltaTone === "negative" ? "text-risk-high" : "text-risk-low")}>
          {delta}
        </p>
      )}
    </div>
  );
}

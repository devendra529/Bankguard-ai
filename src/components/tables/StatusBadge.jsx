import { cn } from "@/lib/utils/cn";

/**
 * Status pill for transactions, alerts and cases. Maps every status string
 * used across the app to one of four visual treatments.
 */
const STYLE_BY_STATUS = {
  COMPLETED: "bg-risk-low/10 text-emerald-700 dark:text-emerald-300",
  APPROVED: "bg-risk-low/10 text-emerald-700 dark:text-emerald-300",
  ACTIVE: "bg-risk-low/10 text-emerald-700 dark:text-emerald-300",
  RESOLVED: "bg-risk-low/10 text-emerald-700 dark:text-emerald-300",
  CLOSED: "bg-surface-muted text-muted",

  REVIEW: "bg-risk-medium/15 text-amber-700 dark:text-amber-300",
  PENDING: "bg-risk-medium/15 text-amber-700 dark:text-amber-300",
  OPEN: "bg-risk-medium/15 text-amber-700 dark:text-amber-300",
  INVESTIGATING: "bg-brand/10 text-brand",
  IN_PROGRESS: "bg-brand/10 text-brand",

  FLAGGED: "bg-risk-high/10 text-red-700 dark:text-red-300",
  BLOCKED: "bg-risk-high/10 text-red-700 dark:text-red-300",
  FAILED: "bg-risk-high/10 text-red-700 dark:text-red-300",
  SUSPENDED: "bg-risk-high/10 text-red-700 dark:text-red-300",
};

const LABEL_OVERRIDES = { IN_PROGRESS: "In progress" };

export default function StatusBadge({ status, className }) {
  const label = LABEL_OVERRIDES[status] ?? (status ? status.charAt(0) + status.slice(1).toLowerCase() : "-");
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STYLE_BY_STATUS[status] ?? "bg-surface-muted text-muted",
        className
      )}
    >
      {label}
    </span>
  );
}

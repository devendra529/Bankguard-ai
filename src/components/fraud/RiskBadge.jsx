import { cn } from "@/lib/utils/cn";

const CLASS_BY_LEVEL = { LOW: "badge-low", MEDIUM: "badge-medium", HIGH: "badge-high" };
const DOT_BY_LEVEL = { LOW: "bg-risk-low", MEDIUM: "bg-risk-medium", HIGH: "bg-risk-high" };

/** Small colour-coded pill for a fraud risk level: LOW (green) / MEDIUM (amber) / HIGH (red). */
export default function RiskBadge({ level = "LOW", className }) {
  return (
    <span className={cn(CLASS_BY_LEVEL[level] ?? CLASS_BY_LEVEL.LOW, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT_BY_LEVEL[level] ?? DOT_BY_LEVEL.LOW)} aria-hidden="true" />
      {level}
    </span>
  );
}

import { cn } from "@/lib/utils/cn";

// Visual colours per risk level (presentation only - thresholds live in the fraud config, Step 5).
const LEVEL_COLOR = { LOW: "#10B981", MEDIUM: "#F59E0B", HIGH: "#EF4444" };

/**
 * Circular fraud-probability gauge.
 * value: 0..1  |  level: "LOW" | "MEDIUM" | "HIGH"
 */
export default function RiskGauge({ value = 0, level = "LOW", size = 132, className, trackClassName = "text-white/10" }) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(value, 0), 1);
  const percent = Math.round(clamped * 100);

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Fraud probability ${percent} percent, ${level.toLowerCase()} risk`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={LEVEL_COLOR[level] ?? LEVEL_COLOR.LOW}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          className="animate-gauge-in"
          style={{ "--gauge-circumference": circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold leading-none tracking-tight">{percent}%</span>
        <span className="mt-1 text-[11px] font-semibold" style={{ color: LEVEL_COLOR[level] }}>
          {level} RISK
        </span>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils/cn";

/** Label + input/select slot + inline error, shared by every auth and profile form. */
export default function FormField({ label, htmlFor, error, hint, children, className }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && <p className="text-xs font-medium text-risk-high">{error}</p>}
      {!error && hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function textInputClass(hasError) {
  return cn(
    "h-11 w-full rounded-lg border bg-background px-3.5 text-sm text-foreground placeholder:text-muted/70",
    hasError ? "border-risk-high" : "border-border"
  );
}

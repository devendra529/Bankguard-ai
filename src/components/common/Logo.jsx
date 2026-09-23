import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * BankGuard AI wordmark.
 * variant="light" is for use on the always-dark navy surfaces (hero, sidebar).
 */
export default function Logo({ href = "/", variant = "default", className }) {
  const onDark = variant === "light";
  return (
    <Link
      href={href}
      aria-label="BankGuard AI home"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-lg",
          onDark ? "bg-white/10 ring-1 ring-white/20" : "bg-navy-900 dark:bg-brand"
        )}
      >
        <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2} aria-hidden="true" />
      </span>
      <span
        className={cn(
          "text-lg font-bold tracking-tight",
          onDark ? "text-white" : "text-foreground"
        )}
      >
        BankGuard <span className={onDark ? "text-brand-soft" : "text-brand"}>AI</span>
      </span>
    </Link>
  );
}

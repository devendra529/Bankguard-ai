import Link from "next/link";
import { Radar, ShieldCheck, Siren } from "lucide-react";
import Logo from "@/components/common/Logo";

const POINTS = [
  { icon: Radar, text: "Real-time transaction monitoring" },
  { icon: ShieldCheck, text: "AI-powered fraud detection" },
  { icon: Siren, text: "24/7 alerting for suspicious activity" },
];

/** Split-screen shell shared by /login, /register and /forgot-password. */
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-900 p-10 text-white lg:flex">
        <div className="hero-grid absolute inset-0 -z-10" aria-hidden="true" />
        <Logo variant="light" />
        <div className="max-w-sm">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Secure Banking. <span className="text-brand-soft">Safer Tomorrow.</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/80">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-white/40">BankGuard AI &middot; Academic fraud detection simulation</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
          <div className="mt-7">{children}</div>
          {footer && <p className="mt-7 text-center text-sm text-muted">{footer}</p>}
          <p className="mt-10 text-center text-xs text-muted/70">
            <Link href="/" className="hover:text-foreground">
              &larr; Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

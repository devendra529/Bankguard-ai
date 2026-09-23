import Link from "next/link";
import { ArrowRight, Landmark, ShieldCheck, UserCog } from "lucide-react";

const ROLES = [
  {
    icon: Landmark,
    name: "Customer",
    text: "Check balances, review transactions and send money. Every transfer gets a risk check first.",
    points: ["Dashboard and accounts", "Transfers with a live risk check", "Security status and alerts"],
    cta: { label: "Open a customer account", href: "/register" },
  },
  {
    icon: ShieldCheck,
    name: "Fraud analyst",
    text: "Watch transaction activity and work through fraud alerts with the full context in front of you.",
    points: ["Transaction monitoring", "Alert triage and investigation", "Approve, block or resolve with notes"],
    cta: { label: "Analyst login", href: "/login?role=analyst" },
  },
  {
    icon: UserCog,
    name: "Administrator",
    text: "Manage who has access, tune the fraud rules and keep a full record of what happened.",
    points: ["Users and analysts", "Fraud rule management", "Audit logs and system activity"],
    cta: { label: "Administrator login", href: "/login?role=admin" },
  },
];

export default function Roles() {
  return (
    <section id="roles" className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          One platform, three workspaces
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">
          Each role sees only what it needs. Access is enforced on the server, not just in the interface.
        </p>

        <div className="card mt-12 grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {ROLES.map(({ icon: Icon, name, text, points, cta }) => (
            <article key={name} className="flex flex-col p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={cta.href}
                className="mt-6 inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-brand hover:underline md:mt-auto"
              >
                {cta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

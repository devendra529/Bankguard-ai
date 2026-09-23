import { Activity, BellRing, FolderSearch, Gauge, KeyRound, Radar } from "lucide-react";

const FEATURES = [
  {
    icon: Activity,
    title: "Real-Time Transaction Monitoring",
    text: "Every transfer is checked the moment it is submitted, before it is approved, sent to review or flagged.",
  },
  {
    icon: Radar,
    title: "Intelligent Fraud Detection",
    text: "Amount, velocity, device, location and time-of-day signals are combined into a single fraud assessment.",
  },
  {
    icon: Gauge,
    title: "Risk Scoring",
    text: "Each transaction gets a fraud probability and a low, medium or high risk level you can act on.",
  },
  {
    icon: BellRing,
    title: "Fraud Alerts",
    text: "High-risk transactions raise an alert automatically, with the reasons that triggered it.",
  },
  {
    icon: FolderSearch,
    title: "Analyst Investigation",
    text: "Review the transaction, the customer and recent activity, then approve, block, resolve or add notes.",
  },
  {
    icon: KeyRound,
    title: "Secure Authentication",
    text: "Role-based access for customers, analysts and administrators, with server-side checks on every page and API.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-background py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for the whole fraud workflow</h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            From the moment money moves to the analyst&apos;s final decision, BankGuard AI keeps every step visible
            and explainable.
          </p>
        </div>

        <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-white dark:bg-brand/20 dark:text-brand-soft">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

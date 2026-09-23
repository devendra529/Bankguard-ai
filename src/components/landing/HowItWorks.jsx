import { ArrowLeftRight, BellRing, FolderSearch, Gauge, Layers, ScanSearch } from "lucide-react";

const STEPS = [
  { icon: ArrowLeftRight, title: "Transaction", text: "A customer submits a transfer." },
  { icon: ScanSearch, title: "Risk analysis", text: "Amount, velocity, device, location and time are checked against active rules." },
  { icon: Gauge, title: "Fraud score", text: "The engine returns a fraud probability between 0 and 1." },
  { icon: Layers, title: "Risk level", text: "The score maps to a low, medium or high risk level." },
  { icon: BellRing, title: "Alert", text: "High-risk transactions are flagged and an alert is raised." },
  { icon: FolderSearch, title: "Investigation", text: "An analyst reviews the evidence, then approves, blocks or resolves." },
];

const DECISIONS = [
  { level: "LOW", outcome: "Approved", dot: "bg-risk-low", text: "Completes immediately." },
  { level: "MEDIUM", outcome: "Review", dot: "bg-risk-medium", text: "Held for an analyst to check." },
  { level: "HIGH", outcome: "Flagged", dot: "bg-risk-high", text: "Blocked from completing and a fraud alert is created." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-navy-900 py-20 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          From transaction to investigation in six steps
        </h2>

        <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          <div
            className="absolute left-6 right-6 top-6 hidden h-px bg-gradient-to-r from-brand/0 via-white/25 to-brand/0 lg:block"
            aria-hidden="true"
          />
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="relative flex gap-4 lg:block">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 bg-navy-800 text-brand-soft">
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand text-[11px] font-bold text-white">
                  {index + 1}
                </span>
              </span>
              <div className="lg:mt-5">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/65">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-3">
          {DECISIONS.map((d) => (
            <div key={d.level} className="bg-navy-800 p-5">
              <div className="flex items-center gap-2 text-sm">
                <span className={`h-2.5 w-2.5 rounded-full ${d.dot}`} aria-hidden="true" />
                <span className="font-semibold">{d.level} risk</span>
                <span className="text-white/40" aria-hidden="true">
                  /
                </span>
                <span className="font-semibold text-white">{d.outcome}</span>
              </div>
              <p className="mt-2 text-sm text-white/65">{d.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

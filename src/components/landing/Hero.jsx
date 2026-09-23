import Link from "next/link";
import { ArrowRight, Eye, FileClock, Radar } from "lucide-react";
import HeroPreview from "@/components/landing/HeroPreview";

const TRUST = [
  { icon: Radar, text: "Real-time monitoring" },
  { icon: Eye, text: "Explainable risk scores" },
  { icon: FileClock, text: "Every action audit-logged" },
];

// Abstract glass towers: [x, width, height]
const TOWERS = [
  [0, 110, 200], [120, 80, 300], [210, 130, 240], [350, 95, 340], [455, 120, 220],
  [585, 85, 280], [680, 140, 200], [830, 90, 320], [930, 120, 240], [1060, 140, 290],
];

function Skyline() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 360"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-64 w-full opacity-40 sm:h-80"
    >
      <defs>
        <linearGradient id="tower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C8DFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0B1B3A" stopOpacity="0" />
        </linearGradient>
        <pattern id="windows" width="14" height="16" patternUnits="userSpaceOnUse">
          <rect x="3" y="4" width="7" height="8" fill="#ffffff" fillOpacity="0.12" />
        </pattern>
      </defs>
      {TOWERS.map(([x, w, h]) => (
        <g key={x}>
          <rect x={x} y={360 - h} width={w} height={h} fill="url(#tower)" />
          <rect x={x} y={360 - h} width={w} height={h} fill="url(#windows)" />
        </g>
      ))}
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      <div className="hero-grid absolute inset-0 -z-10" aria-hidden="true" />
      <Skyline />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-20">
        <div>
          <h1 className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.35rem]">
            Real-Time Banking Fraud Detection &amp; Prevention
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
            Monitor transactions, detect suspicious activity, investigate fraud alerts, and protect banking
            operations with intelligent risk analysis.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="btn-light px-6 py-3">
              Get Started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/login?role=analyst" className="btn-outline-light px-6 py-3">
              Analyst Login
            </Link>
          </div>

          <ul className="mt-10 flex flex-col gap-3 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:gap-x-7">
            {TRUST.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-brand-soft" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}

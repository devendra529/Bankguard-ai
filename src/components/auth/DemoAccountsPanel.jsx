"use client";

import { GraduationCap } from "lucide-react";

export const DEMO_ACCOUNTS = [
  { role: "Customer", email: "customer@bankguard.demo" },
  { role: "Analyst", email: "analyst@bankguard.demo" },
  { role: "Admin", email: "admin@bankguard.demo" },
];
export const DEMO_PASSWORD = "Demo@1234";

/** Dev-only helper so reviewers can try every role without making up data. */
export default function DemoAccountsPanel({ onUse }) {
  return (
    <div className="mt-6 rounded-lg border border-dashed border-border bg-surface-muted/60 p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
        <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
        Demo accounts (development only)
      </p>
      <div className="mt-2.5 space-y-1.5">
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => onUse(account.email, DEMO_PASSWORD)}
            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs hover:bg-surface"
          >
            <span className="font-medium">{account.role}</span>
            <span className="font-mono text-muted">{account.email}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted/80">
        Password for all demo accounts: <span className="font-mono">{DEMO_PASSWORD}</span>
      </p>
    </div>
  );
}

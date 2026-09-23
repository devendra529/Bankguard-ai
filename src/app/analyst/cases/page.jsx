import Link from "next/link";
import { FolderSearch } from "lucide-react";
import DashboardShell from "@/components/common/DashboardShell";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/tables/StatusBadge";
import { requireRole } from "@/lib/auth/guards";
import * as alertService from "@/services/alertService";
import * as userService from "@/services/userService";
import { ROLE_LABELS } from "@/lib/utils/constants";
import { formatDateTime } from "@/lib/utils/format";

export const metadata = { title: "Fraud Cases" };

export default async function AnalystCasesPage() {
  const user = await requireRole("ANALYST");
  const cases = alertService
    .listAllCases()
    .map((c) => ({
      ...c,
      analystName: userService.getById(c.analystId)?.name ?? "Unassigned",
      customerName: userService.getById(c.userId)?.name ?? "Unknown",
    }))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <DashboardShell
      role="ANALYST"
      user={{ name: user.name, roleLabel: ROLE_LABELS.ANALYST }}
      breadcrumbs={[{ label: "Dashboard", href: "/analyst/dashboard" }, { label: "Cases" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">Fraud Cases</h1>
      <p className="mt-1 text-sm text-muted">Investigations opened from flagged transactions.</p>

      <div className="card mt-6 p-5">
        {cases.length === 0 ? (
          <EmptyState icon={FolderSearch} title="No cases yet" description="Cases are created automatically when an analyst starts investigating an alert." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                  <th className="py-2 pr-3 font-medium">Case ID</th>
                  <th className="py-2 pr-3 font-medium">Customer</th>
                  <th className="py-2 pr-3 font-medium">Analyst</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Updated</th>
                  <th className="py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-3 font-mono text-xs">{c.id}</td>
                    <td className="py-2.5 pr-3">{c.customerName}</td>
                    <td className="py-2.5 pr-3">{c.analystName}</td>
                    <td className="py-2.5 pr-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-2.5 pr-3 text-muted">{formatDateTime(c.updatedAt)}</td>
                    <td className="py-2.5">
                      <Link href={`/analyst/alerts/${c.alertId}`} className="text-xs font-semibold text-brand hover:underline">
                        Open alert
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

import Link from "next/link";
import { Ban, ScrollText, ShieldAlert, Siren, UserCog, Users } from "lucide-react";
import DashboardShell from "@/components/common/DashboardShell";
import StatCard from "@/components/common/StatCard";
import ChartCard from "@/components/charts/ChartCard";
import LineTrendChart from "@/components/charts/LineTrendChart";
import { requireRole } from "@/lib/auth/guards";
import * as userService from "@/services/userService";
import * as transactionService from "@/services/transactionService";
import * as alertService from "@/services/alertService";
import * as auditService from "@/services/auditService";
import { ROLE_LABELS } from "@/lib/utils/constants";
import { formatDateTime, timeAgo } from "@/lib/utils/format";

export const metadata = { title: "Admin Dashboard" };

function dayKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

const ACTION_LABEL = (action) =>
  action
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");

export default async function AdminDashboardPage() {
  const user = await requireRole("ADMIN");
  const counts = userService.counts();
  const transactions = transactionService.listAll();
  const alerts = alertService.listAll();
  const auditLogs = auditService.listAll();
  const recentActivity = auditService.recentActivity(8);

  const kpis = {
    totalCustomers: counts.customers,
    totalAnalysts: counts.analysts,
    totalTransactions: transactions.length,
    fraudAlerts: alerts.length,
    blockedTransactions: transactions.filter((t) => t.status === "BLOCKED").length,
  };

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { key: dayKey(d), label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) };
  });
  const activityTrend = days.map((d) => ({ label: d.label, count: auditLogs.filter((l) => dayKey(l.timestamp) === d.key).length }));

  return (
    <DashboardShell
      role="ADMIN"
      user={{ name: user.name, roleLabel: ROLE_LABELS.ADMIN }}
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">Administration</h1>
      <p className="mt-1 text-sm text-muted">Manage BankGuard AI operations and security.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={Users} label="Customers" value={kpis.totalCustomers} tone="brand" />
        <StatCard icon={UserCog} label="Analysts" value={kpis.totalAnalysts} tone="default" />
        <StatCard icon={ShieldAlert} label="Transactions" value={kpis.totalTransactions} tone="default" />
        <StatCard icon={Siren} label="Fraud Alerts" value={kpis.fraudAlerts} tone="medium" />
        <StatCard icon={Ban} label="Blocked" value={kpis.blockedTransactions} tone="high" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <ChartCard title="System Activity" subtitle="Audit log entries, last 7 days">
          <LineTrendChart data={activityTrend} xKey="label" series={[{ key: "count", name: "Events", color: "#2F6BFF" }]} />
        </ChartCard>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">System Activity</h2>
            <Link href="/admin/audit-logs" className="text-xs font-semibold text-brand hover:underline">
              View All
            </Link>
          </div>
          <ul className="mt-3 space-y-3">
            {recentActivity.map((log) => (
              <li key={log.id} className="flex items-start gap-2.5 text-sm">
                <ScrollText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="truncate">
                    <span className="font-medium">{log.userName}</span> &middot; {ACTION_LABEL(log.action)}
                  </p>
                  <p className="text-xs text-muted">{timeAgo(log.timestamp)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/users" className="card flex items-center gap-3 p-4 hover:border-brand/40">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand">
            <Users className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold">Manage Users</span>
        </Link>
        <Link href="/admin/rules" className="card flex items-center gap-3 p-4 hover:border-brand/40">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand">
            <ShieldAlert className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold">Fraud Rules</span>
        </Link>
        <Link href="/admin/audit-logs" className="card flex items-center gap-3 p-4 hover:border-brand/40">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand">
            <ScrollText className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold">Audit Logs</span>
        </Link>
      </div>
    </DashboardShell>
  );
}

import Link from "next/link";
import { ArrowLeftRight, Landmark, ShieldCheck, ShieldAlert, Send, Wallet } from "lucide-react";
import DashboardShell from "@/components/common/DashboardShell";
import StatCard from "@/components/common/StatCard";
import ChartCard from "@/components/charts/ChartCard";
import BarTrendChart from "@/components/charts/BarTrendChart";
import LineTrendChart from "@/components/charts/LineTrendChart";
import StatusBadge from "@/components/tables/StatusBadge";
import RiskBadge from "@/components/fraud/RiskBadge";
import EmptyState from "@/components/common/EmptyState";
import { requireRole } from "@/lib/auth/guards";
import * as accountService from "@/services/accountService";
import * as transactionService from "@/services/transactionService";
import { ROLE_LABELS } from "@/lib/utils/constants";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";

function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function dayKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}
function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export const metadata = { title: "Dashboard" };

export default async function CustomerDashboardPage() {
  const user = await requireRole("CUSTOMER");
  const { accounts, totalBalance, totalAvailable } = accountService.totalsForUser(user.id);
  const transactions = transactionService.listForUser(user.id);

  const now = new Date();
  const spendFor = (key) =>
    transactions.filter((t) => t.status === "COMPLETED" && monthKey(t.createdAt) === key).reduce((s, t) => s + t.amount, 0);
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: monthKey(d), label: d.toLocaleDateString("en-IN", { month: "short" }) };
  });
  const spendingTrend = months.map((m) => ({ label: m.label, amount: spendFor(m.key) }));

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return { key: dayKey(d), label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) };
  });
  const activityTrend = days.map((d) => ({
    label: d.label,
    count: transactions.filter((t) => dayKey(t.createdAt) === d.key).length,
  }));

  const recentTransactions = transactions.slice(0, 5);
  const recentAlerts = transactions.filter((t) => t.riskLevel === "HIGH").slice(0, 4);
  const securityStatus = transactions.some((t) => t.status === "FLAGGED") ? "ATTENTION" : "PROTECTED";
  const monthlySpending = spendFor(monthKey(now));

  return (
    <DashboardShell
      role="CUSTOMER"
      user={{ name: user.name, roleLabel: ROLE_LABELS.CUSTOMER }}
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting()}, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-0.5 text-sm text-muted">Here&apos;s your banking overview.</p>
        </div>
        <Link href="/customer/transfer" className="btn-primary">
          <Send className="h-4 w-4" aria-hidden="true" />
          Transfer Money
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Total Balance" value={formatCurrency(totalBalance)} tone="brand" />
        <StatCard icon={Landmark} label="Available Balance" value={formatCurrency(totalAvailable)} tone="default" />
        <StatCard
          icon={ArrowLeftRight}
          label="Transactions"
          value={transactions.length}
          delta={`${formatCurrency(monthlySpending)} spent this month`}
          deltaTone="positive"
        />
        <StatCard
          icon={securityStatus === "PROTECTED" ? ShieldCheck : ShieldAlert}
          label="Security Status"
          value={securityStatus === "PROTECTED" ? "Protected" : "Needs attention"}
          tone={securityStatus === "PROTECTED" ? "low" : "high"}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Spending Overview" subtitle="Completed transactions, last 6 months">
          <BarTrendChart data={spendingTrend} xKey="label" series={[{ key: "amount", name: "Spent", color: "#2F6BFF" }]} valueFormat="currency" />
        </ChartCard>
        <ChartCard title="Transaction Activity" subtitle="All transactions, last 14 days">
          <LineTrendChart data={activityTrend} xKey="label" series={[{ key: "count", name: "Transactions", color: "#2F6BFF" }]} />
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent Transactions</h2>
            <Link href="/customer/transactions" className="text-xs font-semibold text-brand hover:underline">
              View All
            </Link>
          </div>
          {recentTransactions.length === 0 ? (
            <EmptyState title="No transactions yet" description="Your transfers will show up here." className="mt-4" />
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                    <th className="py-2 pr-3 font-medium">Date</th>
                    <th className="py-2 pr-3 font-medium">Description</th>
                    <th className="py-2 pr-3 font-medium">Amount</th>
                    <th className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((txn) => (
                    <tr key={txn.id} className="border-b border-border last:border-0">
                      <td className="whitespace-nowrap py-2.5 pr-3 text-muted">{formatDateTime(txn.createdAt)}</td>
                      <td className="max-w-[180px] truncate py-2.5 pr-3">{txn.description}</td>
                      <td className="whitespace-nowrap py-2.5 pr-3 font-medium">-{formatCurrency(txn.amount)}</td>
                      <td className="py-2.5">
                        <StatusBadge status={txn.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold">Recent Alerts</h2>
          {recentAlerts.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No security alerts. Your recent activity looks normal.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {recentAlerts.map((txn) => (
                <li key={txn.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-muted">{txn.id}</span>
                    <RiskBadge level={txn.riskLevel} />
                  </div>
                  <p className="mt-1.5 text-sm font-medium">{formatCurrency(txn.amount)}</p>
                  <p className="mt-0.5 text-xs text-muted">{txn.reasons?.[0] ?? "Flagged for review"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/customer/transfer", icon: Send, label: "Transfer Money" },
          { href: "/customer/transactions", icon: ArrowLeftRight, label: "View Transactions" },
          { href: "/customer/accounts", icon: Landmark, label: "View Account" },
          { href: "/customer/security", icon: ShieldCheck, label: "Security" },
        ].map((action) => (
          <Link key={action.href} href={action.href} className="card flex items-center gap-3 p-4 hover:border-brand/40">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
              <action.icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold">{action.label}</span>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        {accounts.length} account{accounts.length !== 1 ? "s" : ""} &middot; Simulated banking data
      </p>
    </DashboardShell>
  );
}

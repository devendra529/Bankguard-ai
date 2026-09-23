import Link from "next/link";
import { AlertTriangle, Ban, Siren, TrendingUp, Users, Clock } from "lucide-react";
import DashboardShell from "@/components/common/DashboardShell";
import StatCard from "@/components/common/StatCard";
import ChartCard from "@/components/charts/ChartCard";
import BarTrendChart from "@/components/charts/BarTrendChart";
import LineTrendChart from "@/components/charts/LineTrendChart";
import DonutChart from "@/components/charts/DonutChart";
import RiskBadge from "@/components/fraud/RiskBadge";
import EmptyState from "@/components/common/EmptyState";
import { requireRole } from "@/lib/auth/guards";
import * as transactionService from "@/services/transactionService";
import * as alertService from "@/services/alertService";
import * as userService from "@/services/userService";
import { ROLE_LABELS } from "@/lib/utils/constants";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";

function dayKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

const TYPE_LABELS = { TRANSFER: "Transfer", UPI: "UPI", BILL_PAYMENT: "Bill payment", CARD: "Card" };
const RISK_COLORS = ["#10B981", "#F59E0B", "#EF4444"];

export const metadata = { title: "Analyst Dashboard" };

export default async function AnalystDashboardPage() {
  const user = await requireRole("ANALYST");
  const transactions = transactionService.listAll();
  const alerts = alertService.listAll();
  const highRisk = transactions.filter((t) => t.riskLevel === "HIGH");

  const kpis = {
    totalTransactions: transactions.length,
    fraudAlerts: alerts.length,
    highRiskTransactions: highRisk.length,
    fraudAmount: transactions.filter((t) => ["FLAGGED", "BLOCKED"].includes(t.status)).reduce((s, t) => s + t.amount, 0),
    pendingInvestigations: alerts.filter((a) => !["RESOLVED", "APPROVED", "BLOCKED"].includes(a.status)).length,
    blockedTransactions: transactions.filter((t) => t.status === "BLOCKED").length,
  };

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { key: dayKey(d), label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) };
  });
  const volume = days.map((d) => ({
    label: d.label,
    transactions: transactions.filter((t) => dayKey(t.createdAt) === d.key).length,
    fraud: transactions.filter((t) => dayKey(t.createdAt) === d.key && t.riskLevel === "HIGH").length,
  }));
  const alertTrend = days.map((d) => ({ label: d.label, alerts: alerts.filter((a) => dayKey(a.createdAt) === d.key).length }));

  const riskDistribution = ["LOW", "MEDIUM", "HIGH"].map((level) => ({
    name: level,
    value: transactions.filter((t) => t.riskLevel === level).length,
  }));

  const fraudByType = Object.entries(TYPE_LABELS).map(([type, label]) => ({
    label,
    count: highRisk.filter((t) => t.type === type).length,
  }));

  const fraudByHour = Array.from({ length: 24 }, (_, hour) => ({
    label: String(hour).padStart(2, "0"),
    count: highRisk.filter((t) => new Date(t.createdAt).getHours() === hour).length,
  }));

  const openAlerts = alerts.filter((a) => !["RESOLVED", "APPROVED", "BLOCKED"].includes(a.status)).slice(0, 6).map((a) => ({
    ...a,
    customerName: userService.getById(a.userId)?.name ?? "Unknown",
  }));

  return (
    <DashboardShell
      role="ANALYST"
      user={{ name: user.name, roleLabel: ROLE_LABELS.ANALYST }}
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">Fraud Operations</h1>
      <p className="mt-1 text-sm text-muted">Monitor and investigate suspicious banking activity.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={TrendingUp} label="Transactions" value={kpis.totalTransactions} tone="brand" />
        <StatCard icon={Siren} label="Fraud Alerts" value={kpis.fraudAlerts} tone="medium" />
        <StatCard icon={AlertTriangle} label="High Risk Transactions" value={kpis.highRiskTransactions} tone="high" />
        <StatCard icon={Ban} label="Fraud Amount" value={formatCurrency(kpis.fraudAmount)} tone="high" />
        <StatCard icon={Clock} label="Pending Investigations" value={kpis.pendingInvestigations} tone="medium" />
        <StatCard icon={Users} label="Blocked Transactions" value={kpis.blockedTransactions} tone="default" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <ChartCard title="Fraud Detection Trend" subtitle="Transactions vs. high-risk flags, last 7 days">
          <BarTrendChart data={volume} xKey="label" series={[{ key: "transactions", name: "Transactions", color: "#2F6BFF" }, { key: "fraud", name: "High risk", color: "#EF4444" }]} />
        </ChartCard>
        <ChartCard title="Risk Distribution" subtitle="All transactions by risk level">
          <DonutChart data={riskDistribution} colors={RISK_COLORS} centerLabel="Total" centerValue={transactions.length} />
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Alert Trend" subtitle="Last 7 days">
          <LineTrendChart data={alertTrend} xKey="label" series={[{ key: "alerts", name: "Alerts", color: "#EF4444" }]} />
        </ChartCard>
        <ChartCard title="Fraud by Transaction Type" subtitle="High-risk transactions">
          <BarTrendChart data={fraudByType} xKey="label" series={[{ key: "count", name: "High risk", color: "#F59E0B" }]} />
        </ChartCard>
        <ChartCard title="Fraud by Hour" subtitle="High-risk transactions, 24h">
          <BarTrendChart data={fraudByHour} xKey="label" series={[{ key: "count", name: "High risk", color: "#EF4444" }]} />
        </ChartCard>
      </div>

      <div className="card mt-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Open Alerts</h2>
          <Link href="/analyst/alerts" className="text-xs font-semibold text-brand hover:underline">
            View All
          </Link>
        </div>
        {openAlerts.length === 0 ? (
          <EmptyState className="mt-4" title="No open alerts" description="Every flagged transaction has been reviewed." />
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                  <th className="py-2 pr-3 font-medium">Alert ID</th>
                  <th className="py-2 pr-3 font-medium">Customer</th>
                  <th className="py-2 pr-3 font-medium">Amount</th>
                  <th className="py-2 pr-3 font-medium">Risk</th>
                  <th className="py-2 pr-3 font-medium">Created</th>
                  <th className="py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {openAlerts.map((alert) => (
                  <tr key={alert.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-3 font-mono text-xs">{alert.id}</td>
                    <td className="py-2.5 pr-3">{alert.customerName}</td>
                    <td className="py-2.5 pr-3 font-medium">{formatCurrency(alert.amount)}</td>
                    <td className="py-2.5 pr-3">
                      <RiskBadge level={alert.riskLevel} />
                    </td>
                    <td className="py-2.5 pr-3 text-muted">{formatDateTime(alert.createdAt)}</td>
                    <td className="py-2.5">
                      <Link href={`/analyst/alerts/${alert.id}`} className="text-xs font-semibold text-brand hover:underline">
                        Investigate
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

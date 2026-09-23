import DashboardShell from "@/components/common/DashboardShell";
import ChartCard from "@/components/charts/ChartCard";
import BarTrendChart from "@/components/charts/BarTrendChart";
import DonutChart from "@/components/charts/DonutChart";
import { requireRole } from "@/lib/auth/guards";
import * as transactionService from "@/services/transactionService";
import * as alertService from "@/services/alertService";
import { ROLE_LABELS } from "@/lib/utils/constants";
import { formatCurrency } from "@/lib/utils/format";

export const metadata = { title: "Reports" };

function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const TYPE_LABELS = { TRANSFER: "Transfer", UPI: "UPI", BILL_PAYMENT: "Bill payment", CARD: "Card" };
const TYPE_COLORS = ["#2F6BFF", "#10B981", "#F59E0B", "#EF4444"];

export default async function AnalystReportsPage() {
  const user = await requireRole("ANALYST");
  const transactions = transactionService.listAll();
  const alerts = alertService.listAll();

  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: monthKey(d), label: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }) };
  });

  const monthlyReport = months.map((m) => {
    const monthTxns = transactions.filter((t) => monthKey(t.createdAt) === m.key);
    const fraudTxns = monthTxns.filter((t) => t.riskLevel === "HIGH");
    return {
      label: m.label,
      total: monthTxns.length,
      fraud: fraudTxns.length,
      fraudAmount: fraudTxns.reduce((s, t) => s + t.amount, 0),
      alerts: alerts.filter((a) => monthKey(a.createdAt) === m.key).length,
    };
  });

  const byType = Object.entries(TYPE_LABELS).map(([type, label]) => ({
    name: label,
    value: transactions.filter((t) => t.type === type).length,
  }));

  const resolvedAlerts = alerts.filter((a) => a.status === "RESOLVED").length;
  const resolutionRate = alerts.length ? Math.round((resolvedAlerts / alerts.length) * 100) : 0;

  return (
    <DashboardShell
      role="ANALYST"
      user={{ name: user.name, roleLabel: ROLE_LABELS.ANALYST }}
      breadcrumbs={[{ label: "Dashboard", href: "/analyst/dashboard" }, { label: "Reports" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      <p className="mt-1 text-sm text-muted">Monthly fraud detection performance across all customers.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-muted">Alerts resolved</p>
          <p className="mt-2 text-2xl font-bold">{resolutionRate}%</p>
          <p className="mt-1 text-xs text-muted">{resolvedAlerts} of {alerts.length} alerts</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-muted">Total fraud exposure</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(monthlyReport.reduce((s, m) => s + m.fraudAmount, 0))}</p>
          <p className="mt-1 text-xs text-muted">Last 6 months, flagged + blocked</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-muted">Avg. alerts / month</p>
          <p className="mt-2 text-2xl font-bold">{Math.round(monthlyReport.reduce((s, m) => s + m.alerts, 0) / monthlyReport.length)}</p>
          <p className="mt-1 text-xs text-muted">Last 6 months</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <ChartCard title="Monthly Transaction & Fraud Volume" subtitle="Last 6 months">
          <BarTrendChart
            data={monthlyReport}
            xKey="label"
            series={[{ key: "total", name: "Transactions", color: "#2F6BFF" }, { key: "fraud", name: "High risk", color: "#EF4444" }]}
          />
        </ChartCard>
        <ChartCard title="Transactions by Type">
          <DonutChart data={byType} colors={TYPE_COLORS} centerLabel="Total" centerValue={transactions.length} />
        </ChartCard>
      </div>

      <div className="card mt-6 p-5">
        <h2 className="text-sm font-semibold">Monthly Summary</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pr-3 font-medium">Month</th>
                <th className="py-2 pr-3 font-medium">Transactions</th>
                <th className="py-2 pr-3 font-medium">High Risk</th>
                <th className="py-2 pr-3 font-medium">Fraud Amount</th>
                <th className="py-2 font-medium">Alerts</th>
              </tr>
            </thead>
            <tbody>
              {monthlyReport.map((m) => (
                <tr key={m.label} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-3 font-medium">{m.label}</td>
                  <td className="py-2.5 pr-3">{m.total}</td>
                  <td className="py-2.5 pr-3">{m.fraud}</td>
                  <td className="py-2.5 pr-3">{formatCurrency(m.fraudAmount)}</td>
                  <td className="py-2.5">{m.alerts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

import { NextResponse } from "next/server";
import * as transactionService from "@/services/transactionService";
import * as alertService from "@/services/alertService";
import { requireApiUser } from "@/lib/auth/apiGuard";

const TYPE_LABELS = { TRANSFER: "Transfer", UPI: "UPI", BILL_PAYMENT: "Bill payment", CARD: "Card" };

function dayKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export async function GET() {
  const { error } = await requireApiUser(["ANALYST", "ADMIN"]);
  if (error) return error;

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

  const alertTrend = days.map((d) => ({
    label: d.label,
    alerts: alerts.filter((a) => dayKey(a.createdAt) === d.key).length,
  }));

  const riskDistribution = ["LOW", "MEDIUM", "HIGH"].map((level) => ({
    name: level,
    value: transactions.filter((t) => t.riskLevel === level).length,
  }));

  const fraudByType = Object.entries(TYPE_LABELS).map(([type, label]) => ({
    label,
    count: highRisk.filter((t) => t.type === type).length,
  }));

  const fraudByHour = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    label: String(hour).padStart(2, "0"),
    count: highRisk.filter((t) => new Date(t.createdAt).getHours() === hour).length,
  }));

  const openAlerts = alerts
    .filter((a) => !["RESOLVED", "APPROVED", "BLOCKED"].includes(a.status))
    .slice(0, 5);

  return NextResponse.json({ kpis, volume, alertTrend, riskDistribution, fraudByType, fraudByHour, openAlerts });
}

import { NextResponse } from "next/server";
import * as userService from "@/services/userService";
import * as transactionService from "@/services/transactionService";
import * as alertService from "@/services/alertService";
import * as auditService from "@/services/auditService";
import { requireApiUser } from "@/lib/auth/apiGuard";

function dayKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export async function GET() {
  const { error } = await requireApiUser(["ADMIN"]);
  if (error) return error;

  const counts = userService.counts();
  const transactions = transactionService.listAll();
  const alerts = alertService.listAll();
  const recentActivity = auditService.recentActivity(8);

  const kpis = {
    totalCustomers: counts.customers,
    totalAnalysts: counts.analysts,
    totalTransactions: transactions.length,
    fraudAlerts: alerts.length,
    blockedTransactions: transactions.filter((t) => t.status === "BLOCKED").length,
    systemActivityToday: auditService
      .listAll()
      .filter((log) => Date.now() - new Date(log.timestamp).getTime() < 24 * 60 * 60 * 1000).length,
  };

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { key: dayKey(d), label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) };
  });
  const activityTrend = days.map((d) => ({
    label: d.label,
    count: auditService.listAll().filter((log) => dayKey(log.timestamp) === d.key).length,
  }));

  return NextResponse.json({ kpis, recentActivity, activityTrend });
}

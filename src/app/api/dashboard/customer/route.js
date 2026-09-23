import { NextResponse } from "next/server";
import * as accountService from "@/services/accountService";
import * as transactionService from "@/services/transactionService";
import * as userService from "@/services/userService";
import { requireApiUser } from "@/lib/auth/apiGuard";

function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET() {
  const { user, error } = await requireApiUser(["CUSTOMER"]);
  if (error) return error;

  const { accounts, totalBalance, totalAvailable } = accountService.totalsForUser(user.id);
  const transactions = transactionService.listForUser(user.id);
  const notifications = userService.listNotifications(user.id, 5);

  const now = new Date();
  const thisMonth = monthKey(now);
  const spendFor = (key) =>
    transactions.filter((t) => t.status === "COMPLETED" && monthKey(t.createdAt) === key).reduce((s, t) => s + t.amount, 0);

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: monthKey(d), label: d.toLocaleDateString("en-IN", { month: "short" }) };
  });

  const flagged = transactions.filter((t) => t.riskLevel === "HIGH" || t.status === "FLAGGED");

  return NextResponse.json({
    accounts,
    totalBalance,
    totalAvailable,
    transactionCount: transactions.length,
    monthlySpending: spendFor(thisMonth),
    spendingTrend: months.map((m) => ({ label: m.label, amount: spendFor(m.key) })),
    recentTransactions: transactions.slice(0, 5),
    recentAlerts: flagged.slice(0, 4),
    securityStatus: flagged.some((t) => t.status === "FLAGGED") ? "ATTENTION" : "PROTECTED",
    notifications,
  });
}

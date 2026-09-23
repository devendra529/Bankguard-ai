import { NextResponse } from "next/server";
import * as alertService from "@/services/alertService";
import * as transactionService from "@/services/transactionService";
import * as userService from "@/services/userService";
import { requireApiUser } from "@/lib/auth/apiGuard";

export async function GET(request) {
  const { error } = await requireApiUser(["ANALYST", "ADMIN"]);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const filters = {
    status: searchParams.get("status") || undefined,
    riskLevel: searchParams.get("riskLevel") || undefined,
  };

  const alerts = alertService.listAll(filters).map((alert) => {
    const transaction = transactionService.getById(alert.transactionId);
    const customer = userService.getById(alert.userId);
    const analyst = alert.assignedAnalystId ? userService.getById(alert.assignedAnalystId) : null;
    return {
      ...alert,
      transaction,
      customerName: customer?.name ?? "Unknown",
      analystName: analyst?.name ?? null,
    };
  });

  return NextResponse.json({ alerts });
}

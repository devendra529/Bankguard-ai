import { NextResponse } from "next/server";
import * as transactionService from "@/services/transactionService";
import { requireApiUser } from "@/lib/auth/apiGuard";

export async function GET(request, { params }) {
  const { user, error } = await requireApiUser(["CUSTOMER", "ANALYST", "ADMIN"]);
  if (error) return error;

  const transaction = transactionService.getById(params.id);
  if (!transaction) return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
  if (user.role === "CUSTOMER" && transaction.userId !== user.id) {
    return NextResponse.json({ error: "You do not have access to this transaction." }, { status: 403 });
  }
  return NextResponse.json({ transaction });
}

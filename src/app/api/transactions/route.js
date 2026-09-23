import { NextResponse } from "next/server";
import * as transactionService from "@/services/transactionService";
import * as userService from "@/services/userService";
import { requireApiUser } from "@/lib/auth/apiGuard";

/**
 * Customer Transfer Page -> POST /api/transactions -> transactionService.js
 * -> fraudService.js -> transactionRepository.js -> alertRepository.js -> auditRepository.js
 */
export async function GET(request) {
  const { user, error } = await requireApiUser(["CUSTOMER", "ANALYST", "ADMIN"]);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const filters = {
    riskLevel: searchParams.get("riskLevel") || undefined,
    status: searchParams.get("status") || undefined,
    type: searchParams.get("type") || undefined,
  };

  const transactions =
    user.role === "CUSTOMER" ? transactionService.listForUser(user.id) : transactionService.listAll(filters);
  return NextResponse.json({ transactions });
}

export async function POST(request) {
  const { user, error } = await requireApiUser(["CUSTOMER"]);
  if (error) return error;

  try {
    const body = await request.json();
    // fraudService (called inside createTransfer) needs homeCity for its
    // location check, which the lean session user does not carry.
    const fullUser = userService.getById(user.id);
    const result = transactionService.createTransfer(fullUser, body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof transactionService.TransferError) {
      return NextResponse.json({ error: err.message, fieldErrors: err.fieldErrors }, { status: 400 });
    }
    console.error("[POST /api/transactions]", err.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

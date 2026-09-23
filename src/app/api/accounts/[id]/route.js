import { NextResponse } from "next/server";
import * as accountService from "@/services/accountService";
import { requireApiUser } from "@/lib/auth/apiGuard";

export async function GET(request, { params }) {
  const { user, error } = await requireApiUser(["CUSTOMER", "ANALYST", "ADMIN"]);
  if (error) return error;

  const account = accountService.getById(params.id);
  if (!account) return NextResponse.json({ error: "Account not found." }, { status: 404 });
  if (user.role === "CUSTOMER" && account.userId !== user.id) {
    return NextResponse.json({ error: "You do not have access to this account." }, { status: 403 });
  }
  return NextResponse.json({ account });
}

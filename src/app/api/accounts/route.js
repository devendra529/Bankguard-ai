import { NextResponse } from "next/server";
import * as accountService from "@/services/accountService";
import { requireApiUser } from "@/lib/auth/apiGuard";

export async function GET() {
  const { user, error } = await requireApiUser(["CUSTOMER"]);
  if (error) return error;
  const accounts = accountService.listForUser(user.id);
  return NextResponse.json({ accounts });
}

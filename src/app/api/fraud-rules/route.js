import { NextResponse } from "next/server";
import * as fraudService from "@/services/fraudService";
import { requireApiUser } from "@/lib/auth/apiGuard";

export async function GET() {
  const { error } = await requireApiUser(["ADMIN", "ANALYST"]);
  if (error) return error;
  return NextResponse.json({ rules: fraudService.listRules() });
}

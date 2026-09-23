import { NextResponse } from "next/server";
import * as auditService from "@/services/auditService";
import { requireApiUser } from "@/lib/auth/apiGuard";

export async function GET(request) {
  const { error } = await requireApiUser(["ADMIN"]);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const filters = {
    action: searchParams.get("action") || undefined,
    resourceType: searchParams.get("resourceType") || undefined,
  };
  const logs = auditService.listAll(filters);
  return NextResponse.json({ logs });
}

import { NextResponse } from "next/server";
import * as authService from "@/services/authService";
import { requireApiUser } from "@/lib/auth/apiGuard";

export async function POST(request) {
  const { user, error } = await requireApiUser(["CUSTOMER", "ANALYST", "ADMIN"]);
  if (error) return error;

  try {
    const body = await request.json();
    await authService.changePassword(user, body);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof authService.AuthError) {
      return NextResponse.json({ error: err.message, fieldErrors: err.fieldErrors }, { status: 400 });
    }
    console.error("[POST /api/auth/change-password]", err.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

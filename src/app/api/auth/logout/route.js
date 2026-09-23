import { NextResponse } from "next/server";
import * as authService from "@/services/authService";
import { getCurrentUser } from "@/lib/auth/guards";
import { SESSION_COOKIE } from "@/lib/auth/session";

export async function POST() {
  const user = await getCurrentUser();
  authService.logout(user);

  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}

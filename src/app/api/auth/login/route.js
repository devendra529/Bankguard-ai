import { NextResponse } from "next/server";
import * as authService from "@/services/authService";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/session";

const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request) {
  try {
    const body = await request.json();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const device = request.headers.get("user-agent")?.slice(0, 120) || "Unknown device";

    const user = await authService.login(body, { ip, device });
    const maxAge = body.remember ? REMEMBER_ME_MAX_AGE : SESSION_MAX_AGE_SECONDS;
    const token = await createSessionToken(user, maxAge);

    const res = NextResponse.json({ user });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    return res;
  } catch (error) {
    if (error instanceof authService.AuthError) {
      return NextResponse.json({ error: error.message, fieldErrors: error.fieldErrors }, { status: 401 });
    }
    console.error("[POST /api/auth/login]", error.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

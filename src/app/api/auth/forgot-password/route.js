import { NextResponse } from "next/server";
import * as authService from "@/services/authService";
import { isValidEmail } from "@/lib/validation/rules";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    authService.requestPasswordReset(email);
    // Always the same response, whether or not the email exists (no user enumeration).
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/auth/forgot-password]", error.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

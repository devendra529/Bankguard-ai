import { NextResponse } from "next/server";
import * as userService from "@/services/userService";
import * as auditService from "@/services/auditService";
import { requireApiUser } from "@/lib/auth/apiGuard";
import { validateRegisterInput } from "@/lib/validation/rules";

export async function GET(request) {
  const { error } = await requireApiUser(["ADMIN"]);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const users = role ? userService.listAll().filter((u) => u.role === role) : userService.listAll();
  return NextResponse.json({ users });
}

/** Admin creates a new ANALYST or ADMIN account (customers self-register). */
export async function POST(request) {
  const { user, error } = await requireApiUser(["ADMIN"]);
  if (error) return error;

  try {
    const body = await request.json();
    if (!["ANALYST", "ADMIN"].includes(body.role)) {
      return NextResponse.json({ error: "Select a valid role." }, { status: 400 });
    }
    const fieldErrors = validateRegisterInput({ ...body, confirmPassword: body.password });
    if (Object.keys(fieldErrors).length) {
      return NextResponse.json({ error: "Check the highlighted fields.", fieldErrors }, { status: 400 });
    }

    const created = await userService.createStaffUser(body);
    auditService.log({
      userId: user.id,
      userName: user.name,
      action: "USER_CREATED",
      resourceType: "USER",
      resourceId: created.id,
      metadata: { role: body.role },
    });
    return NextResponse.json({ user: created }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/users]", err.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import * as userService from "@/services/userService";
import * as auditService from "@/services/auditService";
import { requireApiUser } from "@/lib/auth/apiGuard";

export async function GET(request, { params }) {
  const { error } = await requireApiUser(["ADMIN"]);
  if (error) return error;

  const found = userService.getById(params.id);
  if (!found) return NextResponse.json({ error: "User not found." }, { status: 404 });
  return NextResponse.json({ user: found });
}

export async function PATCH(request, { params }) {
  const { user, error } = await requireApiUser(["ADMIN"]);
  if (error) return error;

  const body = await request.json();
  let updated = null;
  if (body.status) updated = userService.setStatus(params.id, body.status);
  else if (body.role) updated = userService.setRole(params.id, body.role);
  else return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

  if (!updated) return NextResponse.json({ error: "User not found." }, { status: 404 });

  auditService.log({
    userId: user.id,
    userName: user.name,
    action: "USER_UPDATED",
    resourceType: "USER",
    resourceId: params.id,
    metadata: body,
  });
  return NextResponse.json({ user: updated });
}

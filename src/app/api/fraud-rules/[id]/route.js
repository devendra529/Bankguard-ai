import { NextResponse } from "next/server";
import * as fraudService from "@/services/fraudService";
import { requireApiUser } from "@/lib/auth/apiGuard";

export async function PATCH(request, { params }) {
  const { user, error } = await requireApiUser(["ADMIN"]);
  if (error) return error;

  const body = await request.json();
  const updates = {};
  if (typeof body.enabled === "boolean") updates.enabled = body.enabled;
  if (body.threshold !== undefined) updates.threshold = Number(body.threshold);
  if (body.weight !== undefined) updates.weight = Number(body.weight);

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const updated = fraudService.updateRule(params.id, updates, user);
  if (!updated) return NextResponse.json({ error: "Rule not found." }, { status: 404 });
  return NextResponse.json({ rule: updated });
}

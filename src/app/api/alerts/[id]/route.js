import { NextResponse } from "next/server";
import * as alertService from "@/services/alertService";
import * as transactionService from "@/services/transactionService";
import * as userService from "@/services/userService";
import * as accountService from "@/services/accountService";
import { requireApiUser } from "@/lib/auth/apiGuard";

export async function GET(request, { params }) {
  const { error } = await requireApiUser(["ANALYST", "ADMIN"]);
  if (error) return error;

  const alert = alertService.getById(params.id);
  if (!alert) return NextResponse.json({ error: "Alert not found." }, { status: 404 });

  const transaction = transactionService.getById(alert.transactionId);
  const customer = userService.getById(alert.userId);
  const account = accountService.getById(alert.accountId);
  const analyst = alert.assignedAnalystId ? userService.getById(alert.assignedAnalystId) : null;
  const previousActivity = transaction
    ? transactionService.recentActivityForAccount(alert.accountId, transaction.id, 6)
    : [];

  return NextResponse.json({ alert, transaction, customer, account, analyst, previousActivity });
}

const ACTIONS = ["investigate", "assign", "approve", "block", "resolve", "note"];

export async function PATCH(request, { params }) {
  const { user, error } = await requireApiUser(["ANALYST", "ADMIN"]);
  if (error) return error;

  const body = await request.json();
  const { action, note } = body;
  if (!ACTIONS.includes(action)) {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }
  if (action === "note" && !note?.trim()) {
    return NextResponse.json({ error: "Note cannot be empty." }, { status: 400 });
  }
  if (action === "resolve" && !note?.trim()) {
    return NextResponse.json({ error: "Add a short resolution note." }, { status: 400 });
  }

  let updated;
  if (action === "investigate") updated = alertService.investigate(params.id, user);
  else if (action === "assign") updated = alertService.assign(params.id, user);
  else if (action === "approve") updated = alertService.approve(params.id, user);
  else if (action === "block") updated = alertService.block(params.id, user);
  else if (action === "resolve") updated = alertService.resolve(params.id, user, note.trim());
  else if (action === "note") updated = alertService.addNote(params.id, user, note.trim());

  if (!updated) return NextResponse.json({ error: "Alert not found." }, { status: 404 });
  return NextResponse.json({ alert: updated });
}

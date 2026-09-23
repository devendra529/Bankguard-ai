import { NextResponse } from "next/server";
import * as userService from "@/services/userService";
import { requireApiUser } from "@/lib/auth/apiGuard";

export async function GET() {
  const { user, error } = await requireApiUser(["CUSTOMER", "ANALYST", "ADMIN"]);
  if (error) return error;
  return NextResponse.json({ notifications: userService.listNotifications(user.id) });
}

/** Marks every unread notification for the current user as read. */
export async function PATCH() {
  const { user, error } = await requireApiUser(["CUSTOMER", "ANALYST", "ADMIN"]);
  if (error) return error;
  userService.markAllNotificationsRead(user.id);
  return NextResponse.json({ success: true });
}

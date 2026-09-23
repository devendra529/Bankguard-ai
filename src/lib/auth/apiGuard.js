import "server-only";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/guards";

/**
 * Authorization check for Route Handlers (JSON APIs), where redirect() from
 * next/navigation is not appropriate. Returns { user } on success, or
 * { error: NextResponse } to return immediately: `if (error) return error;`
 */
export async function requireApiUser(roles) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  }
  if (roles && !roles.includes(user.role)) {
    return { error: NextResponse.json({ error: "You do not have access to this resource." }, { status: 403 }) };
  }
  return { user };
}

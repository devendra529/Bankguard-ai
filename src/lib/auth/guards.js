import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

/** Decode + verify the session cookie for the current request. Server-side only. */
export async function getSessionPayload() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** The signed-in user (id, role, name, email), or null when not authenticated. */
export async function getCurrentUser() {
  const payload = await getSessionPayload();
  if (!payload) return null;
  return { id: payload.sub, role: payload.role, name: payload.name, email: payload.email };
}

/** Redirects to /login when there is no valid session. Use in Server Components. */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Redirects to /login (no session) or /unauthorized (wrong role). */
export async function requireRole(roles) {
  const user = await requireAuth();
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) redirect("/unauthorized");
  return user;
}

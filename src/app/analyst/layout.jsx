import { requireRole } from "@/lib/auth/guards";

export default async function AnalystLayout({ children }) {
  await requireRole("ANALYST");
  return children;
}

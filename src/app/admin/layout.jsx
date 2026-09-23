import { requireRole } from "@/lib/auth/guards";

export default async function AdminLayout({ children }) {
  await requireRole("ADMIN");
  return children;
}

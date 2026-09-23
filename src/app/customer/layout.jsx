import { requireRole } from "@/lib/auth/guards";

export default async function CustomerLayout({ children }) {
  await requireRole("CUSTOMER");
  return children;
}

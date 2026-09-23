import DashboardShell from "@/components/common/DashboardShell";
import UsersTable from "@/components/admin/UsersTable";
import { requireRole } from "@/lib/auth/guards";
import * as userService from "@/services/userService";
import { ROLE_LABELS } from "@/lib/utils/constants";

export const metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const user = await requireRole("ADMIN");
  const customers = userService.listCustomers().map((c) => ({ ...c, ...userService.accountSummaryForCustomer(c.id) }));

  return (
    <DashboardShell
      role="ADMIN"
      user={{ name: user.name, roleLabel: ROLE_LABELS.ADMIN }}
      breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Users" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">Users</h1>
      <p className="mt-1 text-sm text-muted">Every customer account on BankGuard AI.</p>

      <div className="mt-6">
        <UsersTable users={customers} role="CUSTOMER" />
      </div>
    </DashboardShell>
  );
}

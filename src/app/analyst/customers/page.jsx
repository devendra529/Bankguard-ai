import DashboardShell from "@/components/common/DashboardShell";
import CustomersDirectory from "@/components/analyst/CustomersDirectory";
import { requireRole } from "@/lib/auth/guards";
import * as userService from "@/services/userService";
import { ROLE_LABELS } from "@/lib/utils/constants";

export const metadata = { title: "Customers" };

export default async function AnalystCustomersPage() {
  const user = await requireRole("ANALYST");
  const customers = userService.listCustomers().map((c) => ({
    ...c,
    ...userService.accountSummaryForCustomer(c.id),
  }));

  return (
    <DashboardShell
      role="ANALYST"
      user={{ name: user.name, roleLabel: ROLE_LABELS.ANALYST }}
      breadcrumbs={[{ label: "Dashboard", href: "/analyst/dashboard" }, { label: "Customers" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
      <p className="mt-1 text-sm text-muted">Every customer with a BankGuard AI account.</p>

      <div className="mt-6">
        <CustomersDirectory customers={customers} />
      </div>
    </DashboardShell>
  );
}

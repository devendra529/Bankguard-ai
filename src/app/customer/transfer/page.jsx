import DashboardShell from "@/components/common/DashboardShell";
import TransferForm from "@/components/customer/TransferForm";
import { requireRole } from "@/lib/auth/guards";
import * as accountService from "@/services/accountService";
import * as userService from "@/services/userService";
import { ROLE_LABELS } from "@/lib/utils/constants";

export const metadata = { title: "Transfer Money" };

export default async function CustomerTransferPage() {
  const sessionUser = await requireRole("CUSTOMER");
  // The session cookie only carries {id, role, name, email} - homeCity lives
  // on the full user record, needed here as the transfer form's default city.
  const user = userService.getById(sessionUser.id);
  const accounts = accountService.listForUser(user.id);

  return (
    <DashboardShell
      role="CUSTOMER"
      user={{ name: user.name, roleLabel: ROLE_LABELS.CUSTOMER }}
      breadcrumbs={[{ label: "Dashboard", href: "/customer/dashboard" }, { label: "Transfer" }]}
    >
      <TransferForm accounts={accounts} homeCity={user.homeCity} />
    </DashboardShell>
  );
}

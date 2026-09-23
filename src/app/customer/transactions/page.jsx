import DashboardShell from "@/components/common/DashboardShell";
import TransactionsTable from "@/components/customer/TransactionsTable";
import { requireRole } from "@/lib/auth/guards";
import * as transactionService from "@/services/transactionService";
import { ROLE_LABELS } from "@/lib/utils/constants";

export const metadata = { title: "Transactions" };

export default async function CustomerTransactionsPage() {
  const user = await requireRole("CUSTOMER");
  const transactions = transactionService.listForUser(user.id);

  return (
    <DashboardShell
      role="CUSTOMER"
      user={{ name: user.name, roleLabel: ROLE_LABELS.CUSTOMER }}
      breadcrumbs={[{ label: "Dashboard", href: "/customer/dashboard" }, { label: "Transactions" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
      <p className="mt-1 text-sm text-muted">Every transfer, payment and card transaction on your accounts.</p>

      <div className="mt-6">
        <TransactionsTable transactions={transactions} />
      </div>
    </DashboardShell>
  );
}

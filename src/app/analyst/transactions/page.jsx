import DashboardShell from "@/components/common/DashboardShell";
import AnalystTransactionsTable from "@/components/analyst/AnalystTransactionsTable";
import { requireRole } from "@/lib/auth/guards";
import * as transactionService from "@/services/transactionService";
import * as userService from "@/services/userService";
import { ROLE_LABELS } from "@/lib/utils/constants";

export const metadata = { title: "Transaction Monitoring" };

export default async function AnalystTransactionsPage() {
  const user = await requireRole("ANALYST");
  const transactions = transactionService.listAll().map((txn) => ({
    ...txn,
    customerName: userService.getById(txn.userId)?.name ?? "Unknown",
  }));

  return (
    <DashboardShell
      role="ANALYST"
      user={{ name: user.name, roleLabel: ROLE_LABELS.ANALYST }}
      breadcrumbs={[{ label: "Dashboard", href: "/analyst/dashboard" }, { label: "Transactions" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">Transaction Monitoring</h1>
      <p className="mt-1 text-sm text-muted">Every transaction across all customer accounts.</p>

      <div className="mt-6">
        <AnalystTransactionsTable transactions={transactions} />
      </div>
    </DashboardShell>
  );
}

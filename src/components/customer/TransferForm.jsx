"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Fingerprint, Radar, ScanSearch, ShieldCheck, Siren } from "lucide-react";
import FormField, { textInputClass } from "@/components/auth/FormField";
import FraudRiskCard from "@/components/fraud/FraudRiskCard";
import { formatCurrency, maskAccountNumber } from "@/lib/utils/format";

const TRANSACTION_TYPES = [
  { value: "TRANSFER", label: "Bank Transfer" },
  { value: "UPI", label: "UPI" },
  { value: "BILL_PAYMENT", label: "Bill Payment" },
  { value: "CARD", label: "Card Payment" },
];
const CITIES = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"];
const DEVICE_KEY = "bankguard_device_id";

function getDeviceFingerprint() {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = `web-${crypto.randomUUID()}`;
    window.localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

const CHECK_ITEMS = [
  { icon: ShieldCheck, label: "Account verification" },
  { icon: Fingerprint, label: "Device check" },
  { icon: Radar, label: "Transaction pattern analysis" },
  { icon: ScanSearch, label: "Real-time fraud detection" },
];

export default function TransferForm({ accounts, homeCity }) {
  const router = useRouter();
  const [form, setForm] = useState({
    accountId: accounts[0]?.id ?? "",
    receiverAccount: "",
    amount: "",
    transactionType: "TRANSFER",
    description: "",
    location: homeCity || "Delhi",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [phase, setPhase] = useState("form"); // form | preview | result
  const [analysis, setAnalysis] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = useState("");

  useEffect(() => setDeviceFingerprint(getDeviceFingerprint()), []);

  const selectedAccount = accounts.find((a) => a.id === form.accountId);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleReview(event) {
    event.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/fraud/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, deviceFingerprint }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.fieldErrors ?? {});
        setFormError(data.error ?? "Enter valid transfer details.");
        return;
      }
      setAnalysis(data.analysis);
      setPhase("preview");

      // A HIGH-risk transfer is flagged automatically - there is nothing left
      // for the customer to confirm, so it is created immediately.
      if (data.analysis.decision === "FLAGGED") {
        await commitTransfer();
      }
    } catch {
      setFormError("Couldn't reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function commitTransfer() {
    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          deviceFingerprint,
          deviceLabel: typeof navigator !== "undefined" ? `Browser on ${navigator.platform || "device"}` : "Web browser",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Something went wrong completing this transfer.");
        return;
      }
      setResult(data);
      setPhase("result");
    } catch {
      setFormError("Couldn't reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function startOver() {
    setForm((f) => ({ ...f, receiverAccount: "", amount: "", description: "" }));
    setAnalysis(null);
    setResult(null);
    setPhase("form");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="card p-6">
        <h2 className="text-lg font-semibold">Transfer Money</h2>
        <p className="mt-1 text-sm text-muted">Send money securely to another account.</p>

        {formError && (
          <p role="alert" className="mt-4 rounded-lg border border-risk-high/30 bg-risk-high/10 px-3.5 py-2.5 text-sm text-red-700 dark:text-red-300">
            {formError}
          </p>
        )}

        <form onSubmit={handleReview} noValidate className="mt-5 space-y-5">
          {accounts.length > 1 && (
            <FormField label="From Account" htmlFor="accountId">
              <select id="accountId" value={form.accountId} onChange={(e) => update("accountId", e.target.value)} className={textInputClass(false)}>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.type} &middot; {maskAccountNumber(account.accountNumber)} &middot; {formatCurrency(account.availableBalance)}
                  </option>
                ))}
              </select>
            </FormField>
          )}

          <FormField label="Receiver Account" htmlFor="receiverAccount" error={errors.receiverAccount}>
            <input
              id="receiverAccount"
              value={form.receiverAccount}
              onChange={(e) => update("receiverAccount", e.target.value)}
              placeholder="Enter account number"
              className={textInputClass(Boolean(errors.receiverAccount))}
            />
          </FormField>

          <FormField label="Amount" htmlFor="amount" error={errors.amount} hint={selectedAccount ? `Available: ${formatCurrency(selectedAccount.availableBalance)}` : undefined}>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">₹</span>
              <input
                id="amount"
                type="number"
                min="1"
                step="1"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
                placeholder="0.00"
                className={`${textInputClass(Boolean(errors.amount))} pl-7`}
              />
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Transaction Type" htmlFor="transactionType" error={errors.transactionType}>
              <select id="transactionType" value={form.transactionType} onChange={(e) => update("transactionType", e.target.value)} className={textInputClass(false)}>
                {TRANSACTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Location" htmlFor="location" hint="Used for fraud location analysis">
              <select id="location" value={form.location} onChange={(e) => update("location", e.target.value)} className={textInputClass(false)}>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Description (Optional)" htmlFor="description">
            <input
              id="description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Enter description"
              className={textInputClass(false)}
            />
          </FormField>

          <button type="submit" disabled={submitting || !accounts.length} className="btn-primary w-full py-3">
            {submitting && phase === "form" ? "Reviewing..." : "Review Transfer"}
          </button>
        </form>
      </div>

      <div>
        {phase === "form" && (
          <div className="card p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
              <div>
                <h3 className="font-semibold">Fraud Security Check</h3>
                <p className="mt-0.5 text-sm text-muted">We&apos;ll analyze your transaction for potential risks before processing.</p>
              </div>
            </div>
            <ul className="mt-5 space-y-3">
              {CHECK_ITEMS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-risk-low" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-lg bg-surface-muted px-3.5 py-2.5 text-xs text-muted">
              Your security is our priority. All transactions are checked using advanced AI models.
            </p>
          </div>
        )}

        {phase === "preview" && analysis && (
          <div className="space-y-4">
            <FraudRiskCard fraudProbability={analysis.fraudProbability} riskLevel={analysis.riskLevel} reasons={analysis.reasons} />
            {analysis.decision === "FLAGGED" ? (
              <div className="card flex items-center gap-2.5 border-risk-high/30 p-4 text-sm text-red-700 dark:text-red-300">
                <Siren className="h-4 w-4 shrink-0" aria-hidden="true" />
                {submitting ? "Securing your account and flagging this transaction..." : "This transaction has been flagged for security review."}
              </div>
            ) : (
              <button type="button" onClick={commitTransfer} disabled={submitting} className="btn-primary w-full py-3">
                {submitting ? "Processing..." : "Complete Transfer"}
              </button>
            )}
          </div>
        )}

        {phase === "result" && result && (
          <div className="space-y-4">
            <FraudRiskCard
              title="Transaction result"
              fraudProbability={result.analysis.fraudProbability}
              riskLevel={result.analysis.riskLevel}
              reasons={result.analysis.reasons}
            />
            <div className="card p-4 text-sm">
              <p className="font-semibold">
                {result.transaction.status === "COMPLETED" && "Transfer completed successfully."}
                {result.transaction.status === "REVIEW" && "Transfer completed and is being monitored."}
                {result.transaction.status === "FLAGGED" && "Transaction temporarily flagged for security review."}
              </p>
              <p className="mt-1 text-muted">
                Reference <span className="font-mono">{result.transaction.id}</span> &middot; {formatCurrency(result.transaction.amount)}
              </p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => router.push("/customer/transactions")} className="btn-secondary flex-1">
                View Details
              </button>
              <button type="button" onClick={startOver} className="btn-primary flex-1">
                New Transfer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

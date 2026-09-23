"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import Modal from "@/components/common/Modal";
import FormField, { textInputClass } from "@/components/auth/FormField";
import { useToast } from "@/components/common/ToastProvider";
import { cn } from "@/lib/utils/cn";

const SEVERITY_STYLE = { LOW: "badge-low", MEDIUM: "badge-medium", HIGH: "badge-high" };

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50",
        checked ? "bg-risk-low" : "bg-surface-muted"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function FraudRulesManager({ rules, compact = false }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [busyId, setBusyId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ threshold: "", weight: "" });

  async function patchRule(id, updates) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/fraud-rules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error ?? "Couldn't update this rule.", "error");
        return;
      }
      showToast("Fraud rule updated.", "success");
      router.refresh();
    } catch {
      showToast("Couldn't reach the server. Try again.", "error");
    } finally {
      setBusyId(null);
    }
  }

  function openEdit(rule) {
    setEditing(rule);
    setForm({ threshold: rule.threshold, weight: rule.weight });
  }

  async function handleSave(event) {
    event.preventDefault();
    await patchRule(editing.id, { threshold: form.threshold, weight: form.weight });
    setEditing(null);
  }

  return (
    <div className="space-y-3">
      {rules.map((rule) => (
        <div key={rule.id} className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{rule.name}</p>
              <span className={SEVERITY_STYLE[rule.severity] ?? "badge-medium"}>{rule.severity}</span>
            </div>
            {!compact && <p className="mt-1 text-sm text-muted">{rule.description}</p>}
            <p className="mt-1.5 text-xs text-muted">
              Threshold: <span className="font-mono">{rule.threshold}</span> &middot; Weight:{" "}
              <span className="font-mono">{rule.weight}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {!compact && (
              <button
                type="button"
                onClick={() => openEdit(rule)}
                aria-label={`Edit ${rule.name}`}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-muted hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <Toggle checked={rule.enabled} disabled={busyId === rule.id} onChange={() => patchRule(rule.id, { enabled: !rule.enabled })} />
          </div>
        </div>
      ))}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing ? `Edit ${editing.name}` : ""}>
        {editing && (
          <form onSubmit={handleSave} className="space-y-4">
            <FormField label="Threshold" htmlFor="threshold" hint="The value that triggers this rule.">
              <input
                id="threshold"
                type="number"
                step="any"
                value={form.threshold}
                onChange={(e) => setForm((f) => ({ ...f, threshold: e.target.value }))}
                className={textInputClass(false)}
              />
            </FormField>
            <FormField label="Weight" htmlFor="weight" hint="How much this rule adds to the fraud probability (0-1).">
              <input
                id="weight"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                className={textInputClass(false)}
              />
            </FormField>
            <button type="submit" className="btn-primary w-full">
              Save changes
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}

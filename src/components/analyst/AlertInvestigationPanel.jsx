"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, CheckCircle2, ClipboardCheck, MessageSquarePlus, ScanSearch, UserCheck } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/common/ToastProvider";
import { formatDateTime } from "@/lib/utils/format";

const ACTIVE_STATUSES = ["OPEN", "INVESTIGATING"];

export default function AlertInvestigationPanel({ alertId, status, assignedAnalystId, currentAnalystId, notes = [] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loadingAction, setLoadingAction] = useState(null);
  const [dialog, setDialog] = useState(null); // "block" | "resolve" | "note" | null
  const [noteDraft, setNoteDraft] = useState("");

  const isMine = assignedAnalystId === currentAnalystId;
  const isClosed = ["APPROVED", "BLOCKED", "RESOLVED"].includes(status);

  async function runAction(action, note) {
    setLoadingAction(action);
    try {
      const res = await fetch(`/api/alerts/${alertId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "That action couldn't be completed.", "error");
        return;
      }
      const MESSAGES = {
        investigate: "Investigation started.",
        assign: "Alert assigned to you.",
        approve: "Transaction approved.",
        block: "Transaction blocked.",
        resolve: "Alert resolved.",
        note: "Note added.",
      };
      showToast(MESSAGES[action] ?? "Done.", "success");
      setDialog(null);
      setNoteDraft("");
      router.refresh();
    } catch {
      showToast("Couldn't reach the server. Try again.", "error");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="card p-6">
      <h2 className="font-semibold">Actions</h2>
      <p className="mt-1 text-sm text-muted">Every action here is recorded in the audit log.</p>

      <div className="mt-4 flex flex-col gap-2.5">
        {!assignedAnalystId && (
          <button type="button" onClick={() => runAction("assign")} disabled={loadingAction !== null} className="btn-secondary justify-start">
            <UserCheck className="h-4 w-4" aria-hidden="true" />
            Assign to me
          </button>
        )}
        {ACTIVE_STATUSES.includes(status) && (
          <button type="button" onClick={() => runAction("investigate")} disabled={loadingAction !== null} className="btn-secondary justify-start">
            <ScanSearch className="h-4 w-4" aria-hidden="true" />
            {status === "INVESTIGATING" ? "Continue investigating" : "Start investigating"}
          </button>
        )}

        <button
          type="button"
          onClick={() => runAction("approve")}
          disabled={loadingAction !== null || isClosed}
          className="btn justify-start bg-risk-low text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Approve transaction
        </button>

        <button
          type="button"
          onClick={() => setDialog("block")}
          disabled={loadingAction !== null || isClosed}
          className="btn justify-start bg-risk-high text-white hover:bg-red-600 disabled:opacity-50"
        >
          <Ban className="h-4 w-4" aria-hidden="true" />
          Block transaction
        </button>

        <button type="button" onClick={() => setDialog("resolve")} disabled={loadingAction !== null || isClosed} className="btn-secondary justify-start">
          <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
          Resolve alert
        </button>

        <button type="button" onClick={() => setDialog("note")} disabled={loadingAction !== null} className="btn-secondary justify-start">
          <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
          Add investigation note
        </button>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <h3 className="text-sm font-semibold">Investigation notes</h3>
        {notes.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No notes yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {notes
              .slice()
              .reverse()
              .map((note, i) => (
                <li key={i} className="rounded-lg border border-border p-3 text-sm">
                  <p className="leading-relaxed">{note.note}</p>
                  <p className="mt-1.5 text-xs text-muted">
                    {note.analystName} &middot; {formatDateTime(note.createdAt)}
                  </p>
                </li>
              ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={dialog === "block"}
        onClose={() => setDialog(null)}
        onConfirm={() => runAction("block")}
        title="Block this transaction?"
        description="The transaction will be marked as blocked and no funds will move. This cannot be undone from here."
        confirmLabel="Block transaction"
        tone="danger"
        loading={loadingAction === "block"}
      />
      <ConfirmDialog
        open={dialog === "resolve"}
        onClose={() => setDialog(null)}
        onConfirm={(note) => runAction("resolve", note)}
        title="Resolve this alert"
        description="Add a short note explaining the outcome of your investigation."
        confirmLabel="Resolve alert"
        requireNote
        notePlaceholder="e.g. Confirmed with customer, transaction is legitimate."
        loading={loadingAction === "resolve"}
      />
      <ConfirmDialog
        open={dialog === "note"}
        onClose={() => setDialog(null)}
        onConfirm={(note) => runAction("note", note)}
        title="Add investigation note"
        confirmLabel="Add note"
        requireNote
        notePlaceholder="What did you find?"
        loading={loadingAction === "note"}
      />
    </div>
  );
}

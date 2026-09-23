"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal";

/**
 * Confirm/cancel dialog, optionally collecting a short note (used for
 * "Block transaction", "Resolve alert", etc). onConfirm receives the note.
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  tone = "primary",
  requireNote = false,
  notePlaceholder = "Add a note...",
  loading = false,
}) {
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onConfirm(note.trim());
    setNote("");
  };

  const confirmClass = tone === "danger" ? "btn bg-risk-high text-white hover:bg-red-600" : "btn-primary";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || (requireNote && !note.trim())}
            className={confirmClass}
          >
            {loading ? "Working..." : confirmLabel}
          </button>
        </>
      }
    >
      {description && <p className="text-sm leading-relaxed text-muted">{description}</p>}
      {requireNote && (
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={notePlaceholder}
          rows={3}
          className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted/70"
        />
      )}
    </Modal>
  );
}

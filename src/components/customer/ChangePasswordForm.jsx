"use client";

import { useState } from "react";
import { CheckCircle2, KeyRound } from "lucide-react";
import FormField, { textInputClass } from "@/components/auth/FormField";
import { useToast } from "@/components/common/ToastProvider";

export default function ChangePasswordForm() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.fieldErrors ?? {});
        showToast(data.error ?? "Couldn't update your password.", "error");
        return;
      }
      showToast("Password updated successfully.", "success");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      showToast("Couldn't reach the server. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField label="Current Password" htmlFor="currentPassword" error={errors.currentPassword}>
        <input
          id="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={(e) => update("currentPassword", e.target.value)}
          className={textInputClass(Boolean(errors.currentPassword))}
        />
      </FormField>
      <FormField label="New Password" htmlFor="newPassword" error={errors.newPassword}>
        <input
          id="newPassword"
          type="password"
          value={form.newPassword}
          onChange={(e) => update("newPassword", e.target.value)}
          className={textInputClass(Boolean(errors.newPassword))}
        />
      </FormField>
      <FormField label="Confirm New Password" htmlFor="confirmPassword" error={errors.confirmPassword}>
        <input
          id="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => update("confirmPassword", e.target.value)}
          className={textInputClass(Boolean(errors.confirmPassword))}
        />
      </FormField>
      <button type="submit" disabled={submitting} className="btn-primary">
        <KeyRound className="h-4 w-4" aria-hidden="true" />
        {submitting ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}

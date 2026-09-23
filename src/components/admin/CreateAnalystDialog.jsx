"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import Modal from "@/components/common/Modal";
import FormField, { textInputClass } from "@/components/auth/FormField";
import { useToast } from "@/components/common/ToastProvider";

const EMPTY = { name: "", email: "", phone: "", password: "" };

export default function CreateAnalystDialog() {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
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
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "ANALYST" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.fieldErrors ?? {});
        showToast(data.error ?? "Couldn't create this analyst.", "error");
        return;
      }
      showToast(`${form.name} was added as an analyst.`, "success");
      setForm(EMPTY);
      setOpen(false);
      router.refresh();
    } catch {
      showToast("Couldn't reach the server. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-primary">
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        Add Analyst
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Add fraud analyst">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField label="Full Name" htmlFor="a-name" error={errors.name}>
            <input id="a-name" value={form.name} onChange={(e) => update("name", e.target.value)} className={textInputClass(Boolean(errors.name))} />
          </FormField>
          <FormField label="Email" htmlFor="a-email" error={errors.email}>
            <input id="a-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={textInputClass(Boolean(errors.email))} />
          </FormField>
          <FormField label="Phone" htmlFor="a-phone" error={errors.phone}>
            <input id="a-phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={textInputClass(Boolean(errors.phone))} />
          </FormField>
          <FormField label="Temporary Password" htmlFor="a-password" error={errors.password} hint="At least 8 characters. Share this with the analyst securely.">
            <input id="a-password" type="text" value={form.password} onChange={(e) => update("password", e.target.value)} className={textInputClass(Boolean(errors.password))} />
          </FormField>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating..." : "Create analyst account"}
          </button>
        </form>
      </Modal>
    </>
  );
}

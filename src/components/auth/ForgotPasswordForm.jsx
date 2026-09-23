"use client";

import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import FormField, { textInputClass } from "@/components/auth/FormField";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-risk-low/30 bg-risk-low/10 p-4 text-sm text-emerald-800 dark:text-emerald-300">
        <p className="flex items-center gap-2 font-semibold">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Check your email
        </p>
        <p className="mt-1.5 leading-relaxed">
          If an account exists for <span className="font-medium">{email}</span>, we&apos;ve sent password reset
          instructions. This is a simulation, so no email is actually sent.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <p role="alert" className="rounded-lg border border-risk-high/30 bg-risk-high/10 px-3.5 py-2.5 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      <FormField label="Email" htmlFor="email">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your@email.com"
            className={`${textInputClass(false)} pl-10`}
          />
        </div>
      </FormField>
      <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
        {submitting ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}

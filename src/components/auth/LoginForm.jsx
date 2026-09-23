"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import FormField, { textInputClass } from "@/components/auth/FormField";
import DemoAccountsPanel from "@/components/auth/DemoAccountsPanel";
import { ROLE_HOME } from "@/lib/utils/constants";

export default function LoginForm({ next }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.fieldErrors ?? {});
        setFormError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      router.push(next || ROLE_HOME[data.user.role] || "/");
      router.refresh();
    } catch {
      setFormError("Couldn't reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {formError && (
          <p role="alert" className="rounded-lg border border-risk-high/30 bg-risk-high/10 px-3.5 py-2.5 text-sm text-red-700 dark:text-red-300">
            {formError}
          </p>
        )}

        <FormField label="Email" htmlFor="email" error={errors.email}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              placeholder="your@email.com"
              className={`${textInputClass(Boolean(errors.email))} pl-10`}
            />
          </div>
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password}>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => update("password", event.target.value)}
              placeholder="Enter your password"
              className={`${textInputClass(Boolean(errors.password))} pl-10 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(event) => update("remember", event.target.checked)}
              className="h-4 w-4 rounded border-border accent-brand"
            />
            Remember me
          </label>
          <a href="/forgot-password" className="font-semibold text-brand hover:underline">
            Forgot password?
          </a>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
          {submitting ? "Signing in..." : "Login"}
        </button>
      </form>

      <DemoAccountsPanel onUse={(email, password) => setForm((f) => ({ ...f, email, password }))} />
    </>
  );
}

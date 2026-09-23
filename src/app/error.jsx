"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import Logo from "@/components/common/Logo";

/** Root error boundary. Never renders error details, stack traces or file paths. */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Server-side detail stays in the server logs; the client only gets a digest.
    console.error("Unhandled UI error", error?.digest ?? "");
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <div className="card w-full max-w-md p-8 text-center">
        <Logo className="mb-6" />
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-risk-high/10 text-risk-high">
          <TriangleAlert className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The page couldn&apos;t be loaded. Try again, and if it keeps happening, return to the home page.
        </p>
        <button type="button" onClick={() => reset()} className="btn-primary mt-7">
          Try again
        </button>
      </div>
    </main>
  );
}

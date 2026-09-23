import Link from "next/link";
import { Compass } from "lucide-react";
import Logo from "@/components/common/Logo";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <div className="card w-full max-w-md p-8 text-center">
        <Logo className="mb-6" />
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-surface-muted text-muted">
          <Compass className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          This page doesn&apos;t exist yet, or the address is wrong. Some sections are built in later steps.
        </p>
        <Link href="/" className="btn-primary mt-7">
          Back to home
        </Link>
      </div>
    </main>
  );
}

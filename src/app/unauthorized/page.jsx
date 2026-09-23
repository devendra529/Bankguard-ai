import Link from "next/link";
import { ShieldX } from "lucide-react";
import Logo from "@/components/common/Logo";
import SignOutButton from "@/components/common/SignOutButton";
import { getCurrentUser } from "@/lib/auth/guards";
import { ROLE_HOME } from "@/lib/utils/constants";

export const metadata = { title: "Unauthorized" };

export default async function UnauthorizedPage() {
  const user = await getCurrentUser();
  const home = user ? ROLE_HOME[user.role] : "/login";

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <div className="card w-full max-w-md p-8 text-center">
        <Logo className="mb-6 justify-center" />
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-risk-high/10 text-risk-high">
          <ShieldX className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">You don&apos;t have access</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {user
            ? `Your account (${user.role.toLowerCase()}) doesn't have permission to view that page.`
            : "You need to be signed in to view that page."}
        </p>
        <div className="mt-7 flex flex-col items-center gap-3">
          <Link href={home} className="btn-primary w-full">
            {user ? "Back to my dashboard" : "Back to login"}
          </Link>
          {user && <SignOutButton variant="button" className="w-full" />}
        </div>
      </div>
    </main>
  );
}

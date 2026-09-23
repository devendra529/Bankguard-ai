import Logo from "@/components/common/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            BankGuard AI is an academic simulation. Customers, accounts and transactions are fictional, and no
            real money moves. It is not a real bank or payment system.
          </p>
        </div>
        <nav aria-label="Footer" className="flex gap-6 text-sm font-medium text-muted">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-foreground">
            How it works
          </a>
          <a href="#roles" className="hover:text-foreground">
            Workspaces
          </a>
        </nav>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        BankGuard AI, Phase 1 (Next.js with JSON file storage)
      </div>
    </footer>
  );
}

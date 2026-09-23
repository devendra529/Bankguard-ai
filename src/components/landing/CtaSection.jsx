import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="bg-background pb-20 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-navy-900 px-7 py-10 text-white sm:px-12 md:flex-row md:items-center dark:border dark:border-white/10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">See the risk engine work on a transfer</h2>
            <p className="mt-2 text-white/70">
              Create a demo account, send a transfer and watch it get scored, then switch to the analyst
              workspace to investigate it.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/register" className="btn-light px-6 py-3">
              Get Started
            </Link>
            <Link href="/login?role=analyst" className="btn-outline-light px-6 py-3">
              Analyst Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

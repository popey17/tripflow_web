import AuthForm from "./AuthForm";
import Link from "next/link";

type Mode = "login" | "register";

export default function AuthShell({ mode }: { mode: Mode }) {
  return (
    <main className="flex min-h-dvh flex-1 flex-col lg:flex-row">
      <BrandPanel />
      <section className="relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8">
        {/* Mobile logo */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2.5 lg:hidden"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-brand-strong to-brand text-white shadow-sm">
            <CompassIcon />
          </div>
          <span className="text-base font-semibold tracking-tight">TripFlow</span>
        </Link>
        <AuthForm initialMode={mode} />
      </section>
    </main>
  );
}

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden border-r border-(--border) bg-card px-12 py-14 lg:flex lg:w-[44%] lg:flex-col lg:justify-between">
      {/* Soft decorative blobs */}
      <div className="animate-float-slow pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-brand-light/60 blur-3xl" />
      <div className="animate-float-slow pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-brand-2/10 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <Link href="/" className="relative flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-brand-strong to-brand text-white shadow-sm">
          <CompassIcon />
        </div>
        <span className="text-lg font-semibold tracking-tight">TripFlow</span>
      </Link>

      <div className="relative max-w-md">
        <span className="mb-4 inline-flex items-center rounded-full border border-brand/20 bg-brand-light/50 px-3 py-1 text-xs font-medium text-brand-strong">
          Travel planning, simplified
        </span>
        <h2 className="text-4xl font-bold leading-tight tracking-tight text-foreground">
          Plan every trip,
          <br />
          day by day.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Create a trip, build the perfect plan, and set a schedule for each day —
          all in one calm, organized place.
        </p>

        <ul className="mt-8 space-y-3.5">
          <Feature title="Create trips" desc="Start a new adventure in seconds." />
          <Feature title="Build your plan" desc="Add places, notes, and ideas." />
          <Feature title="Daily schedules" desc="Map out each day, hour by hour." />
        </ul>
      </div>

      <p className="relative text-sm text-muted">
        Your itinerary, beautifully in flow.
      </p>
    </aside>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand-strong">
        <CheckIcon />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted">{desc}</p>
      </div>
    </li>
  );
}

function CompassIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M15.5 8.5l-2 5-5 2 2-5 5-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

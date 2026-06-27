import AuthForm from "./AuthForm";
import Link from "next/link";

type Mode = "login" | "register";

export default function AuthShell({ mode }: { mode: Mode }) {
  return (
    <main className="flex min-h-dvh flex-1 flex-col lg:flex-row">
      <BrandPanel />
      <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <AuthForm initialMode={mode} />
      </section>
    </main>
  );
}

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-linear-to-br from-brand-strong via-brand to-brand-2 px-12 py-14 text-white lg:flex lg:w-[46%] lg:flex-col lg:justify-between">
      {/* Decorative glows */}
      <div className="animate-float-slow pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
      <div className="animate-float-slow pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-brand-3/30 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <Link href="/" className="relative flex items-center gap-2.5 cursor-pointer">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
          <CompassIcon />
        </div>
        <span className="text-lg font-semibold tracking-tight">TripFlow</span>
      </Link>

      <div className="relative max-w-md">
        <h2 className="text-4xl font-bold leading-tight tracking-tight">
          Plan every trip,
          <br />
          day by day.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/80">
          Create a trip, build the perfect plan, and set a schedule for each day —
          all in one calm, organized place.
        </p>

        <ul className="mt-8 space-y-3.5">
          <Feature title="Create trips" desc="Start a new adventure in seconds." />
          <Feature title="Build your plan" desc="Add places, notes, and ideas." />
          <Feature title="Daily schedules" desc="Map out each day, hour by hour." />
        </ul>
      </div>

      <p className="relative text-sm text-white/60">
        Your itinerary, beautifully in flow.
      </p>
    </aside>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
        <CheckIcon />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-white/70">{desc}</p>
      </div>
    </li>
  );
}

function CompassIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.6" />
      <path
        d="M15.5 8.5l-2 5-5 2 2-5 5-2Z"
        stroke="white"
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
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

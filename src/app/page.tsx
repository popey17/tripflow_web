import AppShell from "./components/AppShell";

export default function Home() {
  return (
    <AppShell>
      <TripsScreen />
    </AppShell>
  );
}

function TripsScreen() {
  return (
    <div className="mx-auto  animate-fade-in-up">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {new Date().getHours() }
          </h1>
          <p className="mt-1 text-sm text-muted">
            Plan every adventure, day by day.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition-all hover:bg-brand-strong hover:shadow-[var(--shadow-md)] active:scale-[0.98]"
        >
          <PlusIcon />
          New Trip
        </button>
      </header>

      {/* Empty state placeholder */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--border) bg-card px-6 py-20 text-center shadow-[var(--shadow-xs)]">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-brand-strong">
          <MapIcon />
        </div>
        <h2 className="text-lg font-semibold text-foreground">No trips yet</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Create your first trip to start building itineraries, daily schedules, and
          travel plans — all in one place.
        </p>
        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-(--border) bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-[var(--shadow-xs)] transition-colors hover:border-brand/30 hover:bg-brand-light/40"
        >
          <PlusIcon />
          Create your first trip
        </button>
      </div>

      {/* Sample trip cards — visual preview only */}
      <div className="mt-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
          Preview
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TripCard
            title="Tokyo Adventure"
            dates="Mar 12 – Mar 20, 2026"
            days={8}
            accent="from-brand-light via-brand/20 to-brand-2/15"
          />
          <TripCard
            title="Bali Retreat"
            dates="Jun 3 – Jun 10, 2026"
            days={7}
            accent="from-brand-2/15 via-brand-light to-brand-3/20"
          />
        </div>
      </div>
    </div>
  );
}

function TripCard({
  title,
  dates,
  days,
  accent,
}: {
  title: string;
  dates: string;
  days: number;
  accent: string;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-(--border) bg-card shadow-[var(--shadow-xs)] transition-all hover:border-brand/20 hover:shadow-[var(--shadow-md)]">
      <div className={`h-24 bg-linear-to-br ${accent}`} />
      <div className="p-4">
        <h3 className="font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted">{dates}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-medium text-brand-strong">
            {days} days
          </span>
        </div>
      </div>
    </article>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 3v15M15 6v15" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

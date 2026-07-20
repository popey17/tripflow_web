"use client";

import { useEffect, useId, useRef, useState } from "react";
import { City, Country } from "country-state-city";

const inputClass =
  "w-full rounded-xl border border-(--border) bg-card px-3.5 py-2.5 text-sm outline-none shadow-(--shadow-xs) transition placeholder:text-muted/50 focus:border-brand focus:ring-2 focus:ring-brand/15 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:border-red-400 aria-[invalid=true]:focus:ring-red-200/60";

type DestinationOption = {
  id: string;
  label: string;
  cityName: string;
  countryName: string;
};

type CountryCitySuggestProps = {
  /** Change to remount and clear fields (e.g. when modal closes) */
  resetKey?: number | string;
  error?: string;
};

export default function CountryCitySuggest({
  resetKey,
  error,
}: CountryCitySuggestProps) {
  return <DestinationSuggestInner key={resetKey ?? 0} error={error} />;
}

function DestinationSuggestInner({ error }: { error?: string }) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<DestinationOption | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const options = filterDestinations(query);
  const showList = open && query.trim().length >= 2;
  const boundedIndex =
    options.length === 0 ? 0 : Math.min(activeIndex, options.length - 1);
  const hasSelection = Boolean(selected && query === selected.label);
  const destination = selected?.label ?? "";

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative space-y-1.5">
      <label htmlFor="trip_destination" className="text-sm font-medium text-foreground">
        Destination
      </label>
      <div className="relative">
        <input
          id="trip_destination"
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showList && options[boundedIndex]
              ? `${listId}-option-${boundedIndex}`
              : undefined
          }
          autoComplete="off"
          placeholder="Start typing a city or country…"
          value={query}
          aria-invalid={Boolean(error)}
          className={`${inputClass} ${hasSelection ? "pr-10" : ""}`}
          onChange={(e) => {
            const next = e.target.value;
            setQuery(next);
            setActiveIndex(0);
            setOpen(true);
            if (selected && next !== selected.label) setSelected(null);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!showList && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
              setOpen(true);
              return;
            }
            if (!showList) return;

            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) =>
                Math.min(i + 1, Math.max(options.length - 1, 0)),
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && options[boundedIndex]) {
              e.preventDefault();
              const option = options[boundedIndex];
              setSelected(option);
              setQuery(option.label);
              setOpen(false);
            } else if (e.key === "Escape") {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
            }
          }}
        />
        {hasSelection && (
          <button
            type="button"
            aria-label="Clear destination"
            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-muted transition-colors hover:bg-surface hover:text-foreground"
            onClick={() => {
              setSelected(null);
              setQuery("");
              setOpen(false);
            }}
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : (
        query.trim().length > 0 &&
        query.trim().length < 2 && (
          <p className="text-xs text-muted">Type at least 2 characters to search</p>
        )
      )}

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-56 w-full overflow-auto rounded-xl border border-(--border) bg-card py-1 shadow-(--shadow-md)"
        >
          {options.length === 0 ? (
            <li className="px-3.5 py-2.5 text-sm text-muted">No places found</li>
          ) : (
            options.map((option, index) => {
              const active = index === boundedIndex;
              return (
                <li
                  key={option.id}
                  id={`${listId}-option-${index}`}
                  role="option"
                  aria-selected={active}
                  className={`cursor-pointer px-3.5 py-2 text-sm transition-colors ${
                    active
                      ? "bg-brand-light text-brand-strong"
                      : "text-foreground hover:bg-surface"
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSelected(option);
                    setQuery(option.label);
                    setOpen(false);
                  }}
                >
                  <span className="font-medium">{option.cityName}</span>
                  <span className="text-muted">, {option.countryName}</span>
                </li>
              );
            })
          )}
        </ul>
      )}

      <input type="hidden" name="destination" value={destination} readOnly />
    </div>
  );
}

let destinationIndex: DestinationOption[] | null = null;

function getDestinationIndex(): DestinationOption[] {
  if (destinationIndex) return destinationIndex;

  const countryNames = new Map(
    Country.getAllCountries().map((c) => [c.isoCode, c.name] as const),
  );

  destinationIndex = City.getAllCities().map((city) => {
    const countryName = countryNames.get(city.countryCode) ?? city.countryCode;
    return {
      id: `${city.countryCode}-${city.stateCode ?? ""}-${city.name}-${city.latitude ?? ""}`,
      label: `${city.name}, ${countryName}`,
      cityName: city.name,
      countryName,
    };
  });

  return destinationIndex;
}

function filterDestinations(query: string): DestinationOption[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const startsWith: DestinationOption[] = [];
  const includes: DestinationOption[] = [];

  for (const option of getDestinationIndex()) {
    const city = option.cityName.toLowerCase();
    const country = option.countryName.toLowerCase();
    const label = option.label.toLowerCase();

    if (city.startsWith(q) || country.startsWith(q) || label.startsWith(q)) {
      startsWith.push(option);
      if (startsWith.length >= 8) break;
    } else if (
      includes.length < 8 &&
      (city.includes(q) || country.includes(q) || label.includes(q))
    ) {
      includes.push(option);
    }
  }

  return [...startsWith, ...includes].slice(0, 8);
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

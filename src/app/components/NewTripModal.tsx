"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import CountryCitySuggest from "./CountryCitySuggest";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "../context/auth-context";


type NewTripModalProps = {
  open: boolean;
  onClose: () => void;
};

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function NewTripModal({ open, onClose }: NewTripModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const mounted = useIsClient();
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState("");
  const [formKey, setFormKey] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});

  const { user } = useAuth();

  function handleClose() {
    setCoverPreview(null);
    setCoverFileName("");
    if (coverInputRef.current) coverInputRef.current.value = "";
    setErrors({});
    setFormKey((k) => k + 1);
    onClose();
  }

  useEffect(() => {
    if (!open) return;

    titleInputRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !e.defaultPrevented) handleClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only rebind when open flips
  }, [open]);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setCoverPreview(null);
      setCoverFileName("");
      return;
    }
    setCoverFileName(file.name);
    setCoverPreview(URL.createObjectURL(file));
  }

  if (!open || !mounted) return null;

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = (formData.get("title") as string)?.trim() ?? "";
    const destination = (formData.get("destination") as string)?.trim() ?? "";
    const startDate = formData.get("start_date") as string;
    const endDate = formData.get("end_date") as string;
    const description = formData.get("description") as string;
    const coverImage = formData.get("cover_image") as string;

    const nextErrors: FormErrors = {};
    if (!title) nextErrors.title = "Title is required.";
    else if (title.length < 3) nextErrors.title = "Title must be at least 3 characters.";
    if (!destination) nextErrors.destination = "Pick a destination from the list.";
    if (!startDate) nextErrors.startDate = "Start date is required.";
    if (!endDate) nextErrors.endDate = "End date is required.";
    else if (startDate && endDate < startDate) {
      nextErrors.endDate = "End date must be on or after the start date.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    
    setErrors({});

    const supabase = createClient();

    const { data, error } = await supabase.from("trips").insert({
      title,
      destination,
      start_date: startDate,
      end_date: endDate,
      description,
      cover_image: coverImage,
      owner_id: user?.user?.id,
    });

    if (error) {
      console.error("error creating trip", error);
      setErrors({ form: error.message });
      return;
    }

    console.log("trip created", data);
    handleClose();
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-fade-in"
        onClick={handleClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-trip-title"
        className="relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-(--border) bg-card shadow-(--shadow-lg) animate-fade-in-up sm:rounded-2xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-(--border) px-5 py-4 sm:px-6">
          <div>
            <h2
              id="new-trip-title"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              New trip
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              Add the basics — you can fill in the plan later.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </header>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleSubmit}
        >
          <div className="space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            {errors.form && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 ring-1 ring-red-100">
                {errors.form}
              </p>
            )}

            <Field label="Title" htmlFor="trip_title" error={errors.title}>
              <input
                ref={titleInputRef}
                id="trip_title"
                name="title"
                type="text"
                placeholder="Tokyo Adventure"
                className={inputClass}
                aria-invalid={Boolean(errors.title)}
              />
            </Field>

            <CountryCitySuggest resetKey={formKey} error={errors.destination} />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start date" htmlFor="trip_start_date" error={errors.startDate}>
                <input
                  id="trip_start_date"
                  name="start_date"
                  type="date"
                  className={inputClass}
                  aria-invalid={Boolean(errors.startDate)}
                />
              </Field>
              <Field label="End date" htmlFor="trip_end_date" error={errors.endDate}>
                <input
                  id="trip_end_date"
                  name="end_date"
                  type="date"
                  className={inputClass}
                  aria-invalid={Boolean(errors.endDate)}
                />
              </Field>
            </div>

            <Field
              label="Description"
              htmlFor="trip_description"
              hint="Optional — a short note about this trip."
            >
              <textarea
                id="trip_description"
                name="description"
                rows={3}
                placeholder="Cherry blossoms, street food, and a day trip to Kyoto…"
                className={`${inputClass} resize-none`}
              />
            </Field>

            <Field
              label="Cover image"
              htmlFor="trip_cover_image"
              hint="Optional — JPEG, PNG, WebP, or GIF."
            >
              <input
                ref={coverInputRef}
                id="trip_cover_image"
                name="cover_image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handleCoverChange}
              />
              {coverPreview ? (
                <div className="overflow-hidden rounded-xl border border-(--border) bg-surface shadow-(--shadow-xs)">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPreview}
                    alt=""
                    className="h-36 w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-3 border-t border-(--border) bg-card px-3 py-2.5">
                    <p className="min-w-0 truncate text-xs text-muted">
                      {coverFileName}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="rounded-lg border border-(--border) bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-surface"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCoverPreview(null);
                          setCoverFileName("");
                          if (coverInputRef.current) coverInputRef.current.value = "";
                        }}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-(--border) bg-surface/40 px-4 py-8 text-center transition-colors hover:border-brand/30 hover:bg-brand-light/30"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand-strong">
                    <ImageIcon />
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    Upload cover image
                  </span>
                  <span className="text-xs text-muted">
                    Click to choose a file
                  </span>
                </button>
              )}
            </Field>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-(--border) bg-surface/30 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-(--shadow-sm) transition-all hover:bg-brand-strong hover:shadow-(--shadow-md) active:scale-[0.98]"
            >
              Create trip
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

type FormErrors = {
  title?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  form?: string;
};

const inputClass =
  "w-full rounded-xl border border-(--border) bg-card px-3.5 py-2.5 text-sm outline-none shadow-(--shadow-xs) transition placeholder:text-muted/50 focus:border-brand focus:ring-2 focus:ring-brand/15 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:border-red-400 aria-[invalid=true]:focus:ring-red-200/60";

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
      <path
        d="M3 16l5-4 3 2.5 4-5 6 6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function SideMenu() {
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  return (
    <nav
      aria-label="Main navigation"
      className="fixed left-5 top-1/2 z-50 flex h-[min(26rem,calc(100dvh-2.5rem))] w-[4.5rem] -translate-y-1/2 flex-col items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-2 py-4 shadow-[0_8px_32px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur-sm"
    >
      {/* Logo */}
      <Link
        href="/"
        className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-brand-strong to-brand text-white shadow-sm transition-transform hover:scale-105"
        aria-label="TripFlow home"
      >
        <CompassIcon />
      </Link>

      <div className="h-px w-8 bg-[var(--border)]" />

      {/* Trips — active home */}
      <Link
        href="/"
        className="group relative mt-2 flex w-full flex-col items-center gap-1 rounded-xl bg-brand/10 px-2 py-2.5 text-brand-strong transition-colors"
        aria-current="page"
      >
        <span className="absolute -left-2 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-brand" />
        <TripsIcon />
        <span className="text-[10px] font-semibold tracking-wide">Trips</span>
      </Link>

      {/* Spacer */}
      <div className="flex-1 min-h-6" />

      {/* Profile */}
      <div ref={menuRef} className="relative w-full">
        {profileOpen && (
          <div className="absolute bottom-full left-full mb-0 ml-3 w-44 animate-fade-in-up overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[0_12px_40px_rgba(15,23,42,0.12)]">
            <div className="border-b border-[var(--border)] px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Jane Doe</p>
              <p className="text-xs text-muted">jane@example.com</p>
            </div>
            <ul className="p-1.5">
              <li>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-brand/8"
                >
                  <UserIcon />
                  Profile
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/8"
                >
                  <SignOutIcon />
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={() => setProfileOpen((o) => !o)}
          aria-expanded={profileOpen}
          aria-haspopup="menu"
          className={`flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2.5 transition-colors ${
            profileOpen
              ? "bg-brand/10 text-brand-strong"
              : "text-muted hover:bg-foreground/5 hover:text-foreground"
          }`}
        >
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-brand-2 to-brand-3 text-xs font-bold text-white ring-2 ring-[var(--card)]">
            JD
          </span>
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </nav>
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

function TripsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 9.5L12 4l9 5.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 21V12h6v9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

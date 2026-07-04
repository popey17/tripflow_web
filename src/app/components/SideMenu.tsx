"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/auth-context";

export default function SideMenu() {
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user,signOut } = useAuth();

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
      className="fixed inset-x-4 bottom-4 z-50 flex h-16 flex-row items-center justify-around gap-1 rounded-2xl border border-(--border) bg-card/90 px-3 shadow-(--shadow-lg) backdrop-blur-md md:static md:z-auto md:h-fit md:w-18 md:flex-col md:justify-start md:px-2 md:py-4 "
    >
      {/* Logo */}
      <Link
        href="/"
        className="hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-strong to-brand text-white shadow-(--shadow-sm) transition-transform hover:scale-105 md:mb-3 md:h-11 md:w-11"
        aria-label="TripFlow home"
      >
        <CompassIcon />
      </Link>

      <div className="hidden h-px w-8 bg-(--border) md:block" />

      {/* Trips — active home */}
      <Link
        href="/"
        className="group relative flex flex-1 flex-col items-center gap-0.5 rounded-xl bg-brand-light/70 px-2 py-2 text-brand-strong transition-colors md:mt-2 md:w-full md:flex-none md:gap-1 md:py-2.5"
        aria-current="page"
      >
        <span className="absolute -top-1 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-brand md:-left-2 md:top-1/2 md:h-5 md:w-1 md:translate-x-0 md:-translate-y-1/2" />
        <TripsIcon />
        <span className="text-[10px] font-semibold tracking-wide">Trips</span>
      </Link>

      {/* Spacer — desktop only */}
      <div className="hidden min-h-6 flex-1 md:block" />

      {/* Profile */}
      <div ref={menuRef} className="relative flex flex-1 md:w-full md:flex-none">
        {profileOpen && (
          <div className="absolute bottom-full left-1/2 mb-3 w-44 -translate-x-1/2 animate-fade-in-up overflow-hidden rounded-xl border border-(--border) bg-card shadow-(--shadow-lg) md:bottom-auto md:left-full md:mb-0 md:ml-3 md:translate-x-0">
            <div className="border-b border-(--border) bg-surface/50 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">{user?.profile?.full_name}</p>
              <p className="text-xs text-muted">{ user?.user?.email }</p>
            </div>
            <ul className="p-1.5">
              <li>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface"
                >
                  <UserIcon />
                  Profile
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                  onClick={signOut}
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
          className={`flex w-full flex-col items-center gap-0.5 rounded-xl px-2 py-2 transition-colors md:gap-1 md:py-2.5 ${
            profileOpen
              ? "bg-brand-light/70 text-brand-strong"
              : "text-muted hover:bg-surface hover:text-foreground"
          }`}
        >
          <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-brand-2/80 to-brand text-[10px] font-bold text-white ring-2 ring-card md:h-8 md:w-8 md:text-xs">
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

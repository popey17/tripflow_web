"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "login" | "register";

export default function AuthForm({ initialMode = "login" }: { initialMode?: Mode }) {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const passwordError = (() => {
    if (mode !== "register" || !password) return "";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (confirmPassword && password !== confirmPassword) return "Passwords do not match.";
    return "";
  })();

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setNotice(null);
    router.replace(`/auth?tab=${next}`, { scroll: false });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (mode === "register" && passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name.trim() } },
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setNotice("Account created! Check your inbox to confirm your email.");
    }
  }
  
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error(error)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-(--border) bg-card/80 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8">
        {/* Tabs */}
        <div className="relative mb-8 grid grid-cols-2 rounded-2xl bg-foreground/5 p-1 text-sm font-medium">
          <span
            className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-xl bg-card shadow-sm ring-1 ring-(--border) transition-transform duration-300 ease-out"
            style={{ transform: mode === "login" ? "translateX(0.25rem)" : "translateX(calc(100% + 0.25rem))" }}
            aria-hidden
          />
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`relative z-10 rounded-xl py-2.5 transition-colors cursor-pointer ${
              mode === "login" ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`relative z-10 rounded-xl py-2.5 transition-colors cursor-pointer ${
              mode === "register" ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            Create account
          </button>
        </div>

        <div key={mode} className="animate-fade-in-up">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              {mode === "login" ? "Welcome back" : "Start planning"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {mode === "login"
                ? "Sign in to pick up your trips where you left off."
                : "Create your free account and map out your next adventure."}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "register" && (
              <Field label="Name" htmlFor="name">
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={1}
                  className={inputClass}
                />
              </Field>
            )}

            <Field label="Email" htmlFor="email">
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </Field>

            <Field label="Password" htmlFor="password">
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-muted hover:text-foreground"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </Field>

            {mode === "register" && (
              <Field label="Confirm password" htmlFor="confirm-password">
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </Field>
            )}

            {(error || passwordError) && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400">
                {error || passwordError}
              </p>
            )}

            {notice && (
              <p className="rounded-lg bg-brand/10 px-3 py-2 text-xs font-medium text-brand-strong">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-brand-strong to-brand-2 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition hover:shadow-xl hover:shadow-brand/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-(--border)" />
            <span className="text-xs uppercase tracking-wide text-muted">or</span>
            <div className="h-px flex-1 bg-(--border)" />
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-(--border) bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:bg-foreground/5"
            onClick={signInWithGoogle}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-muted">
            {mode === "login" ? (
              <>
                New to TripFlow?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="font-semibold text-brand-strong hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-semibold text-brand-strong hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-(--border) bg-card px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/20";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.583-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.583c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.166 6.656 3.583 9 3.583Z"
      />
    </svg>
  );
}

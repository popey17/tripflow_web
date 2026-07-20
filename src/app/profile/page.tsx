"use client";

import { useRef, useState } from "react";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/auth-context";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  return (
    <AppShell>
      <ProfileScreen />
    </AppShell>
  );
}

async function handleSubmit(
  e: React.SubmitEvent<HTMLFormElement>,
  userId: string | undefined,
  refreshUser: () => Promise<void>,
  file: File | null,
  filePath: string,
) {
  e.preventDefault();
  const form = e.currentTarget;
  const fullName = new FormData(form).get("full_name") as string;
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName.trim(),
    })
    .eq("id", userId);
  if (error) {
    console.error("error updating profile", error);
    return { error: error.message };
  }

  if (file) {
    const { error: uploadError } = await supabase.storage
      .from("userProfile")
      .upload(filePath, file, {
        upsert: true,
        cacheControl: "0",
      });

    if (uploadError) {
      console.error("error uploading avatar", uploadError);
      return { error: uploadError.message };
    }

    const { data } = supabase.storage
      .from("userProfile")
      .getPublicUrl(filePath);

    // Same storage path → same base URL; bust browser / next/image cache.
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
      })
      .eq("id", userId);

    if (updateError) {
      console.error("error updating profile", updateError);
      return { error: updateError.message };
    }
  }

  await refreshUser();
  return { success: true };
}

function ProfileScreen() {
  const { user, loading, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  
  const fullName = user?.profile?.full_name ?? "";
  const email = user?.user?.email ?? "";
  const avatarUrl = user?.profile?.avatar_url ?? "";
  const displayAvatar = previewUrl || avatarUrl;
  const initials = getInitials(fullName || email);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const extension = file?.name.split(".").pop()?.toLowerCase();
    const newFileName = `${user?.user?.id}-profile-photo.${extension}`;
    
    if (!file) {
      setPreviewUrl(null);
      setFileName('');
      setFile(null);
      return;
    }

    setFileName(newFileName);
    setPreviewUrl(URL.createObjectURL(file));
    setFile(file);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-xl animate-fade-in-up">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Profile
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage how you appear in TripFlow.
          </p>
        </header>
        <div className="h-72 rounded-2xl border border-(--border) bg-card flex items-center justify-center" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl animate-fade-in-up">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Profile
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage how you appear in TripFlow.
        </p>
      </header>

      <form
        className="overflow-hidden rounded-2xl border border-(--border) bg-card shadow-(--shadow-xs)"
        onSubmit={async (e) => {
          const result = await handleSubmit(
            e,
            user?.user?.id,
            refreshUser,
            file,
            fileName,
          );
          if (result?.success) {
            setPreviewUrl(null);
            setFile(null);
            setFileName("");
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        }}
      >
        {/* Avatar section */}
        <div className="border-b border-(--border) bg-surface/40 px-6 py-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              {displayAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayAvatar}
                  alt=""
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-card shadow-(--shadow-sm)"
                />
              ) : (
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-brand-2/80 to-brand text-xl font-bold text-white ring-4 ring-card shadow-(--shadow-sm)">
                  {initials}
                </span>
              )}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-foreground">
                {fullName || "Your name"}
              </p>
              <p className="mt-0.5 text-xs text-muted">{email || "you@example.com"}</p>
              <input
                ref={fileInputRef}
                id="avatar"
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-(--border) bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-(--shadow-xs) transition-colors hover:bg-surface"
              >
                Update photo
              </button>
              {fileName && (
                <p className="mt-1.5 max-w-56 truncate text-xs text-muted">
                  {fileName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-5 px-6 py-6">
          <Field label="Full name" htmlFor="full_name">
            <input
              id="full_name"
              name="full_name"
              type="text"
              defaultValue={fullName}
              placeholder="Your name"
              className={inputClass}
            />
          </Field>

          <Field label="Email" htmlFor="email" hint="Managed by your account login.">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={email}
              readOnly
              className={`${inputClass} cursor-default bg-surface text-muted`}
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-(--border) bg-surface/30 px-6 py-4">
          <button
            type="button"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-(--shadow-sm) transition-all hover:bg-brand-strong hover:shadow-(--shadow-md) active:scale-[0.98]"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-(--border) bg-card px-3.5 py-2.5 text-sm outline-none shadow-(--shadow-xs) transition placeholder:text-muted/50 focus:border-brand focus:ring-2 focus:ring-brand/15";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

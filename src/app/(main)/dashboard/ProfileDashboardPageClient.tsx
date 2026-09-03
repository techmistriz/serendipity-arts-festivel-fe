"use client";

import Link from "next/link";

import { useAuth } from "@/hooks/use-auth";

import { DashboardShell } from "./DashboardShell";

export function ProfileDashboardPageClient() {
  return (
    <DashboardShell>
      <ProfileContent />
    </DashboardShell>
  );
}

function ProfileContent() {
  const { user } = useAuth();

  // console.log("User detail:", user);

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="label text-muted-foreground">Account information</p>
          <h2 className="mt-2 display text-3xl leading-none uppercase md:text-4xl">My Profile</h2>
        </div>
        <Link
          href="/profile"
          className="label shrink-0 border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background"
        >
          Edit Profile →
        </Link>
      </div>

      <dl className="mt-10 grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
        <ProfileRow label="Name" value={user?.name ?? "—"} />
        <ProfileRow label="Email" value={user?.email ?? "—"} />
        <ProfileRow label="WhatsApp" value={user?.contact ?? "—"} />
        <ProfileRow label="City" value={user?.city?.name ?? "—"} />
        {/* <ProfileRow label="Interests" value={user?.interest ?? "—"} />
        <ProfileRow label="Member since" value={user?.email ?? "—"} /> */}
      </dl>

      <div className="mt-12 border border-foreground p-5 md:p-8">
        <p className="label text-muted-foreground">Data &amp; privacy</p>
        <h3 className="mt-2 display text-2xl leading-none uppercase md:text-3xl">
          Your privacy matters.
        </h3>
        <p className="headline mt-3 max-w-prose text-sm text-muted-foreground md:text-base">
          Review how Serendipity Arts Festival handles your personal information and your available
          choices.
        </p>
        <Link
          href="/privacy"
          className="label mt-6 inline-block border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background"
        >
          Read the privacy policy →
        </Link>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rule-b pb-3">
      <p className="label text-muted-foreground">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}

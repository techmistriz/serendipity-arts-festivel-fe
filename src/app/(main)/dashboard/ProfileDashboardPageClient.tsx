"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { useDeleteAccount } from "@/hooks/use-delete-account";

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
  const { deleteAccount, isDeleting } = useDeleteAccount();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();

    setShowDeleteModal(false);
    setAlertMessage(result.message);
  };

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

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/privacy"
            className="label inline-block border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background"
          >
            Read the privacy policy →
          </Link>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            // disabled={isDeleting}
            className="label inline-block border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete my information →
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md border border-foreground bg-background p-6 md:p-8">
            <p className="label text-muted-foreground">Delete account</p>

            <h3 className="mt-2 display text-2xl uppercase md:text-3xl">Are you sure?</h3>

            <p className="headline mt-4 text-sm text-muted-foreground md:text-base">
              Are you sure you want to schedule your account for deletion? This action will remove
              your personal information.
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="label border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="label border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Alert Modal */}
      {alertMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md border border-foreground bg-background p-6 md:p-8">
            <p className="label text-muted-foreground">Account</p>

            <h3 className="mt-2 display text-2xl uppercase md:text-3xl">Request submitted</h3>

            <p className="headline mt-4 text-sm text-muted-foreground md:text-base">
              {alertMessage}
            </p>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setAlertMessage(null)}
                className="label border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
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

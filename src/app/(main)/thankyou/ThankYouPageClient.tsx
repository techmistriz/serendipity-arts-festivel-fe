"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ThankYouPageClient() {
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const mode = searchParams.get("mode") || "general";

  const passTitle =
    mode === "sea"
      ? "Your SEA Delegate Pass"
      : mode === "guest"
        ? "Your Special Guest Pass"
        : "Your Art Pass";

  return (
    <main className="container-editorial pt-16 pb-40 md:pt-24">
      <h1 className="display uppercase text-[14vw] md:text-[10vw] leading-[0.9]">You’re in.</h1>

      {email && (
        <p className="mt-8 max-w-xl text-muted-foreground">
          A confirmation has been sent to{" "}
          <span className="font-semibold text-foreground">{email}</span>.
        </p>
      )}

      <div className="mt-8 max-w-xl border border-foreground p-6 md:p-8">
        <p className="label text-accent">{passTitle}</p>

        <p className="mt-3 display uppercase text-2xl md:text-3xl leading-[1] tracking-[-0.02em]">
          Sent to your email. Available on the app too.
        </p>

        <p className="mt-4 text-sm text-muted-foreground headline">
          Your pass has been emailed to you and will also be available to download on our Festival
          app.
        </p>
      </div>

      <Link
        href="/programmes"
        className="mt-10 inline-block label border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
      >
        Browse programmes →
      </Link>
    </main>
  );
}

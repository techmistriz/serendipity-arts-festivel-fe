"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "";
  
  const [forgot, setForgot] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <div className="container-editorial pt-12 md:pt-24 pb-32 max-w-lg">
      <h1 className="display uppercase text-[14vw] md:text-[7vw] leading-[0.9]">Login</h1>
      <p className="mt-4 text-muted-foreground headline ">
        Sign in to book your programmes and see dashboard.
      </p>

      {!forgot ? (
       <form
  onSubmit={(e) => {
    e.preventDefault();

    // Navigate only after browser validation passes
    router.push(next || "/dashboard");
  }}
  className="mt-10 space-y-6"
>
          <div>
            <label className="label text-muted-foreground">Email ID or Phone number</label>
            <input
  required
  className="input mt-2"
  placeholder="you@studio.in or +91 98••••••"
/>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <label className="label text-muted-foreground">Password</label>
              <button 
                type="button" 
                onClick={() => setForgot(true)}
                className="label text-accent hover:underline underline-offset-4"
              >
                Forgot password?
              </button>
            </div>
            <input
  required
  type="password"
  className="input mt-2"
/>
          </div>
          <button 
            type="submit"
            className="headline font-semibold uppercase text-lg md:text-xl bg-foreground text-background rounded-full px-8 py-4 hover:bg-accent transition-colors"
          >
            Sign in →
          </button>
          <p className="label pt-4">
            New here?{" "}
            <Link 
              href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} 
              className="text-foreground underline underline-offset-4 hover:text-accent"
            >
              Register instead
            </Link>
          </p>
        </form>
      ) : (
        <div className="mt-10 space-y-6">
          {!sent ? (
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                setSent(true); 
              }} 
              className="space-y-6"
            >
              <p className="text-muted-foreground headline">
                Enter your email or phone number and we'll send a reset link.
              </p>
              <input 
              required
                className="input" 
                placeholder="Email or phone" 
              />
              <div className="flex flex-wrap gap-3">
                <button 
                  type="submit"
                  className="headline uppercase tracking-[0.06em] bg-foreground text-background rounded-full px-6 py-3 hover:bg-accent transition-colors"
                >
                  Send reset link →
                </button>
                <button 
                  type="button" 
                  onClick={() => setForgot(false)}
                  className="headline uppercase tracking-[0.06em] border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
                >
                  Back
                </button>
              </div>
            </form>
          ) : (
            <div className="border border-foreground p-6">
              <p className="label text-accent">Check your inbox</p>
              <p className="mt-3 headline font-semibold uppercase text-2xl leading-[1]">
                We've sent a reset link.
              </p>
              <p className="mt-3 text-sm text-muted-foreground headline">
                Follow the link in the message to set a new password.
              </p>
              <button 
                onClick={() => { 
                  setForgot(false); 
                  setSent(false); 
                }}
                className="mt-6 label text-accent hover:underline underline-offset-4"
              >
                Back to sign in
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
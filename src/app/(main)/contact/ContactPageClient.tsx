"use client";

import { useState } from "react";

import { ContactForm } from "./_components/ContactForm";

export function ContactPageClient() {
  const [isSent, setIsSent] = useState(false);

  if (isSent) {
    return (
      <div className="container-editorial pt-16 pb-40 md:pt-24">
        <h1 className="display text-[12vw] leading-[0.9] uppercase md:text-[8vw]">Thank you.</h1>
        <p className="headline mt-8 max-w-xl text-lg text-muted-foreground">
          We’ve received your message and will get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <div className="container-editorial pt-10 pb-32 md:pt-20">
      <h1 className="display text-[13vw] leading-[0.9] uppercase md:text-[9vw]">Contact</h1>
      <p className="headline mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
        Shoot us your queries, and we’ll get back to you as soon as possible.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-12 md:gap-16">
        <aside className="space-y-6 md:col-span-4">
          <div className="rule-t pt-4">
            <p className="label text-muted-foreground">Email</p>
            <p className="headline mt-1">info@serendipityarts.org</p>
          </div>
        </aside>

        <ContactForm onSuccess={() => setIsSent(true)} />
      </div>
    </div>
  );
}

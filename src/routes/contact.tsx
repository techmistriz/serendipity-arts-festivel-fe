import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Serendipity Arts Festival 2026" },
      { name: "description", content: "Get in touch with the Serendipity Arts Festival team." },
    ],
  }),
  component: Contact,
});

const SUBJECTS = [
  "Not able to register",
  "Not able to book programmes",
  "Participation at the festival",
  "Press & media",
  "Partnerships",
  "Accessibility",
  "Other",
];

const PARTICIPATION_NOTE =
  "Thank you for your interest in participating! Our Festival programmes are selected by our curators, and this year's programming has already been closed. However, we regularly release open calls and grants for select projects — please follow us on Instagram @serendipityartsfoundation to stay updated on future opportunities.";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [sent, setSent] = useState(false);

  const showParticipation = form.subject === "Participation at the festival";

  if (sent) {
    return (
      <div className="container-editorial pt-16 md:pt-24 pb-40">
        <h1 className="display uppercase text-[12vw] md:text-[8vw] leading-[0.9]">Thank you.</h1>
        <p className="mt-8 max-w-xl text-muted-foreground headline text-lg">
          We've received your message and will get back to you as soon as possible at {form.email}.
        </p>
      </div>
    );
  }

  return (
    <div className="container-editorial pt-10 md:pt-20 pb-32">
      <h1 className="display uppercase text-[13vw] md:text-[9vw] leading-[0.9]">Contact</h1>
      <p className="mt-6 max-w-2xl text-muted-foreground headline text-base md:text-lg">
        Shoot us your queries, and we'll get back to you as soon as possible.
      </p>

      <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <aside className="md:col-span-4 space-y-6">
          <div className="rule-t pt-4">
            <p className="label text-muted-foreground">Email</p>
            <p className="mt-1 headline">info@serendipityarts.org</p>
          </div>
        </aside>

        <form
          className="md:col-span-8 space-y-8"
          onSubmit={(e) => { e.preventDefault(); if (!showParticipation) setSent(true); }}
        >
          <div>
            <p className="label text-muted-foreground">Full Name</p>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input mt-2" />
          </div>
          <div>
            <p className="label text-muted-foreground">Email</p>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input mt-2" />
          </div>
          <div>
            <p className="label text-muted-foreground">Subject</p>
            <select className="input mt-2" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {showParticipation ? (
            <div className="border border-accent p-5 md:p-6 bg-muted/30">
              <p className="label text-accent">A quick note</p>
              <p className="mt-3 headline text-base md:text-lg leading-relaxed text-muted-foreground max-w-prose">
                {PARTICIPATION_NOTE}
              </p>
              <a
                href="https://instagram.com/serendipityartsfoundation"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block label border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
              >
                Follow @serendipityartsfoundation →
              </a>
            </div>
          ) : (
            <>
              <div>
                <p className="label text-muted-foreground">Your query</p>
                <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input mt-2" />
              </div>
              <button type="submit" className="headline font-semibold uppercase text-lg md:text-xl bg-foreground text-background rounded-full px-8 py-4 hover:bg-accent transition-colors">
                Send message →
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

import filmAsset from "@/assets/saf-aftermovie.mp4.asset.json";
import { useCart } from "@/lib/cart";



const searchSchema = z.object({
  next: fallback(z.string(), "").default(""),
  mode: fallback(z.enum(["general", "guest", "sea"]), "general").default("general"),
});

export const Route = createFileRoute("/register")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Register — Serendipity Arts Festival 2026" },
      { name: "description", content: "Register for Serendipity Arts Festival 2026 — 13–20 December, Panjim. Free and open to all." },
    ],
  }),
  component: Register,
});

const AGE_GROUPS = ["Under 13", "13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65-70", "70+"];
const AGE_NOTES: Record<string, string> = {
  "Under 13": "Age may be verified during registration at the venue. Children below 13 must be accompanied by a parent or legal guardian at all times within festival venues, and may enter using their parent's Art Pass.",
  "13-17": "Age may be verified during registration at the venue. For visitors aged 13–17, tickets to limited-seating programmes must be purchased by a parent or legal guardian.",
};
const GENDERS = ["Man", "Woman", "Transgender", "Non-Binary/Non-Conforming", "Prefer Not To Say"];
const PAST_YEARS = ["2016", "2017", "2018", "2019", "2020", "2022", "2023", "2024", "2025", "First time"];
const INTERESTS = [
  "Visual Arts", "Craft", "Dance", "Music", "Theatre", "Photography",
  "Culinary Arts", "Children's Programmes", "Performance Art",
  "Accessibility", "Public Art", "All",
];
const GUEST_DATES = ["13 December","14 December","15 December","16 December","17 December","18 December","19 December","20 December"];
const GUEST_NOTES = [
  "VIP Pass does not guarantee entry to the VIP Lounge. Access is subject to availability and operates on a first-come, first-served basis.",
  "VIP Pass is non-transferable.",
  "Each invitee may bring one accompanying guest only.",
  "Post-registration, guests are required to book individual programmes. Attendance is subject to prior reservation of specific events.",
  "Guests are requested to arrive 15\u201320 minutes prior to the start of each programme to ensure smooth entry.",
  "For special assistance (e.g. wheelchair or mobility support), guests must inform us in advance. Support is not subject to availability \u2014 it is priority assistance extended to those who need it, which must be informed prior.",
  "Seating for programmes is limited and subject to availability.",
  "Your Art Pass will be available on our app closer to the festival.",
  "Show your pass at any venue in front of our zappers to enter.",
];
const HEARD = ["Newspaper", "Social Media", "Friends", "Radio", "Television", "Billboard", "Other"];

function Register() {
  const { next, mode: initialMode } = Route.useSearch();
  const navigate = useNavigate();
  const { markRegistered, login } = useCart();
  const [mode, setMode] = useState<"general" | "guest" | "sea">(initialMode);
  const [form, setForm] = useState({
    email: "", name: "", gender: "", age: "",
    country: "", state: "", city: "",
    past: [] as string[], interests: [] as string[], heard: "",
    dial: "+91", whatsapp: "", otp: "",
    terms: false, subscribe: true,
    // Special guest fields
    dates: [] as string[], travel: "", lodging: "", accommodation: "",
    accompanied: "", requests: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const isGuest = mode === "guest";
  const isSea = mode === "sea";

  const toggle = (k: "past" | "interests" | "dates", v: string) =>
    setForm((f) => ({
      ...f,
      [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v],
    }));

  if (submitted) {
    return (
      <div className="container-editorial pt-16 md:pt-24 pb-40">
        <h1 className="display uppercase text-[14vw] md:text-[10vw] leading-[0.9]">You're in.</h1>
        <p className="mt-8 max-w-xl text-muted-foreground">
          A confirmation has been sent to {form.email}.
        </p>
        <div className="mt-8 max-w-xl border border-foreground p-6 md:p-8">
          <p className="label text-accent">{isSea ? "Your SEA Delegate Pass" : isGuest ? "Your Special Guest Pass" : "Your Art Pass"}</p>
          <p className="mt-3 display uppercase text-2xl md:text-3xl leading-[1] tracking-[-0.02em]">
            Available on our app, closer to the festival.
          </p>
          <p className="mt-4 text-sm text-muted-foreground headline">
            {isGuest
              ? "We can't wait to see you in Panjim, Goa, 13–20 December."
              : "Each time you book a programme, it will be added to your single Art Pass, just show it at any venue in front of our zappers."}
          </p>
        </div>
        <Link to="/programmes" className="mt-10 inline-block label border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors">
          Browse programmes →
        </Link>
      </div>
    );
  }

  return (
    <div className="container-editorial pt-10 md:pt-16 pb-32">
      {/* Film banner */}
      <div className="relative overflow-hidden bg-black text-white aspect-[16/7] md:aspect-[16/5] w-full">
        <video src={filmAsset.url} autoPlay muted loop playsInline preload="auto"
          className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
          <h1 className="display uppercase text-white text-[9vw] md:text-[5.5vw] leading-[0.9] tracking-[-0.03em] text-center max-w-[16ch]">
            {isSea ? "SEA Registration" : isGuest ? "Special Guest Registration" : "General Visitor Registration"}
          </h1>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {(["general", "guest", "sea"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`headline uppercase tracking-[0.06em] text-xs md:text-sm border-2 px-4 py-2 transition-colors ${
              mode === m
                ? "bg-foreground text-background border-foreground"
                : "border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            {m === "general" ? "General Visitor" : m === "guest" ? "Special Guest" : "SEA Delegate"}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left column — copy */}
        <aside className="md:col-span-4">
          {isSea ? (
            <>
              <p className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
                Serendipity Exchange for the Arts.
              </p>
              <p className="mt-5 text-sm text-muted-foreground headline max-w-sm">
                SEA is a delegate program running parallel to the Serendipity Arts Festival 2026 — a platform for artists, companies, curators, producers and arts managers to present their work, exchange ideas and foster future collaborations.
              </p>
              <p className="mt-4 text-sm text-muted-foreground headline max-w-sm">
                Once your delegate registration is complete, all programming becomes complimentary for you.
              </p>
              <Link to="/sea" className="mt-6 inline-block label border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors">
                About SEA →
              </Link>
            </>
          ) : isGuest ? (
            <>
              <p className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
                A curated welcome, on the house.
              </p>
              <p className="mt-5 text-sm text-muted-foreground headline max-w-sm">
                We welcome you to the exclusive VIP experience at the Serendipity Arts Festival 2026. As a valued and distinguished guest, we are dedicated to ensuring that your visit is exceptional in every way.
              </p>
              <p className="mt-4 text-sm text-muted-foreground headline max-w-sm">
                Serendipity Arts Festival's VIP programme offers our esteemed guests access to onsite VIP lounges, exclusive culinary experiences and a bespoke itinerary tailored to your preferences.
              </p>
              <p className="mt-4 text-sm text-muted-foreground headline max-w-sm">
                Please complete the form below, and our VIP management team will be in touch soon with a curated itinerary for your festival experience.
              </p>
            </>
          ) : (

            <>
              <p className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
                Your Art Pass, free.
              </p>
              <p className="mt-5 text-sm text-muted-foreground max-w-sm">
                Registration is free and open to all. The Art Pass will be available to download closer to the festival on our app.
              </p>
              <p className="mt-4 text-sm text-muted-foreground max-w-sm">
                Select programmes with limited seating are ticketed — you'll be able to book them once you're registered. Each booking gets added to the same Art Pass.
              </p>
            </>
          )}
          <p className="mt-8 label">
            Already have an account?{" "}
            <Link to="/login" search={{ next }} className="text-foreground underline underline-offset-4 hover:text-accent">
              Login here
            </Link>
          </p>
        </aside>

        {/* Form */}
        <form
          className="md:col-span-8 space-y-10"
          onSubmit={(e) => {
            e.preventDefault();
            if (isGuest || isSea) { login(true); } else { markRegistered(); login(false); }
            if (next) { navigate({ to: next }); return; }
            setSubmitted(true);
          }}
        >

          <Field label="Email ID*">
            <input type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          </Field>

          <Field label="Full Name*">
            <input required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          </Field>

{(!isGuest && !isSea) && (<>
          <Field label="Gender">
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {GENDERS.map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="gender" value={g}
                    checked={form.gender === g}
                    onChange={() => setForm({ ...form, gender: g })}
                    className="accent-accent" />
                  {g}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Age Group">
            <div className="mt-3 flex flex-wrap gap-2">
              {AGE_GROUPS.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setForm({ ...form, age: a })}
                  aria-pressed={form.age === a}
                  className={`headline text-xs md:text-sm border rounded-md px-4 py-2 transition-colors ${
                    form.age === a ? "bg-foreground text-background border-foreground" : "border-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            {AGE_NOTES[form.age] && (
              <div className="mt-4 border border-accent bg-muted/30 p-4 max-w-prose">
                <p className="label text-accent">A quick note</p>
                <p className="mt-2 text-sm md:text-base leading-relaxed headline text-muted-foreground whitespace-pre-line">
                  {AGE_NOTES[form.age]}
                </p>
              </div>
            )}
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Field label="Country">
              <select className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                <option value="">Select country</option>
                <option>India</option><option>United States</option><option>United Kingdom</option>
                <option>Germany</option><option>France</option><option>Other</option>
              </select>
            </Field>
            <Field label="State">
              <select className="input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                <option value="">Select state</option>
                <option>Goa</option><option>Maharashtra</option><option>Karnataka</option><option>Delhi</option><option>Other</option>
              </select>
            </Field>
            <Field label="City">
              <select className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                <option value="">Select</option>
                <option>Panjim</option><option>Mumbai</option><option>Bengaluru</option><option>New Delhi</option><option>Other</option>
              </select>
            </Field>
          </div>

          <Field label="Have you attended the Festival before?">
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {PAST_YEARS.map((y) => (
                <label key={y} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.past.includes(y)}
                    onChange={() => toggle("past", y)} className="accent-accent" />
                  {y}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Interests">
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {INTERESTS.map((i) => (
                <label key={i} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.interests.includes(i)}
                    onChange={() => toggle("interests", i)} className="accent-accent" />
                  {i}
                </label>
              ))}
            </div>
          </Field>

          <Field label="How did you hear about us">
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {HEARD.map((h) => (
                <label key={h} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="heard" value={h}
                    checked={form.heard === h}
                    onChange={() => setForm({ ...form, heard: h })}
                    className="accent-accent" />
                  {h}
                </label>
              ))}
            </div>
          </Field>

          <Field label="WhatsApp Number">
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <select className="input" value={form.dial} onChange={(e) => setForm({ ...form, dial: e.target.value })}>
                <option>+91</option><option>+1</option><option>+44</option><option>+49</option><option>+33</option>
              </select>
              <input inputMode="numeric" maxLength={10} placeholder="10 digit number"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value.replace(/\D/g, "") })}
                className="input" />
            </div>
          </Field>

          <Field label="OTP">
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <input inputMode="numeric" maxLength={6} value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "") })}
                className="input" />
              <button type="button" className="label border border-foreground rounded-full px-5 hover:bg-foreground hover:text-background transition-colors">
                Get OTP
              </button>
            </div>
          </Field>

</>)}

{isSea && (<>
          <Field label="Gender">
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {GENDERS.map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="gender" value={g}
                    checked={form.gender === g}
                    onChange={() => setForm({ ...form, gender: g })}
                    className="accent-accent" />
                  {g}
                </label>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Field label="Country*">
              <select required className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                <option value="">Select country</option>
                <option>India</option><option>United States</option><option>United Kingdom</option>
                <option>Germany</option><option>France</option><option>Other</option>
              </select>
            </Field>
            <Field label="State*">
              <select required className="input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                <option value="">Select state</option>
                <option>Goa</option><option>Maharashtra</option><option>Karnataka</option><option>Delhi</option><option>Other</option>
              </select>
            </Field>
            <Field label="City*">
              <select required className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                <option value="">Select</option>
                <option>Panjim</option><option>Mumbai</option><option>Bengaluru</option><option>New Delhi</option><option>Other</option>
              </select>
            </Field>
          </div>

          <Field label="WhatsApp Number*">
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <select className="input" value={form.dial} onChange={(e) => setForm({ ...form, dial: e.target.value })}>
                <option>+91</option><option>+1</option><option>+44</option><option>+49</option><option>+33</option>
              </select>
              <input required inputMode="numeric" maxLength={12} placeholder="WhatsApp number"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value.replace(/\D/g, "") })}
                className="input" />
            </div>
          </Field>

          <Field label="OTP*">
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <input required inputMode="numeric" maxLength={6} value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "") })}
                className="input" />
              <button type="button" className="label border border-foreground rounded-full px-5 hover:bg-foreground hover:text-background transition-colors">
                Get OTP
              </button>
            </div>
          </Field>

          <div className="border border-foreground p-5 md:p-6">
            <p className="label">Once you're verified</p>
            <p className="mt-3 text-sm text-muted-foreground headline">
              All Festival programming becomes complimentary for SEA delegates. You'll still need to reserve individual programmes so we can hold your seat.
            </p>
          </div>
</>)}

{isGuest && (<>
          <Field label="Contact Number*">
            <div className="grid grid-cols-[140px_1fr] gap-3">
              <select className="input" value={form.dial} onChange={(e) => setForm({ ...form, dial: e.target.value })}>
                <option value="+91">India (+91)</option>
                <option value="+1">USA (+1)</option>
                <option value="+44">UK (+44)</option>
                <option value="+49">Germany (+49)</option>
                <option value="+33">France (+33)</option>
              </select>
              <input required inputMode="numeric" maxLength={12} placeholder="Phone number"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value.replace(/\D/g, "") })}
                className="input" />
            </div>
          </Field>

          <Field label="Dates Attending*">
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {GUEST_DATES.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.dates.includes(d)}
                    onChange={() => toggle("dates", d)} className="accent-accent" />
                  {d}
                </label>
              ))}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.dates.length === GUEST_DATES.length}
                  onChange={(e) => setForm({ ...form, dates: e.target.checked ? [...GUEST_DATES] : [] })}
                  className="accent-accent" />
                All of the above
              </label>
            </div>
          </Field>

          <YesNo label="Travel Assistance Required*" name="travel" value={form.travel}
            onChange={(v) => setForm({ ...form, travel: v })} />
          <YesNo label="Lodging/Boarding Assistance Required*" name="lodging" value={form.lodging}
            onChange={(v) => setForm({ ...form, lodging: v })} />
          <YesNo label="Accomodation Assistance Required*" name="accom" value={form.accommodation}
            onChange={(v) => setForm({ ...form, accommodation: v })} />
          <YesNo label="Will you be accompanied by anyone?*" name="accompanied" value={form.accompanied}
            onChange={(v) => setForm({ ...form, accompanied: v })} />

          <Field label="Additional Requests or Preferences">
            <textarea value={form.requests} rows={3}
              onChange={(e) => setForm({ ...form, requests: e.target.value })}
              className="input" />
          </Field>

          <div className="border border-foreground p-5 md:p-6">
            <p className="label">A few quick notes for a smooth experience</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground headline list-disc pl-5">
              {GUEST_NOTES.map((n) => <li key={n}>{n}</li>)}
            </ul>
            <p className="mt-4 text-sm headline">
              For any queries, kindly reach out to us at{" "}
              <a href="mailto:rsvp@serendipityarts.org" className="underline underline-offset-4">rsvp@serendipityarts.org</a>
            </p>
          </div>
</>)}

          <div className="space-y-3 pt-4">
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" required checked={form.terms}
                onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                className="mt-1 accent-accent" />
              I accept and agree to all the <Link to="/terms" className="underline underline-offset-4 hover:text-accent">Terms and Conditions</Link>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked={form.subscribe}
                onChange={(e) => setForm({ ...form, subscribe: e.target.checked })}
                className="mt-1 accent-accent" />
              Stay updated on this year's programming and secure tickets before they sell out.
            </label>
          </div>

          <button type="submit"
            className="headline font-semibold uppercase text-lg md:text-xl bg-foreground text-background rounded-full px-8 py-4 hover:bg-accent transition-colors">
            {isGuest || isSea ? "Complete Registration →" : "Submit form →"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label text-muted-foreground">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function YesNo({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {["Yes", "No"].map((v) => (
          <label key={v} className="flex items-center gap-2 text-sm">
            <input type="radio" name={name} value={v} checked={value === v}
              onChange={() => onChange(v)} className="accent-accent" />
            {v}
          </label>
        ))}
      </div>
    </Field>
  );
}

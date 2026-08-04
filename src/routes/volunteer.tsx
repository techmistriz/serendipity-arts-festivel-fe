import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import vol14 from "@/assets/volunteer/vol-14.jpg.asset.json";
import vol15 from "@/assets/volunteer/vol-15.jpg.asset.json";
import vol16 from "@/assets/volunteer/vol-16.jpg.asset.json";
import vol17 from "@/assets/volunteer/vol-17.jpg.asset.json";
import { GlitchBorder } from "@/components/site/GlitchBorder";

const VOL_FRAMES = [vol17.url, vol14.url, vol16.url, vol15.url];

// A looping frame-by-frame sequence — a GIF, built from the festival photos.
function VolunteerGif({ frames, interval = 900, className = "" }: { frames: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % frames.length), interval);
    return () => clearInterval(t);
  }, [frames.length, interval]);
  return (
    <GlitchBorder seed={frames.length + 9} thickness={1} hoverBoost={14} delayMs={200} className={`overflow-hidden ${className}`}>
      <div className="relative w-full aspect-[4/3] bg-black">
        {frames.map((src, n) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden={n !== i}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${n === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
    </GlitchBorder>
  );
}

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer — Serendipity Arts Festival 2026" },
      { name: "description", content: "Join the volunteer team at the 11th edition of the Serendipity Arts Festival — Panjim, December 2026." },
    ],
  }),
  component: Volunteer,
});

function Volunteer() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", contact: "+91 ", gender: "",
    dob: "", address: "", country: "India", state: "", city: "", pincode: "",
    qualification: "", profession: "", parentsName: "", parentsContact: "",
    priorVolunteer: "No", d1: "", d2: "", d3: "", dep1: "", dep2: "", dep3: "",
    interests: "", motivation: "", accept: false,
  });

  const upd = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  if (sent) {
    return (
      <div className="container-editorial pt-16 md:pt-24 pb-40">
        <h1 className="display uppercase text-[12vw] md:text-[8vw] leading-[0.9]">Application received.</h1>
        <p className="mt-8 max-w-xl text-muted-foreground headline text-lg">
          Thank you, {form.firstName || "friend"}. Shortlisted candidates will be contacted by 15 October — keep an eye on {form.email}.
        </p>
      </div>
    );
  }

  return (
    <div className="container-editorial pt-10 md:pt-20 pb-32">
      <h1 className="display uppercase text-[12vw] md:text-[9vw] leading-[0.9] mt-2">Volunteer<br />Registration</h1>

      <div className="mt-8 md:mt-12">
        <VolunteerGif frames={VOL_FRAMES} interval={900} />
      </div>

      {/* COPY */}
      <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <aside className="md:col-span-5 space-y-8 headline text-base md:text-lg text-muted-foreground max-w-prose">
          <p>
            We're back in Panjim this December with the <span className="text-foreground">11th edition of Serendipity Arts Festival</span> — our biggest celebration yet! Over eight days, the city will come alive with visual arts, dance, theatre, music, culinary experiences, films, workshops, and countless moments of discovery.
          </p>
          <p>
            The magic of Serendipity has always been powered by its people. For over a decade, our incredible volunteers have been the heart of the Festival — welcoming audiences, supporting artists, and making sure every story finds its stage.
          </p>
          <p className="text-foreground">Now it's your turn to step behind the scenes and be part of it all!</p>

          <Block title="Who can apply">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You must be <span className="text-foreground">18 years or older</span> as of 1st December 2026 (non-negotiable).</li>
              <li>You must have a valid <span className="text-foreground">PAN card and bank account</span> (for stipend purposes).</li>
              <li>You should share an updated CV so we can learn more about you.</li>
              <li>You should be able to arrange your own travel and accommodation in Goa.</li>
            </ul>
          </Block>

          <Block title="What we're looking for">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Interest in the arts is always welcome, though not mandatory.</li>
              <li>Comfort with English and Hindi is important; additional languages are a bonus.</li>
              <li>Energy, reliability, and enthusiasm — festival days are long and fast-paced.</li>
            </ul>
          </Block>

          <Block title="What you'll gain">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>A certificate of participation.</li>
              <li>A daily stipend of <span className="text-foreground">INR 1,000</span> plus tea, snacks and dinner.</li>
              <li>Hands-on experience across backstage, production, F&amp;B, art guiding, social media, and more.</li>
              <li>A place in a vibrant creative community.</li>
            </ul>
          </Block>

          <Block title="Application timeline">
            <ul className="list-disc pl-5 space-y-1.5">
              <li><span className="text-foreground">Deadline:</span> 15 October 2026.</li>
              <li><span className="text-foreground">Interviews:</span> Shortlisted candidates contacted by 15 October (phone or in-person).</li>
              <li><span className="text-foreground">Final Confirmation:</span> Selected volunteers must share confirmed travel and accommodation details by 30 October.</li>
            </ul>
          </Block>

          <p className="text-foreground">Ready to join us? Fill out the form.</p>
        </aside>

        {/* FORM */}
        <form className="md:col-span-7 space-y-6" onSubmit={(e) => { e.preventDefault(); if (form.accept) setSent(true); }}>
          <F label="First Name*"><input required className="input" value={form.firstName} onChange={(e) => upd("firstName", e.target.value)} /></F>
          <F label="Last Name*"><input required className="input" value={form.lastName} onChange={(e) => upd("lastName", e.target.value)} /></F>
          <F label="Email*"><input required type="email" className="input" value={form.email} onChange={(e) => upd("email", e.target.value)} /></F>
          <F label="Contact*"><input required inputMode="tel" className="input" value={form.contact} onChange={(e) => upd("contact", e.target.value)} /></F>
          <F label="Gender*">
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
              {["He/Him", "She/Her", "Other"].map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="gender" checked={form.gender === g} onChange={() => upd("gender", g)} className="accent-accent" />{g}
                </label>
              ))}
            </div>
          </F>
          <F label="DOB*"><input required type="date" className="input" value={form.dob} onChange={(e) => upd("dob", e.target.value)} />
            <p className="mt-1 text-xs text-muted-foreground">* You must be 18+ years as of 1st December 2026.</p>
          </F>
          <F label="Address*"><textarea required rows={2} className="input" value={form.address} onChange={(e) => upd("address", e.target.value)} /></F>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <F label="Country*"><input required className="input" value={form.country} onChange={(e) => upd("country", e.target.value)} /></F>
            <F label="State*"><input required className="input" value={form.state} onChange={(e) => upd("state", e.target.value)} /></F>
            <F label="City*"><input required className="input" value={form.city} onChange={(e) => upd("city", e.target.value)} /></F>
            <F label="Pincode*"><input required inputMode="numeric" className="input" value={form.pincode} onChange={(e) => upd("pincode", e.target.value)} /></F>
          </div>

          <F label="Highest Qualification*"><input required className="input" value={form.qualification} onChange={(e) => upd("qualification", e.target.value)} /></F>
          <F label="Profession*">
            <select required className="input" value={form.profession} onChange={(e) => upd("profession", e.target.value)}>
              <option value="">Select</option>
              <option>Student</option><option>Private Employee</option><option>Government Employee</option>
              <option>Self-employed</option><option>Freelancer</option><option>Other</option>
            </select>
          </F>

          <F label="Resume / CV*"><input required type="file" accept=".pdf,.doc,.docx" className="text-sm" />
            <p className="mt-1 text-xs text-muted-foreground">Max 2MB allowed.</p>
          </F>
          <F label="Profile Image*"><input required type="file" accept="image/*" className="text-sm" />
            <p className="mt-1 text-xs text-muted-foreground">Max 1MB allowed.</p>
          </F>
          <F label="Aadhaar — front side*"><input required type="file" accept="image/*" className="text-sm" /></F>
          <F label="Aadhaar — back side*"><input required type="file" accept="image/*" className="text-sm" /></F>

          <F label="Parents / Guardian Name*"><input required className="input" value={form.parentsName} onChange={(e) => upd("parentsName", e.target.value)} /></F>
          <F label="Parents / Guardian Contact*"><input required inputMode="tel" className="input" value={form.parentsContact} onChange={(e) => upd("parentsContact", e.target.value)} /></F>

          <F label="Have you already been a volunteer with us?*">
            <select required className="input" value={form.priorVolunteer} onChange={(e) => upd("priorVolunteer", e.target.value)}>
              <option>No</option><option>Yes</option>
            </select>
          </F>

          <p className="headline font-semibold uppercase text-lg md:text-xl leading-tight pt-4">
            If given a chance, which discipline &amp; department would you like to volunteer for?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["d1","d2","d3"] as const).map((k, i) => (
              <F key={k} label={`Discipline priority ${i + 1}*`}>
                <select required className="input" value={form[k]} onChange={(e) => upd(k, e.target.value)}>
                  <option value="">Select</option>
                  <option>Visual Arts</option><option>Performance Art</option><option>Theatre</option>
                  <option>Music</option><option>Dance</option><option>Culinary Arts</option>
                  <option>Photography</option><option>Film</option>
                </select>
              </F>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["dep1","dep2","dep3"] as const).map((k, i) => (
              <F key={k} label={`Department priority ${i + 1}*`}>
                <select required className="input" value={form[k]} onChange={(e) => upd(k, e.target.value)}>
                  <option value="">Select</option>
                  <option>Production</option><option>Transportation</option><option>Festival Shop</option>
                  <option>Registration</option><option>Hospitality</option><option>Backstage</option>
                  <option>Social Media</option><option>Art Guiding</option>
                </select>
              </F>
            ))}
          </div>

          <F label="Interests*"><input required className="input" placeholder="Dance, Music…" value={form.interests} onChange={(e) => upd("interests", e.target.value)} /></F>

          <p className="headline font-semibold uppercase text-lg md:text-xl leading-tight pt-4">
            What do you hope to gain from volunteering at Serendipity Arts Festival?
          </p>
          <F label="Your answer*"><textarea required rows={4} className="input" value={form.motivation} onChange={(e) => upd("motivation", e.target.value)} /></F>

          <label className="flex items-start gap-3 text-sm pt-4">
            <input required type="checkbox" checked={form.accept} onChange={(e) => upd("accept", e.target.checked)} className="mt-1 accent-accent" />
            I accept the <a href="/terms" className="underline underline-offset-4 hover:text-accent">Terms &amp; Conditions</a>.
          </label>

          <button type="submit"
            className="headline font-semibold uppercase text-lg md:text-xl bg-foreground text-background rounded-full px-8 py-4 hover:bg-accent transition-colors">
            Submit application →
          </button>
        </form>
      </div>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label text-muted-foreground">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rule-t pt-4">
      <p className="headline font-semibold uppercase text-lg md:text-xl leading-tight tracking-[-0.01em] text-foreground">{title}</p>
      <div className="mt-3 headline text-muted-foreground">{children}</div>
    </div>
  );
}

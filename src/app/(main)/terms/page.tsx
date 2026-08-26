import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Terms and Conditions",
  description:
    "Read the terms and conditions for registration, Art Passes and programme bookings at Serendipity Arts Festival.",
  pathname: "/terms",
  keywords: ["terms and conditions", "festival registration", "programme booking terms"],
});

type Item = { title: string; body: React.ReactNode };
type Section = { n: string; title: string; items: Item[] };

const SECTIONS: Section[] = [
  {
    n: "01",
    title: "Entry, Registration & Passes",
    items: [
      {
        title: "Entry Policy",
        body: "Serendipity Arts Festival is free and open to all. However, registration is mandatory for entry to Festival venues and programmes.",
      },
      {
        title: "Exhibition & Open-Access Venues",
        body: "Registered attendees may access exhibition spaces and other open-access Festival venues by presenting their valid Art Pass at the venue entrance.",
      },
      {
        title: "Ticketed Programmes",
        body: "Certain performances, workshops, talks, and other limited-capacity programmes may require advance ticket booking in addition to Festival registration. Attendance is subject to ticket availability and payment of the applicable ticket price where specified.",
      },
      {
        title: "Issuance of Art Pass",
        body: "Upon successful registration, a confirmation email will be sent. However, the Art Pass will be available to download on the app closer to the festival.",
      },
      {
        title: "Proof of Registration",
        body: "All attendees must carry and present a valid Art Pass upon request. The Registration Team may verify identity or registration details for entry and access control.",
      },
      {
        title: "Accreditation for Staff & Partners",
        body: "Curators, artists, crew members, volunteers, sponsors, partners and accredited personnel must collect and display their accreditation cards while accessing Festival venues and restricted areas.",
      },
      {
        title: "On-the-Spot Registration & Seat Allocation",
        body: "On-the-spot registration and ticket issuance may be permitted subject to availability. Serendipity Arts reserves the right to release or reallocate seats if attendees fail to arrive within the prescribed reporting time.",
      },
      {
        title: "Pass Usage & Limits",
        body: "Each Art Pass is valid only for the registered individual and is non-transferable. Each attendee may book upto 5 festival tickets.",
      },
      {
        title: "Programme Attendance Requirements",
        body: "For select venues and ticketed programmes, attendees are required to arrive at least twenty (20) minutes before the scheduled start time.",
      },
      {
        title: "Late Entry Policy",
        body: "Serendipity Arts reserves the right to deny or restrict entry to attendees arriving late if entry may disrupt the programme or audience experience.",
      },
    ],
  },
  {
    n: "02",
    title: "Cancellation, Refund & Programme Changes",
    items: [
      {
        title: "Refund Policy",
        body: "All tickets and registrations are non-cancellable, non-exchangeable and non-refundable.",
      },
      {
        title: "Cancellation by the Festival",
        body: "If a programme is cancelled by the Festival, applicable refunds will be processed within fourteen (14) working days.",
      },
    ],
  },
  {
    n: "03",
    title: "Code of Conduct & Behaviour",
    items: [
      {
        title: "Respectful Behaviour",
        body: "Attendees must not engage in defamation, harassment, stalking, intimidation or threatening behaviour.",
      },
      {
        title: "Treatment of Volunteers",
        body: "Volunteers must be treated with courtesy, fairness and respect.",
      },
      {
        title: "Promotions",
        body: "Unauthorised distribution of promotional materials or advertisements is prohibited without prior written approval.",
      },
      {
        title: "Personal Belongings & Damage",
        body: "Attendees are responsible for safeguarding their belongings and any damage caused to Festival property.",
      },
      {
        title: "Prohibited Items",
        body: "Alcohol, tobacco, narcotics, weapons, hazardous materials and prohibited substances are not permitted within Festival venues.",
      },
    ],
  },
  {
    n: "04",
    title: "Accessibility & Inclusion",
    items: [
      {
        title: "Universal Access",
        body: "Festival venues are designed to be accessible and may include ramps, elevators, wheelchair access, signage and shuttle services wherever available.",
      },
      {
        title: "Multisensory Experiences",
        body: "Selected workshops and installations include tactile, Braille, audio and visual accessibility features.",
      },
      {
        title: "Culinary Accessibility",
        body: "Food zones offer dietary-specific menu options and accessible seating where possible.",
      },
    ],
  },
  {
    n: "05",
    title: "Volunteer Terms",
    items: [
      {
        title: "Engagement",
        body: "Volunteering does not constitute employment. Responsibilities may include artist assistance, registration, visitor management and operational duties.",
      },
      {
        title: "Eligibility & Conduct",
        body: "Volunteers must be residents of India, provide accurate documentation and comply with Festival instructions and codes of conduct.",
      },
      {
        title: "Stipend",
        body: "Eligible volunteers will receive a per diem stipend after the Festival via bank transfer.",
      },
      {
        title: "Legal Compliance",
        body: "Volunteers must comply with all applicable laws of India and the State of Goa.",
      },
      {
        title: "Confidentiality",
        body: "Volunteers must maintain confidentiality regarding Festival operations and sensitive information.",
      },
      {
        title: "Termination",
        body: "Serendipity Arts reserves the right to terminate volunteer participation at any time.",
      },
      {
        title: "Dispute Resolution",
        body: "Volunteer agreements shall be governed by Indian law and unresolved disputes shall be referred to arbitration in New Delhi.",
      },
    ],
  },
  {
    n: "06",
    title: "Health, Safety & Liability",
    items: [
      {
        title: "Personal Safety",
        body: "Attendees and participants are solely responsible for their personal safety and belongings.",
      },
      {
        title: "Right of Refusal",
        body: "Serendipity Arts reserves the right to refuse entry or remove any individual engaging in unsafe or disruptive behaviour.",
      },
      {
        title: "Volunteer Liability Waiver",
        body: "Volunteers waive claims relating to personal injury or property loss except where prohibited by law.",
      },
    ],
  },
  {
    n: "07",
    title: "Privacy & Data Protection",
    items: [
      {
        title: "Collection & Use of Personal Data",
        body: "Serendipity Arts collects personal information during registration, booking and entry processes for ticketing, venue access, safety, communication and attendee experience.",
      },
      {
        title: "Legal & Security Obligations",
        body: "Personal information may be shared with venue partners, security personnel or government authorities where required by law.",
      },
      {
        title: "Data Retention",
        body: "Personal data will only be retained as long as necessary for operational, legal and regulatory purposes.",
      },
      {
        title: "Participant Rights",
        body: (
          <>
            Participants may request access, correction or deletion of personal information by
            contacting{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-accent">
              info@serendipityarts.org
            </Link>
            . See our{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-accent">
              Privacy Policy
            </Link>{" "}
            for more.
          </>
        ),
      },
      {
        title: "Security Measures",
        body: "Industry-standard safeguards including encrypted storage and secure transfer protocols are implemented.",
      },
      {
        title: "Policy Updates",
        body: (
          <>
            This Privacy Policy may be updated periodically. The latest version will always be
            available on our{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-accent">
              Privacy Policy
            </Link>{" "}
            page.
          </>
        ),
      },
    ],
  },
  {
    n: "08",
    title: "Promotions & Media Rights",
    items: [
      {
        title: "Photography & Filming Restrictions",
        body: "Photography or filming may be prohibited during certain programmes.",
      },
      {
        title: "Artist Intellectual Property",
        body: "No artwork may be reproduced or distributed without the artist’s prior consent.",
      },
      {
        title: "Promotional Content",
        body: "Third-party promotions are permitted only with express written approval.",
      },
      {
        title: "Artist Rights",
        body: "Additional intellectual property provisions will be outlined within individual artist agreements.",
      },
      {
        title: "Copyright",
        body: "All photographs, recordings and media created by or for Serendipity Arts remain the exclusive property of the Festival Organisers.",
      },
    ],
  },
  {
    n: "09",
    title: "Filming, Photography & Use of Images",
    items: [
      {
        title: "No-Shoot Identification Option",
        body: "Attendees who do not wish to be photographed or filmed may request a red sticker at the Registration or Information Desk. Reasonable efforts will be made to avoid capturing identifiable images.",
      },
      {
        title: "Rights Granted",
        body: "By attending the Festival, attendees grant Serendipity Arts a perpetual, worldwide, royalty-free licence to use their image, voice and likeness.",
      },
      {
        title: "Release of Claims",
        body: "Attendees waive claims relating to privacy, publicity or similar causes of action arising from Festival recordings.",
      },
      {
        title: "Copyright Ownership",
        body: "All recordings and photographs remain the exclusive property of the Festival Organisers unless agreed otherwise in writing.",
      },
    ],
  },
  {
    n: "10",
    title: "Miscellaneous",
    items: [
      {
        title: "Amendments",
        body: "Serendipity Arts reserves the right to amend these Terms & Conditions at any time.",
      },
      {
        title: "Force Majeure",
        body: "The Festival reserves the right to alter, postpone or cancel any programme due to events beyond its reasonable control.",
      },
      {
        title: "Governing Law",
        body: "These Terms & Conditions shall be governed by the laws of India.",
      },
      {
        title: "Severability",
        body: "If any provision is found invalid or unenforceable, the remaining provisions shall remain in full force and effect.",
      },
    ],
  },
];

export default function Terms() {
  return (
    <div className="container-editorial pt-10 md:pt-24 pb-32">
      <p className="label text-muted-foreground">Serendipity Arts Festival</p>
      <h1 className="display uppercase text-[13vw] md:text-[9vw] leading-[0.9] mt-2">
        Terms &<br />
        Conditions
      </h1>
      <p className="mt-6 max-w-2xl text-muted-foreground">
        Please read before booking. These terms apply to all attendees, volunteers and participants
        of the Serendipity Arts Festival.
      </p>

      <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-8">
        <aside className="md:col-span-3 md:sticky md:top-24 self-start">
          <p className="label text-muted-foreground">Contents</p>
          <ol className="mt-4 space-y-2 text-sm headline">
            {SECTIONS.map((s) => (
              <li key={s.n}>
                <a href={`#s${s.n}`} className="hover:text-accent">
                  {s.n} · {s.title}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <div className="md:col-span-9 space-y-14">
          {SECTIONS.map((s) => (
            <section key={s.n} id={`s${s.n}`} className="rule-t pt-6">
              <p className="label text-accent">Section {s.n}</p>
              <h2 className="mt-3 display uppercase text-2xl md:text-4xl leading-[1] tracking-[-0.02em]">
                {s.title}
              </h2>
              <div className="mt-8 space-y-8">
                {s.items.map((it) => (
                  <div key={it.title} className="rule-t pt-5">
                    <p className="headline font-semibold uppercase text-lg md:text-xl leading-tight tracking-[-0.01em]">
                      {it.title}
                    </p>
                    <p className="mt-3 max-w-prose text-base md:text-lg leading-relaxed text-muted-foreground headline">
                      {it.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-wrap gap-3">
        <Link
          href="/register"
          className="label border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
        >
          Back to registration →
        </Link>
        <Link
          href="/programmes"
          className="label border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
        >
          Browse programmes →
        </Link>
      </div>
    </div>
  );
}

import GlitchBar from "@/src/components/common/GlitchBar";



const FAQS: { q: string; a: string }[] = [
  {
    q: "When and where is the Festival?",
    a: "13–20 December 2026, across seven venues in Panjim, Goa.",
  },
  {
    q: "Do I need to register to attend?",
    a: "Yes. Registration is free and open to all. Every attendee gets an Art Pass, which is your entry to the Festival. Select programmes with limited seating are ticketed — so apart from registering to the festival you will have to book them.",
  },

  {
    q: "How do I get my Art Pass?",
    a: "Your Art Pass will be available to download on our Festival app closer to the Festival — we'll email you the moment it's ready. Every programme you book gets added to that same Art Pass automatically.",
  },
  {
    q: "How do I enter a venue?",
    a: "Just show your Art Pass at any venue in front of our zappers. No printed tickets needed.",
  },
  {
    q: "Are all programmes free?",
    a: "Most programmes — including all exhibitions — are free. A small number of headline performances, workshops and dining experiences are paid; the price is shown on each programme.",
  },
  {
    q: "Can I book multiple slots for the same programme?",
    a: "Yes. Programmes that repeat across days show all available slots — pick as many as you'd like when you add to cart.",
  },
  {
    q: "What if two programmes clash on my schedule?",
    a: "We'll warn you at checkout if your bookings overlap. You can either drop one or keep both if you're willing to move between venues.",
  },
  {
    q: "Is the Festival accessible?",
    a: "Yes. Most venues are wheelchair-accessible and we run a dedicated Accessibility programme with sign-interpreted talks, audio-described tours and quiet hours.",
  },
  {
    q: "Can I volunteer at the Festival?",
    a: "Absolutely. Volunteer registration for 2026 isn't open yet — when it opens, we'll announce it here and on our newsletter.",
  },
  {
    q: "What time should we reach the venue before a performance?",
    a: "For closed door performances, please arrive 15 to 20 minutes early so we can ensure a smooth entry without disturbing the artists' setup.",
  },
  {
    q: "How do I participate in the festival as an artist?",
    a: "The artist lineup for certain programmes is curated directly by the festival curators and is not open for applications. We announce multiple open calls across various disciplines through the year. Submissions are reviewed by a jury panel, and selected applicants are notified by email. To stay updated about upcoming opportunities, register at www.serendipityartsfestival.com/register or follow us on Instagram at @serendipityartsfestival.",
  },
  {
    q: "Are food and beverages available at the venues?",
    a: "Select venues will have food stalls and water refill stations. Availability may vary by location.",
  },
  {
    q: "Are photography and videography allowed?",
    a: "This varies by programme. Look for signage at the venue or ask a volunteer before capturing photos or videos.",
  },
  {
    q: "Do I get individual passes for multiple programmes?",
    a: "No — you receive one Art Pass on the app. As you book more programmes, your selections are added to that same Art Pass. Keep it handy at the festival: our team will zap it and permit entry based on your bookings.",
  },
  {
    q: "Where will I get the physical Art Pass?",
    a: "Physical Art Passes (accreditations) are issued by Serendipity Arts and are reserved for artists, curators, crew, the festival team and other SAF associates. As a visitor, your Art Pass lives on the app — no physical pass is required.",
  },
  {
    q: "Can I book tickets on behalf of someone else?",
    a: "Yes. Just make sure the attendee carries the pass with the correct QR code at entry.",
  },
  {
    q: "Can I edit or cancel my booking after payment?",
    a: "Bookings cannot be edited or cancelled once confirmed. Any decision regarding cancellation or refunds is at the discretion of the Serendipity Arts Festival team.",
  },
  {
    q: "Do I need to carry a printed ticket?",
    a: "No. Digital passes are accepted — just keep your Art Pass QR code accessible on your phone.",
  },
  {
    q: "Do I need a ticket for free programmes?",
    a: "Some programmes are free but still require prior booking so we can manage capacity.",
  },
  {
    q: "How do I contact the festival team?",
    a: "Write to us at info@serendipityarts.org — we will reply to you as soon as we can.",
  },
];


export default function FAQ() {
  return (
    <div className="container-editorial pt-10 md:pt-20 pb-32 relative">
      <GlitchBar seed={29} direction="v" variant="vibrate" speed={0.4} count={70} className="hidden md:block absolute left-0 top-20 bottom-32 w-1" />
      <h1 className="display uppercase text-[13vw] md:text-[9vw] leading-[0.9]">FAQ</h1>
      <p className="mt-6 max-w-2xl text-muted-foreground headline">
        Everything you might want to know before you arrive. If we've missed something, write to us.
      </p>

      <ul className="mt-12 md:mt-16 rule-t">
        {FAQS.map((f, i) => (
          <li key={i} className="rule-b py-6 md:py-8 grid grid-cols-12 gap-4 md:gap-8">
            <p className="col-span-12 md:col-span-5 display uppercase text-xl md:text-3xl leading-[1] tracking-[-0.02em]">
              {f.q}
            </p>
            <p className="col-span-12 md:col-span-7 headline text-base md:text-lg leading-relaxed text-muted-foreground max-w-prose">
              {f.a}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

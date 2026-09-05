import { TESTIMONIALS } from "@/data/testimonials";

const eventStructuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Serendipity Arts Festival 2026",
  review: TESTIMONIALS.map((testimonial) => ({
    "@type": "Review",
    author: { "@type": "Person", name: testimonial.name },
    reviewBody: testimonial.quote,
  })),
}).replace(/</g, "\\u003c");

export function HomeStructuredData() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: eventStructuredData }} />
  );
}

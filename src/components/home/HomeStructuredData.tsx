import { TESTIMONIALS } from "@/data/testimonials";

const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.serendipityartsfestival.com/#organization",
      name: "Serendipity Arts",
      url: "https://www.serendipityartsfestival.com/",
      description:
        "Serendipity Arts is a not-for-profit collaborative platform based in New Delhi, India, fostering empathy, curiosity and cross-cultural dialogue by supporting emerging artists across South Asia.",
      logo: {
        "@type": "ImageObject",
        "@id": "https://www.serendipityartsfestival.com/#logo",
        url: "https://www.serendipityartsfestival.com/_next/static/media/festival-logo.530c97d6.webp",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "C-340 Chetna Marg, Block C, Defence Colony",
        addressLocality: "New Delhi",
        addressCountry: "IN",
      },
      email: "info@serendipityarts.org",
      telephone: "+91-11-45546121",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.serendipityartsfestival.com/#website",
      url: "https://www.serendipityartsfestival.com/",
      name: "Serendipity Arts Festival",
      publisher: {
        "@id": "https://www.serendipityartsfestival.com/#organization",
      },
      inLanguage: "en-IN",
    },
    {
      "@type": "WebPage",
      "@id": "https://www.serendipityartsfestival.com/#webpage",
      url: "https://www.serendipityartsfestival.com/",
      name: "Serendipity Arts Festival",
      description:
        "Serendipity Arts Festival is a multidisciplinary arts festival bringing together visual arts, performing arts, craft, culinary arts, music, dance, theatre, photography, film and more in Panjim, Goa.",
      isPartOf: {
        "@id": "https://www.serendipityartsfestival.com/#website",
      },
      about: {
        "@id": "https://www.serendipityartsfestival.com/#organization",
      },
      primaryImageOfPage: {
        "@id": "https://www.serendipityartsfestival.com/#logo",
      },
      inLanguage: "en-IN",
    },
    {
      "@type": "Event",
      name: "Serendipity Arts Festival 2026",
      review: TESTIMONIALS.map((testimonial) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: testimonial.name,
        },
        reviewBody: testimonial.quote,
      })),
    },
  ],
}).replace(/</g, "\\u003c");

export function HomeStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: structuredData,
      }}
    />
  );
}

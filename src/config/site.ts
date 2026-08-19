export const siteConfig = {
  name: "Serendipity Arts Festival",
  description: "Official website of Serendipity Arts Festival",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  navigation: [
    { label: "Home", href: "/", comingSoon: false },
    { label: "Programmes", href: "/programmes", comingSoon: true },
    { label: "Curators", href: "/curators", comingSoon: false },
    { label: "Venues", href: "/venues", comingSoon: false },
    { label: "About us", href: "/about", comingSoon: false },
    { label: "Register", href: "/register", comingSoon: false },
    { label: "FAQ", href: "/faq", comingSoon: false },
    { label: "Contact", href: "/contact", comingSoon: false },
    { label: "Privacy", href: "/privacy", comingSoon: false },
    { label: "Terms & Conditions", href: "/terms", comingSoon: false },
  ],
} as const;

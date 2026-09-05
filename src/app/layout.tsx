import type { Metadata } from "next";
import "./globals.css";
import { Inter_Tight, Stack_Sans_Headline } from "next/font/google";
import { AccessibilityWidget } from "@/components/common/AccessibilityWidget";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { siteConfig } from "@/config/site";
import { ReduxProvider } from "@/redux/provider";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const stackSansHeadline = Stack_Sans_Headline({
  subsets: ["latin"],
  variable: "--font-stack-sans-headline",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Serendipity Arts Festival",
    "SAF 2026",
    "Goa arts festival",
    "Panjim",
    "India arts festival",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${stackSansHeadline.variable} h-full antialiased`}
    >
      <body
        className="min-h-screen flex flex-col"
        suppressHydrationWarning //Fix: Suppress hydration warnings for body attributes
      >
        <ReduxProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AccessibilityWidget />
        </ReduxProvider>
      </body>
    </html>
  );
}

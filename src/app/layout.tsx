import type { Metadata } from "next";

import "./globals.css";
import Footer from "../components/Footer";
import Header from "../components/Header";

import { Inter_Tight, Stack_Sans_Headline } from "next/font/google";

import { AccessibilityWidget } from "../components/common/AccessibilityWidget";
import ReduxProvider from "../store/provider";
import { CartProvider } from "../lib/cart";

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
  title: "Serendipity Arts Festival",
  description: "Official website of Serendipity Arts Festival",
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
      <body className="min-h-screen flex flex-col">
        <ReduxProvider>
          <CartProvider>
            <Header />

            <main className="flex-1">
              {children}
            </main>

            <Footer />

            <AccessibilityWidget />
          </CartProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
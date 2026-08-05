import type { Metadata } from "next";

import "./globals.css";
import Footer from "../components/Footer";
import Header from "../components/Header";

import { Inter_Tight } from "next/font/google";
import { AccessibilityWidget } from "../components/common/AccessibilityWidget";
import ReduxProvider from "../store/provider";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
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
  className={`${interTight.variable} h-full antialiased`}
>
      <body className="min-h-screen flex flex-col">
        <ReduxProvider>
        <Header />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
        <AccessibilityWidget/>
        </ReduxProvider>
      </body>
    </html>
  );
}
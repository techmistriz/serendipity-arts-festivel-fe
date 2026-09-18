"use client";

import { usePathname } from "next/navigation";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideHeaderFooter = pathname === "/app-registration-link";

  return (
    <>
      {!hideHeaderFooter && <Header />}

      <main className="flex-1">{children}</main>

      {!hideHeaderFooter && <Footer />}
    </>
  );
}

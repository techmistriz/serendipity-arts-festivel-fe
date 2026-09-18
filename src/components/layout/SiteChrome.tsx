"use client";

import { usePathname, useSearchParams } from "next/navigation";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAppRegistration =
    pathname === "/register" &&
    searchParams.get("is_hide_header") === "1" &&
    searchParams.get("is_hide_footer") === "1" &&
    searchParams.get("is_app") === "1";

  return (
    <>
      {!isAppRegistration && <Header />}

      <main className="flex-1">{children}</main>

      {!isAppRegistration && <Footer />}
    </>
  );
}

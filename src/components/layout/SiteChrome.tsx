"use client";

import { useSearchParams } from "next/navigation";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isHideHeader = searchParams.get("is_hide_header") === "1";
  const isHideFooter = searchParams.get("is_hide_footer") === "1";

  return (
    <>
      {!isHideHeader && <Header />}

      <main className="flex-1">{children}</main>

      {!isHideFooter && <Footer />}
    </>
  );
}

import { RegisterPageClient } from "./RegisterPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Register",
  description: "Register for Serendipity Arts Festival.",
  pathname: "/register",
  noIndex: true,
});

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{
    is_app?: string;
    is_hide_header?: string;
    is_hide_footer?: string;
  }>;
}) {
  const params = await searchParams;
  const referrer = params.is_app === "1" ? "app" : "web";

  return <RegisterPageClient mode="general" referrer={referrer} />;
}

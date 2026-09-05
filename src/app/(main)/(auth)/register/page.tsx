import { RegisterPageClient } from "./RegisterPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Register",
  description: "Register for Serendipity Arts Festival.",
  pathname: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return <RegisterPageClient />;
}

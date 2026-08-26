import { LoginPageClient } from "./LoginPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Login",
  description: "Log in to your Serendipity Arts Festival account.",
  pathname: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return <LoginPageClient />;
}

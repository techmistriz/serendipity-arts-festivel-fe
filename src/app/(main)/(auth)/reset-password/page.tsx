import { ResetPasswordPageClient } from "./ResetPasswordPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Reset Password",
  description: "Reset your Serendipity Arts Festival account password.",
  pathname: "/reset-password",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return <ResetPasswordPageClient />;
}

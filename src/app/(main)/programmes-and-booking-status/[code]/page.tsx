import { notFound } from "next/navigation";
import ProgrammesPageClient from "../ProgrammesPageClient";

type PageProps = { params: Promise<{ code: string }> };
export default async function ProgrammesAndBookingStatusPage({ params }: PageProps) {
  const { code } = await params;
  const validCode = process.env.PROGRAMMES_ACCESS_CODE;
  if (!validCode || code !== validCode) notFound();
  return <ProgrammesPageClient code={code} />;
}

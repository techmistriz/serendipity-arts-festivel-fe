import { notFound } from "next/navigation";
import ProgrammesDailyReportClient from "../ProgrammesDailyReportClient";

export default async function ProgrammesDailyReportPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const validCode = process.env.PROGRAMMES_ACCESS_CODE;
  if (!validCode || code !== validCode) notFound();
  return <ProgrammesDailyReportClient code={code} />;
}

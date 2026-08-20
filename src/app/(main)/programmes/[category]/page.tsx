import { notFound } from "next/navigation";

import { ProgrammesPageClient } from "../ProgrammesPageClient";
import { CATEGORY_SLUGS } from "../constants";

export function generateStaticParams() {
  return Object.keys(CATEGORY_SLUGS).map((category) => ({ category }));
}

export default async function ProgrammeCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = CATEGORY_SLUGS[categorySlug];

  if (!category) notFound();

  return <ProgrammesPageClient initialCategory={category} />;
}

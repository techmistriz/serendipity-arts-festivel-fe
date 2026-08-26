import { ProgrammeDetailPageClient } from "../ProgrammeDetailPageClient";
import { ProgrammesPageClient } from "../ProgrammesPageClient";
import { CATEGORY_SLUGS } from "../constants";

export function generateStaticParams() {
  return Object.keys(CATEGORY_SLUGS).map((category) => ({ category }));
}

export default async function ProgrammeCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ intent?: string | string[] }>;
}) {
  const { category: categorySlug } = await params;
  const category = CATEGORY_SLUGS[categorySlug];

  if (category) {
    return <ProgrammesPageClient initialCategory={category} />;
  }

  const { intent } = await searchParams;
  const initialIntent = intent === "cart" ? "cart" : "about";

  return <ProgrammeDetailPageClient slug={categorySlug} initialIntent={initialIntent} />;
}

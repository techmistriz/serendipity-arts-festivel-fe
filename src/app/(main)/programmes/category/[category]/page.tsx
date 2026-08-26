import { notFound } from "next/navigation";
import { Suspense } from "react";

import { RouteLoadingOverlay } from "@/components/common/LoadingSkeletons";
import { createPageMetadata } from "@/lib/metadata";

import { ProgrammesListContent } from "../../ProgrammesListContent";
import { CATEGORY_SLUGS } from "../../constants";

export function generateStaticParams() {
  return Object.keys(CATEGORY_SLUGS).map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const category = CATEGORY_SLUGS[categorySlug];

  if (!category) {
    return createPageMetadata({
      title: "Programme Category",
      description: "Discover programmes at Serendipity Arts Festival 2026 in Panjim, Goa.",
      pathname: `/programmes/category/${categorySlug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${category} Programmes`,
    description: `Discover ${category.toLowerCase()} programmes at Serendipity Arts Festival 2026 in Panjim, Goa.`,
    pathname: `/programmes/category/${categorySlug}`,
    keywords: [category, "festival programmes", "Goa"],
  });
}

export default async function ProgrammeCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = CATEGORY_SLUGS[categorySlug];

  if (!category) {
    notFound();
  }

  return (
    <Suspense fallback={<RouteLoadingOverlay label="Loading programmes" />}>
      <ProgrammesListContent initialCategory={category} />
    </Suspense>
  );
}

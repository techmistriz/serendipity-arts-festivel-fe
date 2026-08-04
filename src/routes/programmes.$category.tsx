// Category leaf under /programmes/$category — reuses the main Programmes list
// with the initial category prefilled. Category selection updates the URL path,
// not a search param.
import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProgrammesList, CATEGORY_SLUGS } from "./programmes";

export const Route = createFileRoute("/programmes/$category")({
  loader: ({ params }) => {
    const cat = CATEGORY_SLUGS[params.category.toLowerCase()];
    if (!cat) throw notFound();
    return { category: cat };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.category ?? "Programmes"} — Serendipity Arts Festival 2026` },
      { name: "description", content: `Browse ${loaderData?.category ?? "programmes"} at the 11th Serendipity Arts Festival, 13–20 December 2026, Panjim.` },
    ],
  }),
  component: () => {
    const { category } = Route.useLoaderData();
    return <ProgrammesList initialCategory={category} />;
  },
  notFoundComponent: () => (
    <div className="container-editorial pt-16 md:pt-24 pb-40">
      <h1 className="display uppercase text-[10vw] md:text-[6vw] leading-[0.9]">Category not found.</h1>
    </div>
  ),
});

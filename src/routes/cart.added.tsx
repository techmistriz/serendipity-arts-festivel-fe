import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useCart } from "@/lib/cart";

const searchSchema = z.object({
  id: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/cart/added")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Added to your cart — Serendipity Arts Festival 2026" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Added,
});

function Added() {
  const { id } = Route.useSearch();
  const { items } = useCart();
  const navigate = useNavigate();
  const item = items.find((i) => i.id === id) ?? items[items.length - 1];

  return (
    <div className="container-editorial pt-16 md:pt-24 pb-32 min-h-[70vh]">
      <p className="label text-accent">Added to cart</p>
      <h1 className="display uppercase text-[13vw] md:text-[8vw] leading-[0.9] mt-3">
        Added to your cart.
      </h1>
      {item ? (
        <p className="mt-8 max-w-2xl headline text-lg md:text-xl text-muted-foreground">
          <span className="text-foreground">{item.title}</span> — {item.date} at {item.time}.
        </p>
      ) : (
        <p className="mt-8 max-w-2xl headline text-lg text-muted-foreground">
          Your programme is in your cart.
        </p>
      )}

      <div className="mt-12 flex flex-wrap gap-4">
        <button
          onClick={() => navigate({ to: "/programmes" })}
          className="headline text-sm uppercase tracking-[0.06em] border border-foreground px-6 py-4 hover:bg-foreground hover:text-background transition-colors"
        >
          + Add more programmes
        </button>
        <Link
          to="/cart"
          className="headline text-sm uppercase tracking-[0.06em] bg-foreground text-background rounded-full px-6 py-4 hover:bg-accent transition-colors"
        >
          Continue to checkout →
        </Link>
      </div>
    </div>
  );
}

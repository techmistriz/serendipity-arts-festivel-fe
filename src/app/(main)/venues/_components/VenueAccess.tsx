import { Access } from "@/types/venue";

export function AccessRow({ items, compact }: { items: Access[]; compact?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "mt-3" : "mt-6"}`}>
      {items.map((access) => (
        <span
          key={access.name}
          title={access.name}
          className="inline-flex items-center gap-2 border border-foreground px-2.5 py-1.5 headline text-[10px] uppercase tracking-[0.06em]"
        >
          <span aria-hidden className="text-sm leading-none">
            {access.icon}
          </span>

          {access.name}
        </span>
      ))}
    </div>
  );
}

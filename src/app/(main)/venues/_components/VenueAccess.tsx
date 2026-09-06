import Image from "next/image";

import type { Access } from "@/types/venue";

type AccessRowProps = {
  items: Access[];
  compact?: boolean;
};

export function AccessRow({ items, compact = false }: AccessRowProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "mt-3" : "mt-6"}`}>
      {items.map((access) => (
        <span
          key={access.id}
          title={access.name}
          className="headline inline-flex items-center gap-2 border border-foreground px-2.5 py-1.5 text-[10px] tracking-[0.06em] uppercase"
        >
          <Image
            src={access.icon}
            alt=""
            width={18}
            height={18}
            className="size-[18px] object-contain"
          />

          {access.name}
        </span>
      ))}
    </div>
  );
}

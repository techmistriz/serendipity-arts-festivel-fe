import type { ReactNode } from "react";

type HomeSectionHeaderProps = {
  title: string;
  children: ReactNode;
};

export function HomeSectionHeader({ title, children }: HomeSectionHeaderProps) {
  return (
    <div className="mb-10 grid grid-cols-1 items-start gap-6 md:mb-14 md:grid-cols-12 md:gap-8">
      <h2 className="display text-4xl leading-[0.9] uppercase sm:text-5xl md:col-span-7 md:text-7xl lg:text-8xl">
        {title}
      </h2>
      {children}
    </div>
  );
}

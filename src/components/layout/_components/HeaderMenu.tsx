"use client";

import Link from "next/link";
import { useState } from "react";

import ComingSoonPopup from "@/components/common/ComingSoonModal";
import { siteConfig } from "@/config/site";

type HeaderMenuProps = {
  onClose: () => void;
};

export function HeaderMenu({ onClose }: HeaderMenuProps) {
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className="ed-fade fixed inset-0 z-50 overflow-y-auto bg-background"
      >
        <div className="container-editorial rule-b flex h-14 items-center justify-between md:h-16">
          <Link href="/" onClick={onClose} className="label notch hover:text-accent">
            Home
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="label notch transition-colors hover:text-accent"
          >
            Close ×
          </button>
        </div>
        <nav className="container-editorial pt-8 pb-16 md:pt-16" aria-label="Main navigation">
          <ul>
            {siteConfig.navigation.map((item) => (
              <li key={item.href} className="rule-b">
                {item.comingSoon ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setIsComingSoonOpen(true);
                    }}
                    className="group flex w-full items-baseline justify-between py-4 text-left md:py-7"
                  >
                    <span className="display text-[11vw] leading-[0.95] uppercase transition-colors group-hover:text-accent md:text-[7vw]">
                      {item.label}
                    </span>
                    <span className="label hidden text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 md:inline">
                      →
                    </span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-baseline justify-between py-4 md:py-7"
                  >
                    <span className="display text-[11vw] leading-[0.95] uppercase transition-colors group-hover:text-accent md:text-[7vw]">
                      {item.label}
                    </span>
                    <span className="label hidden text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 md:inline">
                      →
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <ComingSoonPopup open={isComingSoonOpen} onClose={() => setIsComingSoonOpen(false)} />
    </>
  );
}

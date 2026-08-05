"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  label: string;
  to: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export function MobileMenu({ isOpen, onClose, menuItems }: MobileMenuProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background ed-fade overflow-y-auto">
      {/* Header */}
      <div className="container-editorial flex h-14 md:h-16 items-center justify-between rule-b">
        <Link
          href="/"
          onClick={onClose}
          className="label notch hover:text-accent transition-colors"
        >
          Home
        </Link>
        <button
          onClick={onClose}
          className="label notch hover:text-accent transition-colors"
          aria-label="Close menu"
        >
          Close &nbsp; ×
        </button>
      </div>

      {/* Menu Items */}
      <nav className="container-editorial pt-8 pb-16 md:pt-16">
        <ul>
          {menuItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <li key={item.to} className="rule-b">
                <Link
                  href={item.to}
                  onClick={onClose}
                  className={`group flex items-baseline justify-between py-4 md:py-7 transition-colors ${
                    isActive ? "text-accent" : ""
                  }`}
                >
                  <span className={`display uppercase text-[11vw] md:text-[7vw] leading-[0.95] ${
                    isActive ? "text-accent" : "group-hover:text-accent"
                  } transition-colors`}>
                    {item.label}
                  </span>
                  <span className="label text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hidden md:inline">
                    &rarr;
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
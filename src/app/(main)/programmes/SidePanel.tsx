"use client";

import { createPortal } from "react-dom";

export function SidePanel({
  label,
  children,
  onClose,
}: {
  label: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 w-full md:max-w-xl bg-background border-l border-foreground overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background flex items-center justify-between border-b border-foreground px-5 py-4">
          <p className="label">{label}</p>

          <button type="button" onClick={onClose} className="label hover:text-accent">
            Close ×
          </button>
        </div>

        <div className="p-5 md:p-8">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

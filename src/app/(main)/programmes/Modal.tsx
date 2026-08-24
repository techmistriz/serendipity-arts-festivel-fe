"use client";

import { createPortal } from "react-dom";

import GlitchBar from "@/components/common/GlitchBar";

export function Modal({
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
    <div className="fixed inset-0 z-[80] bg-background/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-background border border-rule ed-fade overflow-hidden">
        <GlitchBar
          seed={19}
          direction="v"
          speed={5}
          count={60}
          className="absolute left-0 top-0 bottom-0 w-1.5"
        />

        <div className="p-6 md:p-10 pl-8 md:pl-12">
          <div className="flex items-center justify-between rule-b pb-3 mb-6">
            <p className="label text-accent">{label}</p>

            <button type="button" onClick={onClose} className="label hover:text-accent">
              Close ×
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

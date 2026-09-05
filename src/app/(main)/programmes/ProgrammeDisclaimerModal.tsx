"use client";

import Link from "next/link";

import { SanitizedRichText } from "@/components/common/SanitizedRichText";

import { SidePanel } from "./SidePanel";

type ProgrammeDisclaimerModalProps = {
  disclaimer: string;
  onClose: () => void;
};

export function ProgrammeDisclaimerModal({ disclaimer, onClose }: ProgrammeDisclaimerModalProps) {
  return (
    <SidePanel onClose={onClose} label="Disclaimer">
      <h3 className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
        Please read before booking.
      </h3>
      <SanitizedRichText
        html={disclaimer}
        className="mt-4 whitespace-pre-line text-sm text-muted-foreground headline [&_a]:underline [&_a]:underline-offset-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
      />
      <p className="mt-4 text-sm text-muted-foreground headline">
        Read the full{" "}
        <Link href="/terms" className="text-foreground underline underline-offset-4">
          Terms &amp; Conditions
        </Link>
        .
      </p>
    </SidePanel>
  );
}

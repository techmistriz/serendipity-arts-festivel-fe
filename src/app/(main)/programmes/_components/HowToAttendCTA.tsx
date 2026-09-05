"use client";

import { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";

type HowToAttendCTAProps = {
  className?: string;
};

export function HowToAttendCTA({ className = "" }: HowToAttendCTAProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`headline inline-flex items-center gap-2 border border-foreground px-4 py-2 text-xs tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background ${className}`}
      >
        ⓘ How to book programmes
      </button>
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <ModalContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 md:p-10">
          <ModalHeader>
            <ModalTitle className="pr-8 text-2xl leading-[1] tracking-[-0.02em] md:text-4xl">
              Booking programmes is easy.
            </ModalTitle>
            <ModalDescription className="sr-only">
              Steps for booking a festival programme
            </ModalDescription>
          </ModalHeader>
          <ol className="headline mt-2 max-w-prose list-decimal space-y-4 pl-5 text-sm text-muted-foreground md:text-base">
            <li>
              <span className="text-foreground">Register</span> for the festival — it’s free.
            </li>
            <li>
              Browse programmes and select <span className="text-foreground">Add to cart</span> on
              the ones you want.
            </li>
            <li>
              Pick a <span className="text-foreground">date and time slot</span>, choose the number
              of tickets, and confirm.
            </li>
            <li>
              Head to your <span className="text-foreground">cart</span> and complete checkout —
              free programmes and paid ones can be booked together.
            </li>
            <li>
              Your bookings are added to a single <span className="text-foreground">Art Pass</span>{" "}
              on our app, available to download closer to the festival. Show it at any venue.
            </li>
          </ol>
        </ModalContent>
      </Modal>
    </>
  );
}

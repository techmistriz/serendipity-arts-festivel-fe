"use client";

import { images } from "@/config/images";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const POPUP_STORAGE_KEY = "global-popup-closed-at";
const FIVE_MINUTES = 3 * 1000;

export default function GlobalPopup() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const closedAt = localStorage.getItem(POPUP_STORAGE_KEY);

    if (!closedAt) {
      return true;
    }

    const elapsed = Date.now() - Number(closedAt);

    if (elapsed >= FIVE_MINUTES) {
      localStorage.removeItem(POPUP_STORAGE_KEY);
      return true;
    }

    return false;
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const closedAt = localStorage.getItem(POPUP_STORAGE_KEY);

    if (!closedAt) {
      return;
    }

    const elapsed = Date.now() - Number(closedAt);
    const remainingTime = FIVE_MINUTES - elapsed;

    if (remainingTime <= 0) {
      localStorage.removeItem(POPUP_STORAGE_KEY);
      return;
    }

    timerRef.current = setTimeout(() => {
      localStorage.removeItem(POPUP_STORAGE_KEY);
      setIsOpen(true);
    }, remainingTime);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());

    setIsOpen(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      localStorage.removeItem(POPUP_STORAGE_KEY);
      setIsOpen(true);
    }, FIVE_MINUTES);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/60 p-4">
      <div
        className="relative w-full max-w-9xl overflow-hidden rounded-lg bg-gray-900"
        style={{
          animation: "popupSlideDown 0.6s ease-out forwards",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close popup"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/80 text-2xl leading-none text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white hover:text-black hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          ✕
        </button>

        {/* Full image */}
        <Image
          src={images.globalPopup.popupImg}
          alt="Serendipity Arts Festival"
          width={1600}
          height={1000}
          className="block h-auto w-full object-contain"
          priority
          sizes="(max-width: 1536px) 100vw, 1536px"
        />
      </div>

      <style jsx global>{`
        @keyframes popupSlideDown {
          0% {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

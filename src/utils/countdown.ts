import { useEffect, useState } from "react";

export const pad = (value: number) => value.toString().padStart(2, "0");

export const parseDropDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;

  const [day, month, year] = dateString.split("/").map(Number);

  if (!day || !month || !year) return null;

  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

export function useCountdown(dateString: string | null | undefined) {
  const [left, setLeft] = useState<number | null>(() => {
    const target = parseDropDate(dateString);

    if (!target) return null;

    return Math.max(0, target.getTime() - Date.now());
  });

  useEffect(() => {
    const target = parseDropDate(dateString);

    if (!target) return;

    const tick = () => {
      setLeft(Math.max(0, target.getTime() - Date.now()));
    };

    tick();

    const intervalId = window.setInterval(tick, 1000);

    return () => window.clearInterval(intervalId);
  }, [dateString]);

  if (left === null) return null;

  return {
    d: Math.floor(left / 86400000),
    h: Math.floor(left / 3600000) % 24,
    m: Math.floor(left / 60000) % 60,
    s: Math.floor(left / 1000) % 60,
    done: left === 0,
  };
}

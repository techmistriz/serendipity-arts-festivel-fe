import { useEffect, useState } from "react";

export const pad = (value: number) => value.toString().padStart(2, "0");

export function useCountdown(target: Date) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      setLeft(Math.max(0, target.getTime() - Date.now()));
    };

    tick();

    const intervalId = window.setInterval(tick, 1000);

    return () => window.clearInterval(intervalId);
  }, [target]);

  if (left === null) {
    return null;
  }

  return {
    d: Math.floor(left / 86400000),
    h: Math.floor(left / 3600000) % 24,
    m: Math.floor(left / 60000) % 60,
    s: Math.floor(left / 1000) % 60,
    done: left === 0,
  };
}

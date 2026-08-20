export function getFestivalDay(date: string): number | null {
  const match = /^(\d{1,2})\s+Dec$/.exec(date.trim());

  return match ? Number(match[1]) : null;
}

export function formatBookingTime(time: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());

  if (!match) return time;

  const hour = Number(match[1]);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${displayHour}:${match[2]} ${period}`;
}

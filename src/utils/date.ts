export const formatProgrammeDates = (details?: Array<{ event_date?: string | null }>) => {
  if (!details?.length) return "";

  const dates = details
    .map((detail) => detail.event_date)
    .filter((date): date is string => Boolean(date))
    .map((date) => {
      const [first, second, third] = date.split("-").map(Number);

      // DD-MM-YYYY
      if (third && third > 1000) {
        return new Date(third, second - 1, first);
      }

      // YYYY-MM-DD
      if (first > 1000) {
        return new Date(first, second - 1, third);
      }

      return null;
    })
    .filter((date): date is Date => {
      return date !== null && !Number.isNaN(date.getTime());
    });

  // Remove duplicate dates
  const uniqueDates = Array.from(
    new Map(
      dates.map((date) => [`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`, date]),
    ).values(),
  ).sort((a, b) => a.getTime() - b.getTime());

  if (!uniqueDates.length) return "";

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

  // Single unique date
  if (uniqueDates.length === 1) {
    return formatDate(uniqueDates[0]);
  }

  const first = uniqueDates[0];
  const last = uniqueDates[uniqueDates.length - 1];

  // Same month → 14–15 Dec
  if (first.getMonth() === last.getMonth() && first.getFullYear() === last.getFullYear()) {
    const month = last.toLocaleDateString("en-GB", {
      month: "short",
    });

    return `${first.getDate()}–${last.getDate()} ${month}`;
  }

  // Different month → 28 Nov–2 Dec
  return `${formatDate(first)}–${formatDate(last)}`;
};

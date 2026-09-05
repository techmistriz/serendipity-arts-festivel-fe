import { siteConfig } from "@/config/site";
export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat(siteConfig.locale, {
    style: "currency",
    currency: siteConfig.currency,
    maximumFractionDigits: 0,
  }).format(amount);

/** Formats ISO (`YYYY-MM-DD`) and backend display (`DD-MM-YYYY`) dates safely. */
export function formatDate(date: string): string {
  const isoDate = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const displayDate = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  const parts = isoDate
    ? [Number(isoDate[3]), Number(isoDate[2]), Number(isoDate[1])]
    : displayDate
      ? [Number(displayDate[1]), Number(displayDate[2]), Number(displayDate[3])]
      : null;

  if (!parts) return date;

  const [day, month, year] = parts;
  const parsedDate = new Date(year, month - 1, day);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return date;
  }

  return parsedDate.toLocaleDateString(siteConfig.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

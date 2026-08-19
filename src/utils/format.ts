import { siteConfig } from "@/config/site";
export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat(siteConfig.locale, {
    style: "currency",
    currency: siteConfig.currency,
    maximumFractionDigits: 0,
  }).format(amount);

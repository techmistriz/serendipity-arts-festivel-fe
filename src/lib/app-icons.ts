// Festival app icon set — drawn on a 24×24 grid, square caps, 2px stroke,
// to sit with the notch/heavy type of the Serendipity identity.

export type AppIcon = { name: string; slug: string; body: string };

const S = (body: string) => body.trim();

export const APP_ICONS: AppIcon[] = [
  {
    name: "Home",
    slug: "home",
    body: S(`<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/>`),
  },
  {
    name: "Notifications",
    slug: "notifications",
    body: S(`<path d="M5.5 18h13l-2-3v-4.5a4.5 4.5 0 0 0-9 0V15z"/><path d="M10 18v.5a2 2 0 0 0 4 0V18"/><path d="M12 3v2.5"/>`),
  },
  {
    name: "Search",
    slug: "search",
    body: S(`<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>`),
  },
  {
    name: "Art Pass",
    slug: "art-pass",
    body: S(`<rect x="2.5" y="5.5" width="19" height="13"/><path d="M15 5.5v13"/><circle cx="8.75" cy="10.5" r="2"/><path d="M5.5 15.5c.7-1.6 1.9-2.4 3.25-2.4s2.55.8 3.25 2.4"/><path d="M17.5 9.5h2M17.5 12h2M17.5 14.5h2"/>`),
  },
  {
    name: "My Calendar",
    slug: "my-calendar",
    body: S(`<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/><rect x="6.5" y="13" width="4" height="4"/>`),
  },
  {
    name: "Programmes",
    slug: "programmes",
    body: S(`<rect x="3" y="4" width="7" height="7"/><rect x="14" y="4" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 17.5h7M17.5 14v7"/>`),
  },
  {
    name: "My Batch",
    slug: "my-batch",
    body: S(`<circle cx="12" cy="9" r="4.5"/><path d="M8.5 12.5 7 21l5-2.5L17 21l-1.5-8.5"/>`),
  },
  {
    name: "Festival",
    slug: "festival",
    body: S(`<path d="M12 2.5v3"/><path d="M12 5.5 3.5 12h17z"/><path d="M5.5 12v9M18.5 12v9"/><path d="M9.5 21v-5h5v5"/><path d="M3 21h18"/>`),
  },
  {
    name: "Profile",
    slug: "profile",
    body: S(`<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>`),
  },
  {
    name: "Settings",
    slug: "settings",
    body: S(`<circle cx="12" cy="12" r="3.25"/><path d="M12 2.5v3.25M12 18.25v3.25M2.5 12h3.25M18.25 12h3.25M5.2 5.2l2.3 2.3M16.5 16.5l2.3 2.3M18.8 5.2l-2.3 2.3M7.5 16.5l-2.3 2.3"/>`),
  },
  {
    name: "Edit Profile",
    slug: "edit-profile",
    body: S(`<circle cx="10" cy="8" r="3.75"/><path d="M3 20.5c0-3.9 3.1-6.25 7-6.25 .7 0 1.4.08 2 .23"/><path d="m18.5 12.5 3 3-5 5h-3v-3z"/>`),
  },
  {
    name: "Favourites",
    slug: "favourites",
    body: S(`<path d="M12 20.5 4.5 13a4.6 4.6 0 0 1 0-6.5 4.6 4.6 0 0 1 6.5 0l1 1 1-1a4.6 4.6 0 0 1 6.5 0 4.6 4.6 0 0 1 0 6.5z"/>`),
  },
  {
    name: "My Dashboard",
    slug: "my-dashboard",
    body: S(`<rect x="3" y="3.5" width="8" height="6"/><rect x="13" y="3.5" width="8" height="10"/><rect x="3" y="12.5" width="8" height="8"/><rect x="13" y="16.5" width="8" height="4"/>`),
  },
];

export function iconSvg(icon: AppIcon, size = 96, color = "#000000") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" aria-label="${icon.name}">${icon.body}</svg>`;
}

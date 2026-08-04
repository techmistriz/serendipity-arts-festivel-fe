# Serendipity Arts Festival — Round of Updates

This is a wide-ranging pass. Grouping into themes to keep it manageable.

## 1. Design system tightening

- **CMYK glitch palette** — restrict all glitch line colors to only the 6 pantones from the reference: `#B39ECC`, `#2C499F`, `#62C6C2`, `#CEDC29`, `#F47521`, `#F26458`. Update `GlitchBar.tsx`, `GlitchLines.tsx`, `MatrixBulge.tsx`, `SoundGlitch.tsx`, `GatherGlitch.tsx` palettes.
- **Unified border weight** — normalize all tile / image / GIF / form-field borders to 1.5px (matching form fields). Update `GlitchBorder` default thickness + border utility class.
- **Form field styling** — restyle the global `.input` class (and add matching select/textarea variants) to feel like the darkened rectangular tiles used for the age-group buttons: subtle fill, muted border, bold label above. Apply to all forms (register, VIP, contact, volunteer).
- **Category tags in CMYK** — swap black/white "performance / price" pill styles to CMYK-mapped colors so they read on any programme photo.

## 2. Glitch borders on every tile (heavier)

- Re-enable `GlitchBorder` on all image tiles: homepage archive/venues/curators/press, programmes cards, venues page, curators page.
- Increase hover-boost thickness and duration for a stronger effect.
- Bars only animate on hover (keep existing behavior).

## 3. Cart / booking flow

- **"Added to cart" becomes a route.** Instead of an overlay, navigate to `/cart/added?id=…` after add-to-cart, showing the confirmation screen (title, date, time) with `+ Add more programmes` and `Continue to checkout`. Works identically on mobile and desktop.
- **Date + time selection moves into the per-programme booking sheet.** Remove the global time filter from the programmes listing page. Booking sheet lets users pick date+slot before add-to-cart.
- **Register-first hard gate.** If not logged in / registered, clicking Add to cart routes to `/register?redirect=…` with a full-page notice: "Complete your registration to book programmes." No overlay; always visible.

## 4. Programmes page

- Remove global Time filter (kept only Date). Time picking happens per-programme.
- **Routed category filters.** Category selection updates the URL path (`/programmes/performance`, `/programmes/workshop`, `/programmes/exhibition`, etc.) not just search params. Preserve non-category filters (search, date, venue) via search params. Add a splat route or leaf routes under `programmes.$category.tsx`.
- **"Newly added" marker** — add `newlyAdded?: boolean` to `programmes-data.ts`; render a small CMYK-colored pill on the card.
- **Copy change** — replace "we run out of tickets closer to the festival" with "We keep adding new programmes — book them before they get sold out."
- **How-to-book box** — keep on the listing page, remove from the single-programme detail view.

## 5. Homepage

- **"Enough about us"** — rename About section heading.
- **Universal search** — the header search on the home page routes to any page (venues sub-pages like "Art Park", curator names, programmes, static pages). Build a small in-memory index of routes + venue sub-venues + curator names + programme titles; typeahead suggests + navigates. Programmes-page search stays programme-specific.
- **Press images** — replace text-only press cards with the outlet's article thumbnail (use the source article's OG image URLs; if unavailable, use logo placeholder).
- **New "What stayed with them" section** above Press. Testimonials from the 8 uploaded screenshots (Kiran Mazumdar Shaw, Sanjeev Mantri, Sneha Khanwalkar, Shri Pramod Sawant, Late Shri Manohar Parrikar, Meer Mukhtiyar Ali, Chandra Shekhar Ojha, Bickram Ghosh). Focus on the quote; small circular headshot + name + role. Wrap in `schema.org/Review` JSON-LD for SEO.

## 6. VIP / Special Guest form

Rebuild `src/routes/register.tsx` VIP branch with only the fields specified:
- Email, Full Name, Contact (with full country code dropdown — long ISO list as provided)
- Dates attending (multi-select chips: 13–20 Dec + All)
- Travel assistance (Y/N), Lodging assistance (Y/N), Accommodation assistance (Y/N), Accompanying guest (Y/N)
- Additional requests textarea
- Intro copy + the bullet list of "quick notes" as final block
- Submit → "Complete Registration"

## 7. Dashboard

- **Wishlist works.** Currently `toggleWish` exists but no UI adds to it or reads it in Dashboard. Add Wishlist section that lists wishlisted programmes with remove + "Add to cart" actions. Add heart toggle on programme cards.
- **Disable blinking** on Dashboard nav icon.

## 8. Programme recommender

New homepage section: **"Let us help you recommend programmes."** Opens a route/dialog `/recommend` with sequential questions:
1. How would you describe yourself? (free chips)
2. Multi-select preferences: reader, theatre, exhibitions, foodie, has children, crafts, films, workshops
Each option maps to programme categories/tags. Result page shows matching programmes. Store mapping in `src/lib/recommender.ts` so future programmes with the right categories auto-appear.

## 9. Volunteer page images

Use images from the Drive folder. I can't fetch from Google Drive without public download URLs, so I'll ask the user to either make the folder fully public with direct image links or upload the specific images here. In the meantime, I'll leave placeholders and wire up the layout.

---

## Not in scope (please confirm)

- **Google Drive images** — need direct download URLs or uploaded files.
- **Press article images** — I'll use each outlet's known logo; if you want the actual article hero images, please share URLs.

If this looks right I'll implement in one pass. Given the size, I'll ship in this order: design tokens & borders → cart flow routes → forms → programmes routing → homepage sections (recommender, testimonials, press images, search) → dashboard wishlist → VIP form → volunteer placeholders.

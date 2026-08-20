import collageHero from "@public/collage-hero-hd.jpg";
import curatorsBox from "@public/curators-box.jpg";
import pressBox from "@public/press-box.png";
import testimonialsBox from "@public/testimonials-box.png";
import venuesBox from "@public/venues-box.png";
import whiteLogo from "@public/images/home/saf-logo-white-2026.png";
import g1 from "@public/images/about/brij-cnap.jpg";
import g2 from "@public/images/about/eyes-shall-deceive.jpg";
import g3 from "@public/images/about/food-matters.jpg";
import g4 from "@public/images/about/futures-in-formation.jpg";
import g5 from "@public/images/about/london-puppet.jpg";
import g6 from "@public/images/about/music-grant.jpg";
import g7 from "@public/images/about/residency-2026.jpg";
import g8 from "@public/images/about/theatre-grant.jpg";
import g9 from "@public/images/about/wac-writing.jpg";
import festivalLogo from "@public/images/footer/Serendipity_Arts_Festival_Logos-01_1.webp";
import foundationLogo from "@public/images/footer/Serendipity_Arts_Logo-2.png";

export const homeImages = {
  collageHero,
  curatorsBox,
  pressBox,
  testimonialsBox,
  venuesBox,
  whiteLogo,
} as const;

export const GRANT_IMAGES = [g1, g2, g3, g4, g5, g6, g7, g8, g9] as const;

export const footerImages = {
  festivalLogo,
  foundationLogo,
} as const;

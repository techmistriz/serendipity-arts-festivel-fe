import Link from "next/link";
import Image from "next/image";

import GlitchBar from "@/components/common/GlitchBar";
import { footerImages } from "@/config/images";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="relative rule-t mt-32 overflow-hidden">
      {/* Glitch Bars */}
      <GlitchBar seed={41} direction="h" speed={5} count={140} className="h-4 w-full" />

      <GlitchBar
        seed={73}
        direction="v"
        variant="bulge"
        speed={1.4}
        count={120}
        className="absolute right-0 top-4 bottom-0 hidden w-2 md:block"
      />

      <GlitchBar
        seed={58}
        direction="v"
        variant="vibrate"
        speed={0.32}
        count={120}
        className="absolute left-0 top-4 bottom-0 hidden w-2 md:block"
      />

      <div className="container-editorial py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Left */}
          <div className="md:col-span-5">
            <div className="flex flex-wrap items-center gap-6 md:gap-10 mb-8">
              <Image
                src={footerImages.foundationLogo}
                alt="Serendipity Arts Foundation"
                width={220}
                height={60}
                sizes="(min-width: 768px) 220px, 180px"
                className="h-9 md:h-12 w-auto object-contain"
              />

              <Image
                src={footerImages.festivalLogo}
                alt="Serendipity Arts Festival"
                width={220}
                height={90}
                sizes="(min-width: 768px) 220px, 180px"
                className="h-20 w-auto object-contain md:h-28"
              />
            </div>

            <p className="display mb-6 text-2xl uppercase leading-[1.05] md:text-3xl">
              Subscribe to The Serendipity Dispatch, our monthly newsletter.
            </p>

            <form className="flex max-w-md items-center gap-3 border-b border-foreground pb-2">
              <input
                type="email"
                placeholder="your@email"
                aria-label="Email address"
                className="flex-1 bg-transparent py-2 text-base outline-none placeholder:text-muted-foreground"
              />

              <button type="submit" className="label transition-colors hover:text-accent">
                Subscribe →
              </button>
            </form>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2 md:col-start-8">
            <p className="label mb-4 text-muted-foreground">Navigate</p>

            <ul className="headline space-y-2 text-sm">
              {siteConfig.footer.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-2">
            <p className="label mb-4 text-muted-foreground">Follow</p>

            <ul className="space-y-2 text-sm">
              {siteConfig.footer.socialLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <p className="label mb-4 text-muted-foreground">Legal</p>

            <ul className="space-y-2 text-sm">
              {siteConfig.footer.legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 rule-t pt-6">
          <p className="label text-muted-foreground mb-4">Past editions</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm headline">
            {siteConfig.footer.archives.map((archive) => (
              <li key={archive.year}>
                <a
                  href={archive.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  {archive.year}
                  {"note" in archive && archive.note ? (
                    <span className="text-muted-foreground"> ({archive.note})</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground headline max-w-2xl">
            The 2022 and 2019 festival websites aren&rsquo;t available due to technical reasons — do
            explore their catalogues instead.
          </p>
        </div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t pt-6">
          <p className="label text-muted-foreground">
            © Serendipity Arts Festival. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

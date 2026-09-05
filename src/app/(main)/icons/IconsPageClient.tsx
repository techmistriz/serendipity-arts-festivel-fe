"use client";

import { APP_ICONS, iconSvg, type AppIcon } from "@/data/app-icons";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadSvg(icon: AppIcon) {
  downloadBlob(new Blob([iconSvg(icon, 96)], { type: "image/svg+xml" }), `saf-${icon.slug}.svg`);
}

function downloadPng(icon: AppIcon, size = 512) {
  const svg = iconSvg(icon, size);
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0, size, size);
    c.toBlob((b) => b && downloadBlob(b, `saf-${icon.slug}.png`), "image/png");
  };
  img.src = `data:image/svg+xml;base64,${btoa(svg)}`;
}

function downloadAll() {
  APP_ICONS.forEach((i, n) => setTimeout(() => downloadSvg(i), n * 120));
}

export function IconsPageClient() {
  return (
    <div className="container-editorial pt-10 md:pt-20 pb-32">
      <h1 className="display uppercase text-[12vw] md:text-[9vw] leading-[0.9]">Icons</h1>
      <p className="mt-6 headline text-muted-foreground max-w-2xl">
        The app icon set, drawn on a 24 grid with square caps to match the festival’s notch
        lettering. Download any icon as SVG (vector) or PNG (512px).
      </p>

      <div className="mt-8">
        <button
          onClick={downloadAll}
          className="label notch bg-foreground text-background px-5 py-3 hover:bg-accent transition-colors"
        >
          Download all SVGs →
        </button>
      </div>

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {APP_ICONS.map((icon) => (
          <figure key={icon.slug} className="border-[3px] border-black p-5 flex flex-col">
            <div
              className="flex-1 flex items-center justify-center py-8 text-foreground"
              dangerouslySetInnerHTML={{ __html: iconSvg(icon, 72, "currentColor") }}
            />
            <figcaption className="headline font-semibold uppercase text-sm rule-t pt-3">
              {icon.name}
            </figcaption>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => downloadSvg(icon)}
                className="label notch border-[3px] border-black px-3 py-2 hover:text-accent transition-colors"
              >
                SVG
              </button>
              <button
                onClick={() => downloadPng(icon)}
                className="label notch border-[3px] border-black px-3 py-2 hover:text-accent transition-colors"
              >
                PNG
              </button>
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}

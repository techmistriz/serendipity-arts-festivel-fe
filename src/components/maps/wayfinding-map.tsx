"use client";

import { useMemo, useState } from "react";

export type MapPoint = {
  slug: string;
  short: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
};

export type MapRoad = {
  name: string;
  points: [number, number][]; // [lat, lng]
  major?: boolean;
};

export type MapArea = {
  name: string;
  kind: "water" | "green";
  points: [number, number][];
};

export type MapNode = {
  name: string;
  kind: "tube" | "rail" | "bus" | "parking" | "ferry" | "info";
  lat: number;
  lng: number;
};

const NODE_GLYPH: Record<MapNode["kind"], string> = {
  tube: "U",
  rail: "R",
  bus: "B",
  parking: "P",
  ferry: "F",
  info: "i",
};

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function mapsUrl(p: MapPoint) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    p.address ? `${p.name}, ${p.address}` : `${p.lat},${p.lng}`,
  )}`;
}

/**
 * Stylised but geographically-projected wayfinding map: named streets,
 * transport nodes, numbered venue pins and a walking route through the
 * venues on the visitor’s itinerary.
 */
export function WayfindingMap({
  points,
  roads = [],
  areas = [],
  nodes = [],
  highlight = [],
  caption,
  ariaLabel,
}: {
  points: MapPoint[];
  roads?: MapRoad[];
  areas?: MapArea[];
  nodes?: MapNode[];
  highlight?: string[];
  caption?: string;
  ariaLabel: string;
}) {
  const [hover, setHover] = useState<string | null>(null);

  const W = 900;
  const H = 540;

  const proj = useMemo(() => {
    const all: [number, number][] = [
      ...points.map((p) => [p.lat, p.lng] as [number, number]),
      ...roads.flatMap((r) => r.points),
      ...areas.flatMap((a) => a.points),
      ...nodes.map((n) => [n.lat, n.lng] as [number, number]),
    ];
    const lats = all.map((p) => p[0]);
    const lngs = all.map((p) => p[1]);
    const padY = (Math.max(...lats) - Math.min(...lats)) * 0.12 + 0.0006;
    const padX = (Math.max(...lngs) - Math.min(...lngs)) * 0.12 + 0.0006;
    const minLat = Math.min(...lats) - padY;
    const maxLat = Math.max(...lats) + padY;
    const minLng = Math.min(...lngs) - padX;
    const maxLng = Math.max(...lngs) + padX;
    return {
      x: (lng: number) => ((lng - minLng) / (maxLng - minLng)) * W,
      y: (lat: number) => H - ((lat - minLat) / (maxLat - minLat)) * H,
    };
  }, [points, roads, areas, nodes]);

  const { x, y } = proj;
  const line = (pts: [number, number][]) =>
    pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${x(p[1]).toFixed(1)} ${y(p[0]).toFixed(1)}`)
      .join(" ");

  const routePoints = useMemo(
    () => highlight.map((s) => points.find((p) => p.slug === s)).filter(Boolean) as MapPoint[],
    [highlight, points],
  );

  const routeKm = useMemo(() => {
    let km = 0;
    for (let i = 1; i < routePoints.length; i++)
      km += haversineKm(routePoints[i - 1], routePoints[i]);
    return km;
  }, [routePoints]);

  const walkMin = Math.max(1, Math.round((routeKm * 1.3) / 0.08)); // 4.8 km/h + street factor

  return (
    <div className="border-[3px] border-black bg-background">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={ariaLabel}>
        <defs>
          <pattern id="wf-hatch" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0 8 L8 0" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
          </pattern>
          <marker
            id="wf-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" className="fill-accent" />
          </marker>
        </defs>

        <rect width={W} height={H} className="fill-muted/25" />

        {/* Areas: parks and water */}
        {areas.map((a) => (
          <g key={a.name}>
            <path
              d={`${line(a.points)} Z`}
              className={a.kind === "water" ? "fill-foreground/10" : "fill-foreground/[0.06]"}
              stroke="currentColor"
              strokeWidth={1}
              opacity={0.5}
            />
            <path d={`${line(a.points)} Z`} fill="url(#wf-hatch)" stroke="none" />
          </g>
        ))}

        {/* Roads */}
        {roads.map((r) => {
          const d = line(r.points);
          return (
            <g key={r.name}>
              <path
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={r.major ? 16 : 9}
                opacity={0.12}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                opacity={0.35}
                strokeDasharray="6 6"
              />
              <path id={`wf-road-${r.name.replace(/\W+/g, "-")}`} d={d} fill="none" stroke="none" />
              <text className="label" fontSize={11} fill="currentColor" opacity={0.6}>
                <textPath href={`#wf-road-${r.name.replace(/\W+/g, "-")}`} startOffset="42%">
                  {r.name.toUpperCase()}
                </textPath>
              </text>
            </g>
          );
        })}

        {/* Walking route through itinerary */}
        {routePoints.length > 1 && (
          <path
            d={line(routePoints.map((p) => [p.lat, p.lng] as [number, number]))}
            fill="none"
            className="stroke-accent"
            strokeWidth={3}
            strokeDasharray="10 7"
            markerEnd="url(#wf-arrow)"
          />
        )}

        {/* Transport nodes */}
        {nodes.map((n) => (
          <g key={n.name}>
            <circle
              cx={x(n.lng)}
              cy={y(n.lat)}
              r={9}
              className="fill-background"
              stroke="currentColor"
              strokeWidth={3}
            />
            <text
              x={x(n.lng)}
              y={y(n.lat) + 4}
              fontSize={10}
              textAnchor="middle"
              className="label"
              fill="currentColor"
            >
              {NODE_GLYPH[n.kind]}
            </text>
            <text
              x={x(n.lng)}
              y={y(n.lat) + 24}
              fontSize={10}
              textAnchor="middle"
              className="label"
              fill="currentColor"
              opacity={0.65}
            >
              {n.name.toUpperCase()}
            </text>
          </g>
        ))}

        {/* Venue pins */}
        {points.map((p, i) => {
          const on = highlight.includes(p.slug);
          const active = hover === p.slug;
          const px = x(p.lng);
          const py = y(p.lat);
          const flip = px > W - 170;
          return (
            <g
              key={p.slug}
              onMouseEnter={() => setHover(p.slug)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            >
              {(on || active) && (
                <circle
                  cx={px}
                  cy={py}
                  r={20}
                  className="fill-accent"
                  opacity={active ? 0.22 : 0.12}
                />
              )}
              <rect
                x={px - 11}
                y={py - 11}
                width={22}
                height={22}
                className={on ? "fill-accent" : "fill-background"}
                stroke="currentColor"
                strokeWidth={3}
              />
              <text
                x={px}
                y={py + 5}
                fontSize={12}
                textAnchor="middle"
                className="label"
                fill="currentColor"
              >
                {i + 1}
              </text>
              <text
                x={flip ? px - 18 : px + 18}
                y={py + 5}
                textAnchor={flip ? "end" : "start"}
                className="label"
                fontSize={14}
                fill="currentColor"
                opacity={active || on ? 1 : 0.8}
              >
                {p.short}
              </text>
            </g>
          );
        })}

        {/* Scale bar + north arrow */}
        <g transform={`translate(24, ${H - 30})`}>
          <line x1={0} y1={0} x2={90} y2={0} stroke="currentColor" strokeWidth={3} />
          <line x1={0} y1={-5} x2={0} y2={5} stroke="currentColor" strokeWidth={3} />
          <line x1={90} y1={-5} x2={90} y2={5} stroke="currentColor" strokeWidth={3} />
          <text x={0} y={-10} fontSize={11} className="label" fill="currentColor">
            ~5 MIN WALK
          </text>
        </g>
        <g transform={`translate(${W - 44}, 40)`}>
          <path
            d="M0 18 L0 -18 M0 -18 L-6 -8 M0 -18 L6 -8"
            stroke="currentColor"
            strokeWidth={3}
            fill="none"
          />
          <text
            x={0}
            y={34}
            fontSize={11}
            textAnchor="middle"
            className="label"
            fill="currentColor"
          >
            N
          </text>
        </g>
      </svg>

      {/* Legend + directions list */}
      <div className="rule-t grid grid-cols-1 md:grid-cols-2">
        <ul className="md:border-r-[3px] md:border-black">
          {points.map((p, i) => {
            const on = highlight.includes(p.slug);
            return (
              <li
                key={p.slug}
                onMouseEnter={() => setHover(p.slug)}
                onMouseLeave={() => setHover(null)}
                className={`flex items-center gap-3 px-4 py-3 rule-b ${hover === p.slug ? "bg-muted/40" : ""}`}
              >
                <span
                  className={`label w-7 h-7 grid place-items-center border-[3px] border-black shrink-0 ${
                    on ? "bg-accent" : ""
                  }`}
                >
                  {i + 1}
                </span>
                <span className="headline text-sm md:text-base">{p.name}</span>
                <a
                  href={mapsUrl(p)}
                  target="_blank"
                  rel="noreferrer"
                  className="label ml-auto notch hover:text-accent whitespace-nowrap"
                >
                  Directions →
                </a>
              </li>
            );
          })}
        </ul>
        <div className="px-4 py-4 space-y-3">
          <p className="label">Route on your itinerary</p>
          {routePoints.length > 1 ? (
            <>
              <p className="headline text-sm text-muted-foreground">
                {routePoints.map((p) => p.short).join(" → ")}
              </p>
              <p className="display text-2xl">
                {routeKm.toFixed(1)} km · about {walkMin} min on foot
              </p>
              <a
                href={`https://www.google.com/maps/dir/${routePoints
                  .map((p) => `${p.lat},${p.lng}`)
                  .join("/")}/data=!4m2!4m1!3e2`}
                target="_blank"
                rel="noreferrer"
                className="inline-block label notch bg-foreground text-background px-5 py-3 hover:bg-accent"
              >
                Open walking route →
              </a>
            </>
          ) : (
            <p className="headline text-sm text-muted-foreground">
              Add two or more sessions and we will draw the shortest walk between the venues.
            </p>
          )}
          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
            <Key swatch="accent" label="On your itinerary" />
            <Key swatch="outline" label="Other venue" />
            <Key swatch="node" label="Transport" />
          </div>
        </div>
      </div>

      {caption && <p className="label text-muted-foreground px-4 py-3 rule-t">{caption}</p>}
    </div>
  );
}

function Key({ swatch, label }: { swatch: "accent" | "outline" | "node"; label: string }) {
  return (
    <span className="label flex items-center gap-2 text-muted-foreground">
      <span
        className={
          swatch === "node"
            ? "w-4 h-4 rounded-full border-[3px] border-black"
            : `w-4 h-4 border-[3px] border-black ${swatch === "accent" ? "bg-accent" : ""}`
        }
      />
      {label}
    </span>
  );
}

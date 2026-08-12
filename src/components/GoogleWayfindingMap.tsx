"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapNode, MapPoint } from "./WayfindingMap";

declare global {
  interface Window {
    google?: any;
    __safMapsReady?: boolean;
    __safMapsInit?: () => void;
  }
}

const NODE_GLYPH: Record<MapNode["kind"], string> = {
  tube: "U",
  rail: "R",
  bus: "B",
  parking: "P",
  ferry: "F",
  info: "i",
};

function loadMaps(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser"));
  }

  if (window.google?.maps?.Map) {
    return Promise.resolve(window.google);
  }

  return new Promise((resolve, reject) => {
    const key =
      process.env.NEXT_PUBLIC_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;


    console.log("Google Maps key exists:", !!key);
    console.log("Google Maps key:", key);

    const channel =
      process.env.NEXT_PUBLIC_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;

    if (!key) {
      reject(
        new Error(
          "Google Maps API key missing. Check NEXT_PUBLIC_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"
        )
      );
      return;
    }

    const existing = document.getElementById("saf-gmaps");

    if (existing) {
      const start = Date.now();

      const check = () => {
        if (window.google?.maps?.Map) {
          resolve(window.google);
          return;
        }

        if (Date.now() - start > 15000) {
          reject(new Error("Google Maps timed out"));
          return;
        }

        setTimeout(check, 100);
      };

      check();
      return;
    }

    window.__safMapsInit = () => {
      if (window.google?.maps?.Map) {
        resolve(window.google);
      } else {
        reject(new Error("Google Maps loaded but Map is unavailable"));
      }
    };

    const script = document.createElement("script");

    script.id = "saf-gmaps";
    script.async = true;
    script.defer = true;

    script.src =
      `https://maps.googleapis.com/maps/api/js` +
      `?key=${encodeURIComponent(key)}` +
      `&libraries=geometry` +
      `&loading=async` +
      `&callback=__safMapsInit` +
      (channel ? `&channel=${encodeURIComponent(channel)}` : "");

    script.onerror = () => {
      reject(new Error("Google Maps script failed to load"));
    };

    document.head.appendChild(script);
  });
}

function pinSvg(label: string, active: boolean) {
  const bg = active ? "#ff2d78" : "#ffffff";
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><rect x="6" y="6" width="32" height="32" fill="${bg}" stroke="#000" stroke-width="3"/><text x="22" y="28" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="700" text-anchor="middle" fill="#000">${label}</text></svg>`,
    )
  );
}

function nodeSvg(glyph: string) {
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34"><circle cx="17" cy="17" r="12" fill="#fff" stroke="#000" stroke-width="3"/><text x="17" y="22" font-family="Arial,Helvetica,sans-serif" font-size="12" font-weight="700" text-anchor="middle" fill="#000">${glyph}</text></svg>`,
    )
  );
}

function mapsUrl(p: MapPoint) {
  const destination = p.address
    ? `${p.name}, ${p.address}`
    : `${p.lat},${p.lng}`;

  return `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${encodeURIComponent(
    destination
  )}`;
}

/** Real Google Maps wayfinding: satellite/roadmap toggle, walking directions between itinerary venues. */
export function GoogleWayfindingMap({
  points,
  nodes = [],
  highlight = [],
  caption,
  ariaLabel,
}: {
  points: MapPoint[];
  nodes?: MapNode[];
  highlight?: string[];
  caption?: string;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const rendererRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{ km: number; min: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [fromSlug, setFromSlug] = useState<string>("");
  const [toSlug, setToSlug] = useState<string>("");
  const [mode, setMode] = useState<"WALKING" | "DRIVING" | "TRANSIT">("WALKING");
  const [steps, setSteps] = useState<{ text: string; dist: string }[]>([]);

  const itineraryPoints = useMemo(
    () => highlight.map((s) => points.find((p) => p.slug === s)).filter(Boolean) as MapPoint[],
    [highlight, points],
  );

  const fromPoint = points.find((p) => p.slug === fromSlug) ?? null;
  const toPoint = points.find((p) => p.slug === toSlug) ?? null;
  const custom = !!fromPoint && !!toPoint && fromSlug !== toSlug;

  const routePoints = useMemo(
    () => (custom ? ([fromPoint, toPoint] as MapPoint[]) : itineraryPoints),
    [custom, fromPoint, toPoint, itineraryPoints],
  );



  useEffect(() => {
    let cancelled = false;
    loadMaps()
      .then((google) => {
        if (cancelled || !ref.current) return;
        const bounds = new google.maps.LatLngBounds();
        [...points, ...nodes].forEach((p: any) => bounds.extend({ lat: p.lat, lng: p.lng }));
        const map = new google.maps.Map(ref.current, {
          center: bounds.getCenter(),
          zoom: 15,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });
        map.fitBounds(bounds, 60);
        mapRef.current = map;

        const info = new google.maps.InfoWindow();

        points.forEach((p, i) => {
          const marker = new google.maps.Marker({
            position: { lat: p.lat, lng: p.lng },
            map,
            title: p.name,
            icon: {
              url: pinSvg(String(i + 1), highlight.includes(p.slug)),
              scaledSize: new google.maps.Size(44, 44),
              anchor: new google.maps.Point(22, 22),
            },
          });
          marker.addListener("click", () => {
            setSelected(p.slug);
            info.setContent(
              `<div style="font-family:Inter,Arial,sans-serif;max-width:220px"><strong>${p.name}</strong>${p.address ? `<br/><span style="opacity:.7">${p.address}</span>` : ""
              }<br/><a href="${mapsUrl(p)}" target="_blank" rel="noreferrer">Walking directions →</a></div>`,
            );
            info.open({ map, anchor: marker });
          });
          markersRef.current.push(marker);
        });

        nodes.forEach((n) => {
          const marker = new google.maps.Marker({
            position: { lat: n.lat, lng: n.lng },
            map,
            title: n.name,
            icon: {
              url: nodeSvg(NODE_GLYPH[n.kind]),
              scaledSize: new google.maps.Size(34, 34),
              anchor: new google.maps.Point(17, 17),
            },
          });
          markersRef.current.push(marker);
        });
      })
      .catch((e) => !cancelled && setError(e.message));

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };
  }, [points, nodes, highlight]);

  // Directions: point-to-point when chosen, otherwise through itinerary venues
  useEffect(() => {
    const google = typeof window !== "undefined" ? window.google : undefined;
    const map = mapRef.current;
    if (!google?.maps || !map) return;
    if (rendererRef.current) {
      rendererRef.current.setMap(null);
      rendererRef.current = null;
    }
    setSummary(null);
    setSteps([]);
    if (routePoints.length < 2) return;

    const renderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: { strokeColor: "#ff2d78", strokeWeight: 5, strokeOpacity: 0.9 },
    });
    rendererRef.current = renderer;

    new google.maps.DirectionsService().route(
      {
        origin: { lat: routePoints[0].lat, lng: routePoints[0].lng },
        destination: {
          lat: routePoints[routePoints.length - 1].lat,
          lng: routePoints[routePoints.length - 1].lng,
        },
        waypoints: routePoints.slice(1, -1).map((p) => ({ location: { lat: p.lat, lng: p.lng }, stopover: true })),
        travelMode: google.maps.TravelMode[mode],
      },
      (res: any, status: string) => {
        if (status !== "OK" || !res) {
          // Directions unavailable: draw a straight-line route and estimate.
          const path = new google.maps.Polyline({
            map,
            path: routePoints.map((p) => ({ lat: p.lat, lng: p.lng })),
            strokeColor: "#ff2d78",
            strokeWeight: 4,
            strokeOpacity: 0.9,
          });
          rendererRef.current = path;
          let km = 0;
          for (let i = 1; i < routePoints.length; i++) {
            km +=
              google.maps.geometry?.spherical?.computeDistanceBetween?.(
                new google.maps.LatLng(routePoints[i - 1].lat, routePoints[i - 1].lng),
                new google.maps.LatLng(routePoints[i].lat, routePoints[i].lng),
              ) / 1000 || 0;
          }
          const speed = mode === "WALKING" ? 4.8 : 22;
          setSummary({ km: km * 1.3, min: Math.max(1, Math.round(((km * 1.3) / speed) * 60)) });
          return;
        }
        renderer.setDirections(res);
        const legs = res.routes[0].legs;
        const m = legs.reduce((a: number, l: any) => a + l.distance.value, 0);
        const s = legs.reduce((a: number, l: any) => a + l.duration.value, 0);
        setSummary({ km: m / 1000, min: Math.max(1, Math.round(s / 60)) });
        setSteps(
          legs
            .flatMap((l: any) => l.steps ?? [])
            .map((st: any) => ({
              text: String(st.instructions ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
              dist: st.distance?.text ?? "",
            }))
            .slice(0, 12),
        );
      },
    );
  }, [routePoints, mode, error]);


  return (
    <div className="border-[3px] border-black bg-background">
      {error ? (
        <div className="p-6">
          <p className="headline text-sm text-muted-foreground">Map unavailable: {error}</p>
        </div>
      ) : (
        <div ref={ref} role="application" aria-label={ariaLabel} className="w-full h-[420px] md:h-[560px]" />
      )}

      <div className="rule-t grid grid-cols-1 md:grid-cols-2">
        <ul className="md:border-r-[3px] md:border-black">
          {points.map((p, i) => {
            const on = highlight.includes(p.slug);
            return (
              <li
                key={p.slug}
                onClick={() => {
                  setSelected(p.slug);
                  mapRef.current?.panTo({ lat: p.lat, lng: p.lng });
                  mapRef.current?.setZoom(17);
                }}
                className={`flex items-center gap-3 px-4 py-3 rule-b cursor-pointer ${selected === p.slug ? "bg-muted/40" : ""
                  }`}
              >
                <span
                  className={`label w-7 h-7 grid place-items-center border-[3px] border-black shrink-0 ${on ? "bg-accent" : ""
                    }`}
                >
                  {i + 1}
                </span>
                <span className="headline text-sm md:text-base">{p.name}</span>
                <a
                  href={mapsUrl(p)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="label ml-auto notch hover:text-accent whitespace-nowrap"
                >
                  Directions →
                </a>
              </li>
            );
          })}
        </ul>
        <div className="px-4 py-4 space-y-3">
          <p className="label">Get directions</p>
          <div className="grid grid-cols-1 gap-2">
            <select
              value={fromSlug}
              onChange={(e) => setFromSlug(e.target.value)}
              aria-label="From venue"
              className="headline text-sm border-[3px] border-black bg-background px-3 py-2"
            >
              <option value="">From…</option>
              {points.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              value={toSlug}
              onChange={(e) => setToSlug(e.target.value)}
              aria-label="To venue"
              className="headline text-sm border-[3px] border-black bg-background px-3 py-2"
            >
              <option value="">To…</option>
              {points.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              {(["WALKING", "DRIVING", "TRANSIT"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`label notch border-[3px] border-black px-3 py-2 ${mode === m ? "bg-foreground text-background" : "hover:bg-muted"
                    }`}
                >
                  {m === "WALKING" ? "Walk" : m === "DRIVING" ? "Drive" : "Transit"}
                </button>
              ))}
              {custom && (
                <button
                  type="button"
                  onClick={() => {
                    setFromSlug("");
                    setToSlug("");
                  }}
                  className="label notch ml-auto hover:text-accent"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <p className="label pt-2">{custom ? "Your route" : "Route on your itinerary"}</p>
          {routePoints.length > 1 ? (
            <>
              <p className="headline text-sm text-muted-foreground">
                {routePoints.map((p) => p.short).join(" → ")}
              </p>
              <p className="display text-2xl">
                {summary
                  ? `${summary.km.toFixed(1)} km · about ${summary.min} min ${mode === "WALKING" ? "on foot" : mode === "DRIVING" ? "by car" : "by transit"
                  }`
                  : "Calculating route…"}
              </p>
              {steps.length > 0 && (
                <ol className="space-y-1 max-h-52 overflow-auto pr-1">
                  {steps.map((s, i) => (
                    <li key={i} className="headline text-xs text-muted-foreground flex gap-2">
                      <span className="label shrink-0">{i + 1}</span>
                      <span>
                        {s.text} {s.dist && <span className="opacity-60">({s.dist})</span>}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
              <a
                href={`https://www.google.com/maps/dir/${routePoints
                  .map((p) => `${p.lat},${p.lng}`)
                  .join("/")}/data=!4m2!4m1!3e${mode === "WALKING" ? 2 : mode === "DRIVING" ? 0 : 3}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block label notch bg-foreground text-background px-5 py-3 hover:bg-accent"
              >
                Open in Google Maps →
              </a>
            </>
          ) : (
            <p className="headline text-sm text-muted-foreground">
              Pick a start and an end venue above, or add two or more sessions to your itinerary.
            </p>
          )}
        </div>

      </div>

      {caption && <p className="label text-muted-foreground px-4 py-3 rule-t">{caption}</p>}
    </div>
  );
}

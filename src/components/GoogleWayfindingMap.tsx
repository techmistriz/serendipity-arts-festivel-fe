"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MapNode, MapPoint } from "./WayfindingMap";

declare global {
  interface Window {
    google?: any;
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
    return Promise.reject(
      new Error("Google Maps can only load in the browser"),
    );
  }

  if (window.google?.maps?.Map) {
    return Promise.resolve(window.google);
  }

  return new Promise((resolve, reject) => {
    const key =
      process.env.NEXT_PUBLIC_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;

    const channel =
      process.env.NEXT_PUBLIC_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;

    if (!key) {
      reject(
        new Error(
          "Google Maps API key missing. Check NEXT_PUBLIC_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY",
        ),
      );
      return;
    }

    const existing = document.getElementById(
      "saf-gmaps",
    ) as HTMLScriptElement | null;

    if (existing) {
      const started = Date.now();

      const check = () => {
        if (window.google?.maps?.Map) {
          resolve(window.google);
          return;
        }

        if (Date.now() - started > 15000) {
          reject(new Error("Google Maps timed out"));
          return;
        }

        window.setTimeout(check, 100);
      };

      check();
      return;
    }

    window.__safMapsInit = () => {
      if (window.google?.maps?.Map) {
        resolve(window.google);
      } else {
        reject(
          new Error("Google Maps loaded but Map is unavailable"),
        );
      }
    };

    const script = document.createElement("script");

    script.id = "saf-gmaps";
    script.async = true;
    script.defer = true;

    const params = new URLSearchParams({
      key,
      libraries: "geometry",
      loading: "async",
      callback: "__safMapsInit",
    });

    if (channel) {
      params.set("channel", channel);
    }

    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;

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
      `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44">
        <rect x="6" y="6" width="32" height="32" fill="${bg}" stroke="#000" stroke-width="3"/>
        <text
          x="22"
          y="28"
          font-family="Arial,Helvetica,sans-serif"
          font-size="15"
          font-weight="700"
          text-anchor="middle"
          fill="#000"
        >${label}</text>
      </svg>`,
    )
  );
}

function nodeSvg(glyph: string) {
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34">
        <circle cx="17" cy="17" r="12" fill="#fff" stroke="#000" stroke-width="3"/>
        <text
          x="17"
          y="22"
          font-family="Arial,Helvetica,sans-serif"
          font-size="12"
          font-weight="700"
          text-anchor="middle"
          fill="#000"
        >${glyph}</text>
      </svg>`,
    )
  );
}

function mapsUrl(p: MapPoint) {
  const params = new URLSearchParams({
    api: "1",
    travelmode: "walking",
    destination: `${p.lat},${p.lng}`,
  });

  if ("placeId" in p && p.placeId) {
    params.set("destination_place_id", p.placeId);
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

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
  const [summary, setSummary] = useState<{
    km: number;
    min: number;
  } | null>(null);

  const [selected, setSelected] = useState<string | null>(null);
  const [fromSlug, setFromSlug] = useState("");
  const [toSlug, setToSlug] = useState("");

  const [mode, setMode] = useState<
    "WALKING" | "DRIVING" | "TRANSIT"
  >("WALKING");

  const [steps, setSteps] = useState<
    { text: string; dist: string }[]
  >([]);

  const itineraryPoints = useMemo(
    () =>
      highlight
        .map((slug) =>
          points.find((point) => point.slug === slug),
        )
        .filter(Boolean) as MapPoint[],
    [highlight, points],
  );

  const fromPoint =
    points.find((point) => point.slug === fromSlug) ?? null;

  const toPoint =
    points.find((point) => point.slug === toSlug) ?? null;

  const custom =
    !!fromPoint &&
    !!toPoint &&
    fromSlug !== toSlug;

  const routePoints = useMemo(
    () =>
      custom
        ? ([fromPoint, toPoint] as MapPoint[])
        : itineraryPoints,
    [custom, fromPoint, toPoint, itineraryPoints],
  );

  /*
   * ---------------------------------------------------------
   * 1. LOAD + INITIALIZE GOOGLE MAP
   * ---------------------------------------------------------
   *
   * The actual Google Map is created only once.
   * It should NOT be recreated whenever points/highlight change.
   */
  useEffect(() => {
    let cancelled = false;

    loadMaps()
      .then((google) => {
        if (cancelled || !ref.current || mapRef.current) {
          return;
        }

        const allPoints = [...points, ...nodes];

        if (!allPoints.length) {
          return;
        }

        const bounds = new google.maps.LatLngBounds();

        allPoints.forEach((point: any) => {
          bounds.extend({
            lat: point.lat,
            lng: point.lng,
          });
        });

        const map = new google.maps.Map(ref.current, {
          center: bounds.getCenter(),
          zoom: 15,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        map.fitBounds(bounds, 60);

        mapRef.current = map;
      })
      .catch((e) => {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : "Google Maps failed to load",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [points, nodes]);

  /*
   * ---------------------------------------------------------
   * 2. UPDATE MARKERS
   * ---------------------------------------------------------
   *
   * Markers can change when points/highlight/nodes change,
   * but the Google Map itself stays alive.
   */
  useEffect(() => {
    const google =
      typeof window !== "undefined"
        ? window.google
        : undefined;

    const map = mapRef.current;

    if (!google?.maps || !map) {
      return;
    }

    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });

    markersRef.current = [];

    const info = new google.maps.InfoWindow();

    points.forEach((point, index) => {
      const marker = new google.maps.Marker({
        position: {
          lat: point.lat,
          lng: point.lng,
        },

        map,

        title: point.name,

        icon: {
          url: pinSvg(
            String(index + 1),
            highlight.includes(point.slug),
          ),

          scaledSize: new google.maps.Size(44, 44),

          anchor: new google.maps.Point(22, 22),
        },
      });

      marker.addListener("click", () => {
        setSelected(point.slug);

        info.setContent(
          `<div style="font-family:Inter,Arial,sans-serif;max-width:220px">
            <strong>${point.name}</strong>
            ${point.address
            ? `<br/><span style="opacity:.7">${point.address}</span>`
            : ""
          }
            <br/>
            <a
              href="${mapsUrl(point)}"
              target="_blank"
              rel="noreferrer"
            >
              Walking directions →
            </a>
          </div>`,
        );

        info.open({
          map,
          anchor: marker,
        });
      });

      markersRef.current.push(marker);
    });

    nodes.forEach((node) => {
      const marker = new google.maps.Marker({
        position: {
          lat: node.lat,
          lng: node.lng,
        },

        map,

        title: node.name,

        icon: {
          url: nodeSvg(NODE_GLYPH[node.kind]),

          scaledSize: new google.maps.Size(34, 34),

          anchor: new google.maps.Point(17, 17),
        },
      });

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });

      markersRef.current = [];
    };
  }, [points, nodes, highlight]);

  /*
   * ---------------------------------------------------------
   * 3. DIRECTIONS
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const google =
      typeof window !== "undefined"
        ? window.google
        : undefined;

    const map = mapRef.current;

    if (!google?.maps || !map) {
      return;
    }

    if (rendererRef.current) {
      rendererRef.current.setMap(null);
      rendererRef.current = null;
    }

    setSummary(null);
    setSteps([]);

    if (routePoints.length < 2) {
      return;
    }

    let cancelled = false;

    const renderer =
      new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,

        polylineOptions: {
          strokeColor: "#ff2d78",
          strokeWeight: 5,
          strokeOpacity: 0.9,
        },
      });

    rendererRef.current = renderer;

    const service =
      new google.maps.DirectionsService();

    service.route(
      {
        origin: {
          lat: routePoints[0].lat,
          lng: routePoints[0].lng,
        },

        destination: {
          lat: routePoints[routePoints.length - 1].lat,
          lng: routePoints[routePoints.length - 1].lng,
        },

        waypoints: routePoints
          .slice(1, -1)
          .map((point) => ({
            location: {
              lat: point.lat,
              lng: point.lng,
            },
            stopover: true,
          })),

        travelMode: google.maps.TravelMode[mode],
      },

      (response: any, status: string) => {
        if (cancelled) {
          return;
        }

        /*
         * Google Directions unavailable:
         * fall back to straight-line estimate.
         */
        if (
          status !== "OK" ||
          !response
        ) {
          const path =
            new google.maps.Polyline({
              map,

              path: routePoints.map(
                (point) => ({
                  lat: point.lat,
                  lng: point.lng,
                }),
              ),

              strokeColor: "#ff2d78",
              strokeWeight: 4,
              strokeOpacity: 0.9,
            });

          rendererRef.current = path;

          let km = 0;

          for (
            let i = 1;
            i < routePoints.length;
            i++
          ) {
            const distance =
              google.maps.geometry?.spherical?.computeDistanceBetween?.(
                new google.maps.LatLng(
                  routePoints[i - 1].lat,
                  routePoints[i - 1].lng,
                ),
                new google.maps.LatLng(
                  routePoints[i].lat,
                  routePoints[i].lng,
                ),
              );

            km += (distance || 0) / 1000;
          }

          const speed =
            mode === "WALKING" ? 4.8 : 22;

          setSummary({
            km: km * 1.3,
            min: Math.max(
              1,
              Math.round(
                ((km * 1.3) / speed) * 60,
              ),
            ),
          });

          return;
        }

        renderer.setDirections(response);

        const legs =
          response.routes[0].legs ?? [];

        const meters = legs.reduce(
          (total: number, leg: any) =>
            total + (leg.distance?.value ?? 0),
          0,
        );

        const seconds = legs.reduce(
          (total: number, leg: any) =>
            total + (leg.duration?.value ?? 0),
          0,
        );

        setSummary({
          km: meters / 1000,
          min: Math.max(
            1,
            Math.round(seconds / 60),
          ),
        });

        setSteps(
          legs
            .flatMap(
              (leg: any) => leg.steps ?? [],
            )
            .map((step: any) => ({
              text: String(
                step.instructions ?? "",
              )
                .replace(/<[^>]+>/g, " ")
                .replace(/\s+/g, " ")
                .trim(),

              dist:
                step.distance?.text ?? "",
            }))
            .slice(0, 12),
        );
      },
    );

    return () => {
      cancelled = true;

      if (rendererRef.current) {
        rendererRef.current.setMap(null);
        rendererRef.current = null;
      }
    };
  }, [routePoints, mode]);

  /*
   * ---------------------------------------------------------
   * 4. RENDER
   * ---------------------------------------------------------
   */

  return (
    <div className="border-[3px] border-black bg-background">
      {error ? (
        <div className="p-6">
          <p className="headline text-sm text-muted-foreground">
            Map unavailable: {error}
          </p>
        </div>
      ) : (
        <div
          ref={ref}
          role="application"
          aria-label={ariaLabel}
          className="w-full h-[420px] md:h-[560px]"
        />
      )}

      <div className="rule-t grid grid-cols-1 md:grid-cols-2">
        <ul className="md:border-r-[3px] md:border-black">
          {points.map((point, index) => {
            const active = highlight.includes(
              point.slug,
            );

            return (
              <li
                key={point.slug}
                onClick={() => {
                  setSelected(point.slug);

                  mapRef.current?.panTo({
                    lat: point.lat,
                    lng: point.lng,
                  });

                  mapRef.current?.setZoom(17);
                }}
                className={`flex items-center gap-3 px-4 py-3 rule-b cursor-pointer ${selected === point.slug
                    ? "bg-muted/40"
                    : ""
                  }`}
              >
                <span
                  className={`label w-7 h-7 grid place-items-center border-[3px] border-black shrink-0 ${active ? "bg-accent" : ""
                    }`}
                >
                  {index + 1}
                </span>

                <span className="headline text-sm md:text-base">
                  {point.name}
                </span>

                <a
                  href={mapsUrl(point)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                  className="label ml-auto notch hover:text-accent whitespace-nowrap"
                >
                  Directions →
                </a>
              </li>
            );
          })}
        </ul>

        <div className="px-4 py-4 space-y-3">
          <p className="label">
            Get directions
          </p>

          <div className="grid grid-cols-1 gap-2">
            <select
              value={fromSlug}
              onChange={(event) =>
                setFromSlug(event.target.value)
              }
              aria-label="From venue"
              className="headline text-sm border-[3px] border-black bg-background px-3 py-2"
            >
              <option value="">
                From…
              </option>

              {points.map((point) => (
                <option
                  key={point.slug}
                  value={point.slug}
                >
                  {point.name}
                </option>
              ))}
            </select>

            <select
              value={toSlug}
              onChange={(event) =>
                setToSlug(event.target.value)
              }
              aria-label="To venue"
              className="headline text-sm border-[3px] border-black bg-background px-3 py-2"
            >
              <option value="">
                To…
              </option>

              {points.map((point) => (
                <option
                  key={point.slug}
                  value={point.slug}
                >
                  {point.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              {(
                [
                  "WALKING",
                  "DRIVING",
                  "TRANSIT",
                ] as const
              ).map((travelMode) => (
                <button
                  key={travelMode}
                  type="button"
                  onClick={() =>
                    setMode(travelMode)
                  }
                  className={`label notch border-[3px] border-black px-3 py-2 ${mode === travelMode
                      ? "bg-foreground text-background"
                      : "hover:bg-muted"
                    }`}
                >
                  {travelMode === "WALKING"
                    ? "Walk"
                    : travelMode === "DRIVING"
                      ? "Drive"
                      : "Transit"}
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

          <p className="label pt-2">
            {custom
              ? "Your route"
              : "Route on your itinerary"}
          </p>

          {routePoints.length > 1 ? (
            <>
              <p className="headline text-sm text-muted-foreground">
                {routePoints
                  .map((point) => point.short)
                  .join(" → ")}
              </p>

              <p className="display text-2xl">
                {summary
                  ? `${summary.km.toFixed(
                    1,
                  )} km · about ${summary.min
                  } min ${mode === "WALKING"
                    ? "on foot"
                    : mode === "DRIVING"
                      ? "by car"
                      : "by transit"
                  }`
                  : "Calculating route…"}
              </p>

              {steps.length > 0 && (
                <ol className="space-y-1 max-h-52 overflow-auto pr-1">
                  {steps.map(
                    (step, index) => (
                      <li
                        key={`${index}-${step.text}`}
                        className="headline text-xs text-muted-foreground flex gap-2"
                      >
                        <span className="label shrink-0">
                          {index + 1}
                        </span>

                        <span>
                          {step.text}{" "}
                          {step.dist && (
                            <span className="opacity-60">
                              ({step.dist})
                            </span>
                          )}
                        </span>
                      </li>
                    ),
                  )}
                </ol>
              )}

              <a
                href={(() => {
                  const first =
                    routePoints[0];

                  const last =
                    routePoints[
                    routePoints.length - 1
                    ];

                  const middle =
                    routePoints.slice(1, -1);

                  const params =
                    new URLSearchParams({
                      api: "1",
                      origin: `${first.lat},${first.lng}`,
                      destination: `${last.lat},${last.lng}`,
                      travelmode:
                        mode.toLowerCase(),
                    });

                  if (
                    "placeId" in first &&
                    first.placeId
                  ) {
                    params.set(
                      "origin_place_id",
                      first.placeId,
                    );
                  }

                  if (
                    "placeId" in last &&
                    last.placeId
                  ) {
                    params.set(
                      "destination_place_id",
                      last.placeId,
                    );
                  }

                  if (middle.length) {
                    params.set(
                      "waypoints",
                      middle
                        .map(
                          (point) =>
                            `${point.lat},${point.lng}`,
                        )
                        .join("|"),
                    );
                  }

                  return `https://www.google.com/maps/dir/?${params.toString()}`;
                })()}
                target="_blank"
                rel="noreferrer"
                className="inline-block label notch bg-foreground text-background px-5 py-3 hover:bg-accent"
              >
                Open in Google Maps →
              </a>
            </>
          ) : (
            <p className="headline text-sm text-muted-foreground">
              Pick a start and an end venue
              above, or add two or more
              sessions to your itinerary.
            </p>
          )}
        </div>
      </div>

      {caption && (
        <p className="label text-muted-foreground px-4 py-3 rule-t">
          {caption}
        </p>
      )}
    </div>
  );
}
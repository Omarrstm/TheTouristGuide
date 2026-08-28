"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapPlace = {
  id: string;
  name: string;
  city: string;
  countryName: string;
  isHiddenGem: boolean;
  latitude: number;
  longitude: number;
};

const ACCENT = "#b8532f"; // mirrors --color-accent in globals.css
const ACCENT_TEAL = "#3f5d43"; // mirrors --color-accent-teal in globals.css

export default function PlaceMap({ places }: { places: MapPlace[] }) {
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    import("leaflet")
      .then((L) => {
        if (cancelled || !containerRef.current) return;

        const map = L.map(containerRef.current);
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        if (places.length === 0) {
          map.setView([20, 0], 2);
        } else if (places.length === 1) {
          map.setView([places[0].latitude, places[0].longitude], 13);
        } else {
          map.fitBounds(
            L.latLngBounds(places.map((p) => [p.latitude, p.longitude] as [number, number])),
            { padding: [24, 24] }
          );
        }

        const markerIcon = (color: string) =>
          L.divIcon({
            className: "",
            html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="7" fill="${color}" stroke="#f7f1e6" stroke-width="2"/></svg>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

        places.forEach((place) => {
          const marker = L.marker([place.latitude, place.longitude], {
            icon: markerIcon(place.isHiddenGem ? ACCENT_TEAL : ACCENT),
          }).addTo(map);

          const content = document.createElement("div");
          content.className = "flex flex-col gap-1 p-1";

          const title = document.createElement("p");
          title.className = "text-[13.5px] font-semibold text-text";
          title.textContent = place.name;
          content.appendChild(title);

          const subtitle = document.createElement("p");
          subtitle.className = "text-[12px] text-muted";
          subtitle.textContent = `${place.city}, ${place.countryName}`;
          content.appendChild(subtitle);

          const link = document.createElement("a");
          link.href = `/places/${place.id}`;
          link.textContent = "View place →";
          link.className = "mt-1 text-[12px] font-semibold text-accent";
          content.appendChild(link);

          marker.bindPopup(content);
        });

        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable");
      });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "unavailable") {
    return (
      <p className="text-[12px] text-muted">
        The map isn&rsquo;t available right now &mdash; browse places using the grid below.
      </p>
    );
  }

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-[4px] border border-border">
      <div ref={containerRef} className="h-full w-full" />
      {status === "loading" && <div className="absolute inset-0 animate-pulse bg-surface-2" />}
    </div>
  );
}

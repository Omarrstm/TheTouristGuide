"use client";

import { useEffect, useRef, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

export type MapPlace = {
  id: string;
  name: string;
  city: string;
  countryName: string;
  isHiddenGem: boolean;
  latitude: number;
  longitude: number;
};

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const ACCENT = "#e8734a"; // mirrors --color-accent in globals.css
const ACCENT_TEAL = "#2fb8a6"; // mirrors --color-accent-teal in globals.css

const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1f1913" }] }, // --color-surface
  { elementType: "labels.text.fill", stylers: [{ color: "#a69b8d" }] }, // --color-muted
  { elementType: "labels.text.stroke", stylers: [{ color: "#171310" }] }, // --color-bg
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#171310" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#29211a" }] }, // --color-surface-2
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

let optionsSet = false;
let mapsLibraryPromise: Promise<google.maps.MapsLibrary> | null = null;
function loadMapsLibrary(): Promise<google.maps.MapsLibrary> {
  if (!mapsLibraryPromise) {
    if (!optionsSet) {
      setOptions({ key: API_KEY!, v: "weekly" });
      optionsSet = true;
    }
    mapsLibraryPromise = importLibrary("maps");
  }
  return mapsLibraryPromise;
}

function markerIcon(color: string): google.maps.Icon {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="7" fill="${color}" stroke="#171310" stroke-width="2"/></svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(20, 20),
    anchor: new google.maps.Point(10, 10),
  };
}

export default function PlaceMap({ places }: { places: MapPlace[] }) {
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">(
    API_KEY ? "loading" : "unavailable"
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!API_KEY || !containerRef.current) return;

    let cancelled = false;

    loadMapsLibrary()
      .then((maps) => {
        if (cancelled || !containerRef.current) return;

        const map = new maps.Map(containerRef.current, {
          styles: DARK_MAP_STYLES,
          clickableIcons: false,
        });
        mapRef.current = map;

        if (places.length === 0) {
          map.setCenter({ lat: 20, lng: 0 });
          map.setZoom(2);
        } else if (places.length === 1) {
          map.setCenter({ lat: places[0].latitude, lng: places[0].longitude });
          map.setZoom(13);
        } else {
          const bounds = new google.maps.LatLngBounds();
          places.forEach((p) => bounds.extend({ lat: p.latitude, lng: p.longitude }));
          map.fitBounds(bounds);
        }

        const infoWindow = new google.maps.InfoWindow();

        markersRef.current = places.map((place) => {
          const marker = new google.maps.Marker({
            map,
            position: { lat: place.latitude, lng: place.longitude },
            title: place.name,
            icon: markerIcon(place.isHiddenGem ? ACCENT_TEAL : ACCENT),
          });

          marker.addListener("click", () => {
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

            infoWindow.setContent(content);
            infoWindow.open({ map, anchor: marker });
          });

          return marker;
        });

        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable");
      });

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
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
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-border">
      <div ref={containerRef} className="h-full w-full" />
      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-surface-2" />
      )}
    </div>
  );
}

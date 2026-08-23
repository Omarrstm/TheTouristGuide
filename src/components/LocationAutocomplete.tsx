"use client";

import { useEffect, useRef, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

export type PickedLocation = {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  googlePlaceId: string;
};

type Suggestion = {
  placeId: string;
  label: string;
  prediction: google.maps.places.PlacePrediction;
};

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

let optionsSet = false;
let placesLibraryPromise: Promise<google.maps.PlacesLibrary> | null = null;
function loadPlacesLibrary(): Promise<google.maps.PlacesLibrary> {
  if (!placesLibraryPromise) {
    if (!optionsSet) {
      setOptions({ key: API_KEY!, v: "weekly" });
      optionsSet = true;
    }
    placesLibraryPromise = importLibrary("places");
  }
  return placesLibraryPromise;
}

export default function LocationAutocomplete({
  onSelect,
  onClear,
  initialLabel = null,
}: {
  onSelect: (location: PickedLocation) => void;
  onClear?: () => void;
  initialLabel?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [focused, setFocused] = useState(false);
  const [picked, setPicked] = useState<string | null>(initialLabel);
  const [unavailable, setUnavailable] = useState(!API_KEY);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    if (!API_KEY) return;
    loadPlacesLibrary().catch(() => setUnavailable(true));
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setPicked(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const places = await loadPlacesLibrary();
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new places.AutocompleteSessionToken();
        }
        const { suggestions: results } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: value,
          sessionToken: sessionTokenRef.current,
        });
        setSuggestions(
          (results ?? [])
            .filter((r) => r.placePrediction)
            .map((r) => ({
              placeId: r.placePrediction!.placeId,
              label: r.placePrediction!.text.text,
              prediction: r.placePrediction!,
            }))
        );
      } catch {
        setUnavailable(true);
      }
    }, 300);
  }

  async function handlePick(suggestion: Suggestion) {
    try {
      const place = suggestion.prediction.toPlace();
      await place.fetchFields({ fields: ["formattedAddress", "location"] });
      if (!place.location) return;
      onSelect({
        latitude: place.location.lat(),
        longitude: place.location.lng(),
        formattedAddress: place.formattedAddress ?? suggestion.label,
        googlePlaceId: suggestion.placeId,
      });
      setPicked(place.formattedAddress ?? suggestion.label);
      setQuery("");
      setSuggestions([]);
      setFocused(false);
      sessionTokenRef.current = null;
    } catch {
      setUnavailable(true);
    }
  }

  function handleClearPicked() {
    setPicked(null);
    onClear?.();
  }

  if (unavailable) {
    return picked ? (
      <p className="text-[13px] text-text">{picked}</p>
    ) : (
      <p className="text-[12px] text-muted">
        Location search isn&rsquo;t available right now &mdash; you can still submit this place
        without pinning it on the map.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {picked ? (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2.5">
          <span className="text-[13px] text-text">{picked}</span>
          <button
            type="button"
            onClick={handleClearPicked}
            className="text-[11px] font-semibold text-muted hover:text-accent"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 120)}
            placeholder="Search for an address..."
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none placeholder:text-muted focus-visible:border-accent"
          />
          {focused && suggestions.length > 0 && (
            <ul className="card-shine absolute top-full z-10 mt-2 w-full overflow-hidden rounded-lg">
              {suggestions.map((s) => (
                <li key={s.placeId}>
                  <button
                    type="button"
                    onMouseDown={() => handlePick(s)}
                    className="w-full px-3 py-2.5 text-left text-[13.5px] text-text hover:bg-surface-2"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

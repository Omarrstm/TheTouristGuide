"use client";

import { useRef, useState } from "react";

export type PickedLocation = {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  googlePlaceId: string;
};

type Suggestion = {
  osmId: string;
  label: string;
  lat: number;
  lon: number;
};

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(value)}`
        );
        if (!res.ok) throw new Error("search failed");
        const results: NominatimResult[] = await res.json();
        setSuggestions(
          results.map((r) => ({
            osmId: String(r.place_id),
            label: r.display_name,
            lat: parseFloat(r.lat),
            lon: parseFloat(r.lon),
          }))
        );
      } catch {
        setSuggestions([]);
      }
    }, 500);
  }

  function handlePick(suggestion: Suggestion) {
    onSelect({
      latitude: suggestion.lat,
      longitude: suggestion.lon,
      formattedAddress: suggestion.label,
      googlePlaceId: suggestion.osmId,
    });
    setPicked(suggestion.label);
    setQuery("");
    setSuggestions([]);
    setFocused(false);
  }

  function handleClearPicked() {
    setPicked(null);
    onClear?.();
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
                <li key={s.osmId}>
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

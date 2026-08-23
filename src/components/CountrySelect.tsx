"use client";

import { useMemo, useState } from "react";

type Country = { id: string; name: string };

export default function CountrySelect({
  countries,
  value,
  onChange,
}: {
  countries: Country[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return countries;
    const matches = countries.filter((c) => c.name.toLowerCase().includes(q));
    const selected = countries.find((c) => c.id === value);
    if (selected && !matches.some((c) => c.id === selected.id)) {
      return [selected, ...matches];
    }
    return matches;
  }, [countries, filter, value]);

  return (
    <div className="flex flex-col gap-1.5">
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter countries..."
        className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-[12.5px] text-text outline-none placeholder:text-muted focus-visible:border-accent"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none focus-visible:border-accent"
      >
        <option value="" disabled>
          Select a country
        </option>
        {filtered.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

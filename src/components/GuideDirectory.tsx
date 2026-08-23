"use client";

import { useMemo, useState } from "react";
import GuideCard, { type GuideCardData } from "@/components/GuideCard";
import { delayClass } from "@/lib/animationDelay";

export default function GuideDirectory({ guides }: { guides: GuideCardData[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return guides;
    return guides.filter(
      (g) =>
        g.city.toLowerCase().includes(q) ||
        (g.countryName ?? "").toLowerCase().includes(q) ||
        (g.name ?? "").toLowerCase().includes(q)
    );
  }, [guides, query]);

  return (
    <div className="flex flex-col gap-5">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter by city, country, or name"
        className="w-full max-w-md rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-[14px] text-text outline-none placeholder:text-muted focus-visible:border-accent"
      />
      {filtered.length === 0 ? (
        <p className="text-[13.5px] text-muted">No guides match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g, i) => (
            <GuideCard key={g.userId} guide={g} className={`fade-slide-up ${delayClass(i)}`} />
          ))}
        </div>
      )}
    </div>
  );
}

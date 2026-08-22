"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CountryOption = { name: string; slug: string };

export default function CountrySearch({ countries }: { countries: CountryOption[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return countries.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [countries, query]);

  function goTo(slug: string) {
    setQuery("");
    setFocused(false);
    router.push(`/countries/${slug}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (matches.length > 0) goTo(matches[0].slug);
  }

  return (
    <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
        placeholder="Where are you headed? (e.g. Japan, Peru, Kenya...)"
        className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-[15px] text-text outline-none placeholder:text-muted focus-visible:border-accent"
      />
      {focused && matches.length > 0 && (
        <ul className="card-shine absolute top-full mt-2 w-full overflow-hidden rounded-xl">
          {matches.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                onMouseDown={() => goTo(c.slug)}
                className="w-full px-4 py-2.5 text-left text-[14px] text-text hover:bg-surface-2"
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

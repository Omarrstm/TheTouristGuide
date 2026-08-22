"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertGuideProfile } from "@/app/guide/actions";

type Country = { id: string; name: string };

type Initial = {
  bio: string;
  languages: string;
  city: string;
  countryId: string;
  isPublic: boolean;
};

export default function GuideProfileForm({
  countries,
  initial,
}: {
  countries: Country[];
  initial: Initial | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [languages, setLanguages] = useState(initial?.languages ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [countryId, setCountryId] = useState(initial?.countryId ?? "");
  const [isPublic, setIsPublic] = useState(initial?.isPublic ?? true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    startTransition(async () => {
      try {
        await upsertGuideProfile({ bio, languages, city, countryId, isPublic });
        setStatus("Saved.");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't save your guide profile.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card-shine flex flex-col gap-4 rounded-2xl p-6">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
            Country
          </span>
          <select
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
            required
            className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none focus-visible:border-accent"
          >
            <option value="" disabled>
              Select a country
            </option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
            City
          </span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none focus-visible:border-accent"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
          Languages (comma-separated)
        </span>
        <input
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
          placeholder="English, Spanish, French"
          className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none placeholder:text-muted focus-visible:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">Bio</span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Tell travelers about yourself and what you can show them."
          className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none placeholder:text-muted focus-visible:border-accent"
        />
      </label>

      <label className="flex items-center gap-2 text-[13px] text-muted">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        Show my profile in the guide directory
      </label>

      {error && <p className="text-[12px] text-red-400">{error}</p>}
      {status && <p className="text-[12px] text-accent">{status}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-accent py-2.5 text-center text-[13px] font-bold tracking-wide text-bg uppercase disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Guide Profile"}
      </button>
    </form>
  );
}

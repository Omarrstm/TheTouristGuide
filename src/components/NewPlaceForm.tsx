"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPlace, updatePlace } from "@/app/actions";
import LocationAutocomplete, { type PickedLocation } from "@/components/LocationAutocomplete";
import CountrySelect from "@/components/CountrySelect";

type Country = { id: string; name: string; slug: string };

type CostTier = "BUDGET" | "MODERATE" | "EXPENSIVE";

type EditingPlace = {
  id: string;
  name: string;
  countryId: string;
  city: string;
  description: string;
  isHiddenGem: boolean;
  costTier: CostTier | null;
  location: PickedLocation | null;
};

export default function NewPlaceForm({
  countries,
  preselectedSlug,
  editing = null,
}: {
  countries: Country[];
  preselectedSlug?: string | null;
  editing?: EditingPlace | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(editing?.name ?? "");
  const [countryId, setCountryId] = useState(
    editing?.countryId ?? countries.find((c) => c.slug === preselectedSlug)?.id ?? ""
  );
  const [city, setCity] = useState(editing?.city ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [isHiddenGem, setIsHiddenGem] = useState(editing?.isHiddenGem ?? false);
  const [costTier, setCostTier] = useState<CostTier | null>(editing?.costTier ?? null);
  const [location, setLocation] = useState<PickedLocation | null>(editing?.location ?? null);
  const filesRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const photos = filesRef.current?.files ? Array.from(filesRef.current.files) : [];
    startTransition(async () => {
      try {
        const { id } = editing
          ? await updatePlace({
              placeId: editing.id,
              name,
              countryId,
              city,
              description,
              isHiddenGem,
              costTier,
              photos,
              location,
            })
          : await createPlace({
              name,
              countryId,
              city,
              description,
              isHiddenGem,
              costTier,
              photos,
              location,
            });
        router.push(`/places/${id}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't submit this place.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card-shine fade-slide-up delay-1 flex flex-col gap-4 rounded-2xl p-6">
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none focus-visible:border-accent"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
            Country
          </span>
          <CountrySelect countries={countries} value={countryId} onChange={setCountryId} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">City</span>
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
          Description
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          minLength={10}
          placeholder="What makes it worth visiting?"
          className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none placeholder:text-muted focus-visible:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
          Exact Location (optional)
        </span>
        <LocationAutocomplete
          onSelect={setLocation}
          onClear={() => setLocation(null)}
          initialLabel={editing?.location?.formattedAddress ?? null}
        />
      </label>

      <button
        type="button"
        onClick={() => setIsHiddenGem((v) => !v)}
        className={`w-fit rounded-full border px-3.5 py-1.5 text-[11.5px] font-semibold tracking-wide uppercase ${
          isHiddenGem
            ? "border-accent-teal bg-accent-teal-soft text-accent-teal"
            : "border-border bg-surface-2 text-muted"
        }`}
      >
        {isHiddenGem ? "Marked as a hidden gem" : "This is a popular attraction"}
      </button>

      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
          Cost (optional)
        </span>
        <div className="flex gap-2">
          {(
            [
              ["BUDGET", "$"],
              ["MODERATE", "$$"],
              ["EXPENSIVE", "$$$"],
            ] as [CostTier, string][]
          ).map(([tier, label]) => (
            <button
              key={tier}
              type="button"
              onClick={() => setCostTier((v) => (v === tier ? null : tier))}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-bold ${
                costTier === tier
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border bg-surface-2 text-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
          {editing ? "Add More Photos (optional, up to 5)" : "Photos (up to 5)"}
        </span>
        <input
          ref={filesRef}
          type="file"
          accept="image/*"
          multiple
          className="text-[12px] text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-text"
        />
      </label>

      {error && <p className="text-[12px] text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full rounded-[4px] text-center"
      >
        {isPending ? (editing ? "Saving..." : "Submitting...") : editing ? "Save Changes" : "Submit Place"}
      </button>
    </form>
  );
}

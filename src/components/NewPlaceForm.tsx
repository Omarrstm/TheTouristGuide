"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPlace } from "@/app/actions";

type Country = { id: string; name: string; slug: string };

export default function NewPlaceForm({
  countries,
  preselectedSlug,
}: {
  countries: Country[];
  preselectedSlug: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState(
    countries.find((c) => c.slug === preselectedSlug)?.id ?? ""
  );
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [isHiddenGem, setIsHiddenGem] = useState(false);
  const filesRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const photos = filesRef.current?.files ? Array.from(filesRef.current.files) : [];
    startTransition(async () => {
      try {
        const { id } = await createPlace({ name, countryId, city, description, isHiddenGem, photos });
        router.push(`/places/${id}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't submit this place.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card-shine flex flex-col gap-4 rounded-2xl p-6">
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

      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
          Photos (up to 5)
        </span>
        <input
          ref={filesRef}
          type="file"
          accept="image/*"
          multiple
          className="text-[12px] text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-text"
        />
      </label>

      {error && <p className="text-[12px] text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-accent py-2.5 text-center text-[13px] font-bold tracking-wide text-bg uppercase disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Submit Place"}
      </button>
    </form>
  );
}

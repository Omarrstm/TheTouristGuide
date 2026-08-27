"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createItinerary } from "@/app/trips/actions";

export default function NewTripForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const { id } = await createItinerary({ name });
        router.push(`/trips/${id}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't create this trip.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex flex-1 flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
          New Trip
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Japan 2026"
          required
          className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none placeholder:text-muted focus-visible:border-accent"
        />
      </label>
      <button type="submit" disabled={isPending} className="btn-primary rounded-[4px] sm:w-fit">
        {isPending ? "Creating..." : "Create Trip"}
      </button>
      {error && <p className="text-[12px] text-red-600">{error}</p>}
    </form>
  );
}

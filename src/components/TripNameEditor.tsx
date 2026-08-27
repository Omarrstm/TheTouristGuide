"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { renameItinerary } from "@/app/trips/actions";

export default function TripNameEditor({
  itineraryId,
  name,
}: {
  itineraryId: string;
  name: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await renameItinerary({ itineraryId, name: value });
        setEditing(false);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't rename this trip.");
      }
    });
  }

  if (!editing) {
    return (
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-[36px] leading-none tracking-wide text-text uppercase">
          {name}
        </h1>
        <button
          type="button"
          onClick={() => {
            setValue(name);
            setEditing(true);
          }}
          className="text-[12px] font-semibold text-muted underline-offset-2 hover:text-accent hover:underline"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-[20px] text-text outline-none focus-visible:border-accent"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="btn-primary rounded-[4px]"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-[12px] font-semibold text-muted hover:text-text"
        >
          Cancel
        </button>
        {error && <span className="text-[12px] text-red-600">{error}</span>}
      </div>
    </div>
  );
}

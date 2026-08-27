"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removePlaceFromItinerary } from "@/app/trips/actions";

export default function RemoveFromTripButton({
  itineraryId,
  placeId,
}: {
  itineraryId: string;
  placeId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleRemove() {
    setError(null);
    startTransition(async () => {
      try {
        await removePlaceFromItinerary({ itineraryId, placeId });
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't remove this place.");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleRemove}
        disabled={isPending}
        className="text-[12px] font-semibold text-muted hover:text-red-600 disabled:opacity-50"
      >
        {isPending ? "Removing..." : "Remove from trip"}
      </button>
      {error && <span className="text-[12px] text-red-600">{error}</span>}
    </div>
  );
}

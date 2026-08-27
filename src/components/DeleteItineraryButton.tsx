"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteItinerary } from "@/app/trips/actions";

export default function DeleteItineraryButton({ itineraryId }: { itineraryId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      resetRef.current = setTimeout(() => setConfirming(false), 3000);
      return;
    }
    if (resetRef.current) clearTimeout(resetRef.current);
    setError(null);
    startTransition(async () => {
      try {
        await deleteItinerary(itineraryId);
        router.push("/trips");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't delete this trip.");
        setConfirming(false);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className={`text-[12px] font-semibold underline-offset-2 hover:underline disabled:opacity-50 ${
          confirming ? "text-red-600" : "text-muted hover:text-red-600"
        }`}
      >
        {isPending ? "Deleting..." : confirming ? "Confirm delete?" : "Delete Trip"}
      </button>
      {error && <span className="text-[12px] text-red-600">{error}</span>}
    </div>
  );
}

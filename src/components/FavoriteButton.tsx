"use client";

import { useState, useTransition } from "react";
import { toggleFavorite } from "@/app/favorites/actions";

export default function FavoriteButton({
  placeId,
  initialFavorited,
}: {
  placeId: string;
  initialFavorited: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await toggleFavorite(placeId);
        setFavorited(result.favorited);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't update favorites.");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`rounded-full border px-4 py-2 text-[12px] font-bold tracking-wide uppercase disabled:opacity-50 ${
          favorited
            ? "border-accent bg-accent-soft text-accent"
            : "border-border bg-surface-2 text-text hover:border-accent hover:text-accent"
        }`}
      >
        {favorited ? "♥ Saved" : "♡ Save"}
      </button>
      {error && <span className="text-[12px] text-red-600">{error}</span>}
    </div>
  );
}

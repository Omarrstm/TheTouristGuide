"use client";

import { useState, useTransition } from "react";
import { toggleFollow } from "@/app/follows/actions";

export default function FollowButton({
  userId,
  initialFollowing,
}: {
  userId: string;
  initialFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await toggleFollow(userId);
        setFollowing(result.following);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't update follow status.");
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
          following
            ? "border-accent bg-accent-soft text-accent"
            : "border-border bg-surface-2 text-text hover:border-accent hover:text-accent"
        }`}
      >
        {following ? "Following" : "Follow"}
      </button>
      {error && <span className="text-[12px] text-red-600">{error}</span>}
    </div>
  );
}

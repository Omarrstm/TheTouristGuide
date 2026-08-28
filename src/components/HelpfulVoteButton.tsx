"use client";

import { useState, useTransition } from "react";
import { toggleHelpfulVote } from "@/app/actions";

export default function HelpfulVoteButton({
  reviewId,
  initialVoted,
  initialCount,
}: {
  reviewId: string;
  initialVoted: boolean;
  initialCount: number;
}) {
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await toggleHelpfulVote(reviewId);
        setVoted(result.voted);
        setCount(result.count);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't record your vote.");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`text-[12px] font-semibold underline-offset-2 hover:underline disabled:opacity-50 ${
          voted ? "text-accent" : "text-muted hover:text-accent"
        }`}
      >
        {voted ? "✓ Helpful" : "Helpful"}
        {count > 0 && <span className="ml-1 font-normal">({count})</span>}
      </button>
      {error && <span className="text-[12px] text-red-600">{error}</span>}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { rateGuide } from "@/app/guides/actions";
import StarRatingInput from "@/components/StarRatingInput";

export default function GuideRatingForm({ guideUserId }: { guideUserId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await rateGuide({ guideUserId, rating, comment });
        setComment("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't submit your rating.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card-shine flex flex-col gap-3 rounded-xl p-4">
      <p className="text-[13px] font-semibold text-text">Rate this guide</p>
      <StarRatingInput value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How was your experience with this guide?"
        rows={3}
        className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none placeholder:text-muted focus-visible:border-accent"
      />
      {error && <p className="text-[12px] text-red-600">{error}</p>}
      <button type="submit" disabled={isPending} className="btn-primary w-fit rounded-[4px]">
        {isPending ? "Posting..." : "Post Rating"}
      </button>
    </form>
  );
}

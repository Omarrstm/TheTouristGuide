"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createReview } from "@/app/actions";
import StarRatingInput from "@/components/StarRatingInput";

export default function ReviewForm({ placeId }: { placeId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const photo = fileRef.current?.files?.[0] ?? null;
    startTransition(async () => {
      try {
        await createReview({ placeId, rating, comment, photo });
        setComment("");
        if (fileRef.current) fileRef.current.value = "";
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't submit your review.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card-shine flex flex-col gap-3 rounded-xl p-4">
      <p className="text-[13px] font-semibold text-text">Leave a review</p>
      <StarRatingInput value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What was it like?"
        rows={3}
        className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none placeholder:text-muted focus-visible:border-accent"
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="text-[12px] text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-text"
      />
      {error && <p className="text-[12px] text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-lg bg-accent px-4 py-2 text-[12px] font-bold tracking-wide text-bg uppercase disabled:opacity-50"
      >
        {isPending ? "Posting..." : "Post Review"}
      </button>
    </form>
  );
}

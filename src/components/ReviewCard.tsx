"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { deleteReview, updateReview } from "@/app/actions";
import StarRatingInput from "@/components/StarRatingInput";

export type ReviewData = {
  id: string;
  rating: number;
  comment: string | null;
  photoUrl: string | null;
  createdAt: string;
  userId: string;
  userName: string | null;
};

export default function ReviewCard({
  review,
  currentUserId,
}: {
  review: ReviewData;
  currentUserId: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment ?? "");
  const [error, setError] = useState<string | null>(null);

  const isOwner = currentUserId !== null && currentUserId === review.userId;
  const dateLabel = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await updateReview({ reviewId: review.id, rating, comment });
        setEditing(false);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't save changes.");
      }
    });
  }

  function handleDelete() {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    startTransition(async () => {
      await deleteReview(review.id);
      router.refresh();
    });
  }

  if (editing) {
    return (
      <div className="rounded-xl border border-border bg-surface-2 p-4">
        <p className="text-[12px] text-muted">{dateLabel}</p>
        <div className="mt-2">
          <StarRatingInput value={rating} onChange={setRating} />
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-[14px] text-text outline-none focus-visible:border-accent"
        />
        {error && <p className="mt-2 text-[12px] text-red-400">{error}</p>}
        <div className="mt-2.5 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-lg bg-accent px-3.5 py-1.5 text-[12px] font-bold text-bg uppercase disabled:opacity-50"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="text-[12px] font-semibold text-muted hover:text-text"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
        <div>
          <p className="text-[13.5px] font-semibold text-text">{review.userName ?? "Traveler"}</p>
          <p className="text-[11.5px] text-muted">{dateLabel}</p>
        </div>
        <p className="text-[13px] font-semibold text-accent">
          {"★".repeat(review.rating)}
          <span className="text-border">{"★".repeat(5 - review.rating)}</span>
        </p>
      </div>
      {review.comment && (
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{review.comment}</p>
      )}
      {review.photoUrl && (
        <div className="relative mt-3 h-40 w-full max-w-xs overflow-hidden rounded-lg">
          <Image src={review.photoUrl} alt="" fill sizes="320px" className="object-cover" />
        </div>
      )}
      {isOwner && (
        <div className="mt-2.5 flex items-center gap-3">
          <button
            onClick={() => setEditing(true)}
            className="text-[12px] font-semibold text-muted underline-offset-2 hover:text-accent hover:underline"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            onBlur={() => setConfirmingDelete(false)}
            disabled={isPending}
            className={`text-[12px] font-semibold underline-offset-2 hover:underline disabled:opacity-50 ${
              confirmingDelete ? "text-red-400" : "text-muted hover:text-red-400"
            }`}
          >
            {confirmingDelete ? "Confirm?" : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}

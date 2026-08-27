"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type ReviewPhoto = {
  url: string;
  reviewerName: string | null;
};

export default function ReviewPhotoGallery({ photos }: { photos: ReviewPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isOpen = openIndex !== null;

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft")
        setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, photos.length]);

  if (photos.length === 0) return null;

  const active = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((photo, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-square overflow-hidden rounded-[4px] border border-border"
          >
            <Image
              src={photo.url}
              alt={photo.reviewerName ? `Photo by ${photo.reviewerName}` : "Traveler photo"}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-opacity hover:opacity-90"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="page-fade fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/85 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            className="absolute top-4 right-4 text-[13px] font-semibold tracking-wide text-white/80 uppercase hover:text-white"
          >
            Close &#10005;
          </button>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
              }}
              className="absolute left-2 text-[28px] text-white/70 hover:text-white sm:left-6"
              aria-label="Previous photo"
            >
              &#8249;
            </button>
          )}

          <div
            className="relative h-[70vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.url}
              alt={active.reviewerName ? `Photo by ${active.reviewerName}` : "Traveler photo"}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length));
              }}
              className="absolute right-2 text-[28px] text-white/70 hover:text-white sm:right-6"
              aria-label="Next photo"
            >
              &#8250;
            </button>
          )}

          {active.reviewerName && (
            <p className="text-[12px] tracking-wide text-white/70 uppercase">
              Photo by {active.reviewerName}
            </p>
          )}
        </div>
      )}
    </>
  );
}

"use client";

export default function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          className={`text-[22px] leading-none ${n <= value ? "text-accent" : "text-border"}`}
        >
          &#9733;
        </button>
      ))}
    </div>
  );
}

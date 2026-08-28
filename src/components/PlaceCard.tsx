import Link from "next/link";
import Image from "next/image";

export type PlaceCardData = {
  id: string;
  name: string;
  city: string;
  isHiddenGem: boolean;
  costTier?: "BUDGET" | "MODERATE" | "EXPENSIVE" | null;
  photoUrl?: string | null;
  countryName?: string;
  avgRating?: number | null;
  reviewCount?: number;
};

export const COST_TIER_LABEL: Record<"BUDGET" | "MODERATE" | "EXPENSIVE", string> = {
  BUDGET: "$",
  MODERATE: "$$",
  EXPENSIVE: "$$$",
};

export default function PlaceCard({
  place,
  className = "",
}: {
  place: PlaceCardData;
  className?: string;
}) {
  return (
    <Link href={`/places/${place.id}`} prefetch={false} className={className}>
      <div className="card-shine flex h-full flex-col overflow-hidden rounded-[4px]">
        <div className="relative h-36 w-full bg-surface-2">
          {place.photoUrl ? (
            <Image
              src={place.photoUrl}
              alt={place.name}
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[12px] text-muted">
              No photo yet
            </div>
          )}
          {place.isHiddenGem && (
            <span className="absolute top-2 left-2 rounded-full border border-accent-teal bg-accent-teal-soft px-2 py-0.5 text-[10px] font-bold tracking-wide text-accent-teal uppercase">
              Hidden Gem
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3.5">
          <p className="text-[14.5px] font-semibold text-text">{place.name}</p>
          <p className="text-[12px] text-muted">
            {place.city}
            {place.countryName ? `, ${place.countryName}` : ""}
            {place.costTier && (
              <span className="ml-1.5 font-semibold text-text">
                &middot; {COST_TIER_LABEL[place.costTier]}
              </span>
            )}
          </p>
          {place.avgRating != null && (
            <p className="mt-auto pt-1 text-[12px] font-semibold text-accent">
              &#9733; {place.avgRating.toFixed(1)}{" "}
              <span className="font-normal text-muted">
                ({place.reviewCount} {place.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

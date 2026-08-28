import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PlaceCard, { type PlaceCardData } from "@/components/PlaceCard";
import { delayClass } from "@/lib/animationDelay";

export const dynamic = "force-dynamic";

function toCardData(place: {
  id: string;
  name: string;
  city: string;
  isHiddenGem: boolean;
  costTier: "BUDGET" | "MODERATE" | "EXPENSIVE" | null;
  country: { name: string };
  photos: { url: string }[];
  reviews: { rating: number }[];
}): PlaceCardData {
  const reviewCount = place.reviews.length;
  const avgRating =
    reviewCount > 0
      ? place.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : null;
  return {
    id: place.id,
    name: place.name,
    city: place.city,
    isHiddenGem: place.isHiddenGem,
    costTier: place.costTier,
    countryName: place.country.name,
    photoUrl: place.photos[0]?.url ?? null,
    avgRating,
    reviewCount,
  };
}

export default async function SharedTripPage(props: PageProps<"/trips/shared/[token]">) {
  const { token } = await props.params;

  const itinerary = await prisma.itinerary.findUnique({
    where: { shareToken: token },
    include: {
      user: { select: { name: true } },
      items: {
        orderBy: { createdAt: "desc" },
        include: {
          place: {
            include: {
              country: { select: { name: true } },
              photos: { take: 1, orderBy: { createdAt: "asc" } },
              reviews: { select: { rating: true } },
            },
          },
        },
      },
    },
  });

  if (!itinerary || !itinerary.isShared) notFound();

  return (
    <main className="flex flex-col gap-8 pt-8 pb-20">
      <div className="fade-slide-up">
        <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">
          Shared Trip
        </p>
        <h1 className="font-display text-[32px] leading-none tracking-wide text-text uppercase">
          {itinerary.name}
        </h1>
        <p className="mt-1 text-[13.5px] text-muted">
          Shared by {itinerary.user.name ?? "a traveler"}
        </p>
      </div>

      {itinerary.items.length === 0 ? (
        <p className="text-[13.5px] text-muted">This trip doesn&rsquo;t have any places yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itinerary.items.map((item, i) => (
            <PlaceCard
              key={item.id}
              place={toCardData(item.place)}
              className={`fade-slide-up ${delayClass(i)}`}
            />
          ))}
        </div>
      )}
    </main>
  );
}

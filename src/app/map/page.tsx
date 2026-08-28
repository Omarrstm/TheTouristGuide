import prisma from "@/lib/prisma";
import PlaceCard, { type PlaceCardData } from "@/components/PlaceCard";
import PlaceMap, { type MapPlace } from "@/components/PlaceMap";
import { delayClass } from "@/lib/animationDelay";

export const dynamic = "force-dynamic";

function toCardData(place: {
  id: string;
  name: string;
  city: string;
  isHiddenGem: boolean;
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
    countryName: place.country.name,
    photoUrl: place.photos[0]?.url ?? null,
    avgRating,
    reviewCount,
  };
}

export default async function MapPage() {
  const places = await prisma.place.findMany({
    where: { latitude: { not: null }, longitude: { not: null } },
    orderBy: { createdAt: "desc" },
    include: {
      country: { select: { name: true } },
      photos: { take: 1, orderBy: { createdAt: "asc" } },
      reviews: { select: { rating: true } },
    },
  });

  const mapPlaces: MapPlace[] = places.map((p) => ({
    id: p.id,
    name: p.name,
    city: p.city,
    countryName: p.country.name,
    isHiddenGem: p.isHiddenGem,
    latitude: p.latitude!,
    longitude: p.longitude!,
  }));

  const cardPlaces = places.map(toCardData);

  return (
    <main className="flex flex-col gap-8 pt-8 pb-20">
      <div className="fade-slide-up">
        <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">Explore</p>
        <h1 className="font-display text-[32px] leading-none tracking-wide text-text uppercase">
          Map of Places
        </h1>
      </div>

      <PlaceMap places={mapPlaces} />

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-[20px] tracking-wide text-text uppercase">All Places</h2>
        {cardPlaces.length === 0 ? (
          <p className="text-[13.5px] text-muted">No places with a map location yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cardPlaces.map((p, i) => (
              <PlaceCard key={p.id} place={p} className={`fade-slide-up ${delayClass(i)}`} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

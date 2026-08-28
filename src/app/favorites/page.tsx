import { getUser } from "@/lib/dal";
import prisma from "@/lib/prisma";
import PlaceCard, { type PlaceCardData } from "@/components/PlaceCard";
import { delayClass } from "@/lib/animationDelay";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await getUser();

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
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
  });

  const places: PlaceCardData[] = favorites.map(({ place }) => {
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
  });

  return (
    <main className="flex flex-col gap-8 pt-8 pb-20">
      <div className="fade-slide-up">
        <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">Saved</p>
        <h1 className="font-display text-[32px] leading-none tracking-wide text-text uppercase">
          My Favorites
        </h1>
      </div>

      {places.length === 0 ? (
        <p className="text-[13.5px] text-muted">
          You haven&rsquo;t saved any places yet &mdash; look for the Save button on a place page.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((p, i) => (
            <PlaceCard key={p.id} place={p} className={`fade-slide-up ${delayClass(i)}`} />
          ))}
        </div>
      )}
    </main>
  );
}

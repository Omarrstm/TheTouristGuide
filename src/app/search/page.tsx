import prisma from "@/lib/prisma";
import PlaceCard, { type PlaceCardData } from "@/components/PlaceCard";

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

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";

  const places = q
    ? await prisma.place.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          country: { select: { name: true } },
          photos: { take: 1, orderBy: { createdAt: "asc" } },
          reviews: { select: { rating: true } },
        },
      })
    : [];

  return (
    <main className="flex flex-col gap-6 pt-8 pb-20">
      <div>
        <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">Search</p>
        <h1 className="font-display text-[32px] leading-none tracking-wide text-text uppercase">
          {q ? `Results for "${q}"` : "Search Places"}
        </h1>
      </div>

      {!q ? (
        <p className="text-[13.5px] text-muted">
          Enter a place name, city, or keyword using the search box above.
        </p>
      ) : places.length === 0 ? (
        <p className="text-[13.5px] text-muted">No places match &ldquo;{q}&rdquo;.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((p) => (
            <PlaceCard key={p.id} place={toCardData(p)} />
          ))}
        </div>
      )}
    </main>
  );
}

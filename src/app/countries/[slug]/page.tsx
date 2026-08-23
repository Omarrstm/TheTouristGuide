import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PlaceCard, { type PlaceCardData } from "@/components/PlaceCard";
import GuideCard from "@/components/GuideCard";
import { delayClass } from "@/lib/animationDelay";

export const dynamic = "force-dynamic";

function toCardData(
  place: {
    id: string;
    name: string;
    city: string;
    isHiddenGem: boolean;
    photos: { url: string }[];
    reviews: { rating: number }[];
  }
): PlaceCardData {
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
    photoUrl: place.photos[0]?.url ?? null,
    avgRating,
    reviewCount,
  };
}

export default async function CountryPage(props: PageProps<"/countries/[slug]">) {
  const { slug } = await props.params;

  const country = await prisma.country.findUnique({ where: { slug } });
  if (!country) notFound();

  const [places, guides] = await Promise.all([
    prisma.place.findMany({
      where: { countryId: country.id },
      orderBy: { createdAt: "desc" },
      include: {
        photos: { take: 1, orderBy: { createdAt: "asc" } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.guideProfile.findMany({
      where: { countryId: country.id, isPublic: true },
      take: 4,
      include: { user: { select: { id: true, name: true } } },
    }),
  ]);

  const attractions = places.filter((p) => !p.isHiddenGem).map(toCardData);
  const hiddenGems = places.filter((p) => p.isHiddenGem).map(toCardData);

  return (
    <main className="flex flex-col gap-10 pt-8 pb-20">
      <div className="fade-slide-up">
        <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">
          Country Guide
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-[38px] leading-none tracking-wide text-text uppercase">
            {country.name}
          </h1>
          <Link
            href={`/places/new?country=${country.slug}`}
            prefetch={false}
            className="rounded-full bg-accent px-4 py-2 text-[12px] font-bold tracking-wide text-bg uppercase"
          >
            Suggest a Place Here
          </Link>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-[20px] tracking-wide text-text uppercase">
          Popular Attractions
        </h2>
        {attractions.length === 0 ? (
          <p className="text-[13.5px] text-muted">
            No touristic places added for {country.name} yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {attractions.map((p, i) => (
              <PlaceCard key={p.id} place={p} className={`fade-slide-up ${delayClass(i)}`} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-[20px] tracking-wide text-accent-teal uppercase">
          Hidden Gems
        </h2>
        {hiddenGems.length === 0 ? (
          <p className="text-[13.5px] text-muted">
            No hidden gems suggested for {country.name} yet &mdash; if you know one, be the first
            to share it.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hiddenGems.map((p, i) => (
              <PlaceCard key={p.id} place={p} className={`fade-slide-up ${delayClass(i)}`} />
            ))}
          </div>
        )}
      </section>

      {guides.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-[20px] tracking-wide text-text uppercase">
              Local Guides
            </h2>
            <Link
              href="/guides"
              prefetch={false}
              className="text-[12px] font-semibold tracking-wide text-muted underline-offset-2 hover:text-accent hover:underline"
            >
              See all guides &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g, i) => (
              <GuideCard
                key={g.user.id}
                className={`fade-slide-up ${delayClass(i)}`}
                guide={{ userId: g.user.id, name: g.user.name, city: g.city, languages: g.languages }}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

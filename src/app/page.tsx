import prisma from "@/lib/prisma";
import CountrySearch from "@/components/CountrySearch";
import PlaceCard from "@/components/PlaceCard";
import Link from "next/link";
import Image from "next/image";
import { delayClass } from "@/lib/animationDelay";

const HERO_PHOTO_URL =
  "https://upload.wikimedia.org/wikipedia/commons/f/fa/Giza_Great_Pyramid_of_Khufu_%289793898043%29.jpg";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [countries, popularCountries, recentGems] = await Promise.all([
    prisma.country.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } }),
    prisma.country.findMany({
      select: { name: true, slug: true, _count: { select: { places: true } } },
      orderBy: { places: { _count: "desc" } },
      take: 8,
    }),
    prisma.place.findMany({
      where: { isHiddenGem: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        country: { select: { name: true } },
        photos: { take: 1, orderBy: { createdAt: "asc" } },
      },
    }),
  ]);

  const featuredCountries = popularCountries.filter((c) => c._count.places > 0);

  return (
    <main className="flex flex-col gap-14 pt-10 pb-20">
      <section className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="relative h-[520px] w-full sm:h-[600px]">
          <Image
            src={HERO_PHOTO_URL}
            alt="The Great Pyramid of Giza"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          <div className="card-shine fade-slide-up absolute bottom-6 left-4 flex w-[calc(100%-2rem)] max-w-md flex-col items-start gap-3 rounded-[4px] bg-[var(--color-surface)]/95 p-6 shadow-xl sm:bottom-10 sm:left-[calc((100%-72rem)/2+2.5rem)]">
            <p className="font-display text-[13px] tracking-[0.14em] text-accent uppercase">
              Know before you go
            </p>
            <h1 className="font-display text-[36px] leading-[0.95] tracking-wide text-text uppercase sm:text-[44px]">
              Don&rsquo;t know where to go?
            </h1>
            <p className="font-display text-[20px] text-accent-teal italic">Ask the locals.</p>
            <p className="text-[14px] leading-relaxed text-muted">
              Browse rated touristic places by country, or discover hidden gems that only locals
              know about &mdash; suggested by the people who actually live there.
            </p>
            <CountrySearch countries={countries} />
            <p className="mt-1 text-[11px] tracking-[0.12em] text-muted uppercase">
              38 places &middot; local-verified
            </p>
          </div>
        </div>
      </section>

      {featuredCountries.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-[22px] tracking-wide text-text uppercase">
            Popular Countries
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {featuredCountries.map((c, i) => (
              <Link
                key={c.slug}
                href={`/countries/${c.slug}`}
                prefetch={false}
                className={`fade-slide-up ${delayClass(i)} rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-semibold text-text hover:border-accent hover:text-accent`}
              >
                {c.name}{" "}
                <span className="text-muted">
                  ({c._count.places})
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {recentGems.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-[22px] tracking-wide text-text uppercase">
            Recently Suggested Hidden Gems
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentGems.map((p, i) => (
              <PlaceCard
                key={p.id}
                className={`fade-slide-up ${delayClass(i)}`}
                place={{
                  id: p.id,
                  name: p.name,
                  city: p.city,
                  isHiddenGem: p.isHiddenGem,
                  costTier: p.costTier,
                  photoUrl: p.photos[0]?.url ?? null,
                  countryName: p.country.name,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {recentGems.length === 0 && (
        <section className="card-shine fade-slide-up flex flex-col items-start gap-3 rounded-2xl p-6">
          <p className="text-[14px] text-muted">
            No hidden gems suggested yet &mdash; be the first to share a favorite spot only locals
            know about.
          </p>
          <Link
            href="/places/new"
            className="btn-primary rounded-full"
          >
            Suggest a Place
          </Link>
        </section>
      )}
    </main>
  );
}

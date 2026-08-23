import prisma from "@/lib/prisma";
import CountrySearch from "@/components/CountrySearch";
import PlaceCard from "@/components/PlaceCard";
import Link from "next/link";
import { delayClass } from "@/lib/animationDelay";

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
      <section className="fade-slide-up relative flex flex-col items-start gap-5 overflow-hidden py-10">
        <div
          className="pointer-events-none absolute top-0 right-0 -z-10 h-[420px] w-[420px] rounded-full opacity-20 blur-[100px]"
          style={{ background: "var(--color-accent)" }}
        />
        <p className="font-display text-[13px] tracking-[0.14em] text-accent uppercase">
          Know before you go
        </p>
        <h1 className="max-w-2xl font-display text-[42px] leading-[0.95] tracking-wide text-text uppercase sm:text-[56px]">
          Don&rsquo;t know where to go? <span className="text-accent-teal">Ask the locals.</span>
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-muted">
          Browse rated touristic places by country, or discover hidden gems that only locals know
          about &mdash; suggested by the people who actually live there.
        </p>
        <CountrySearch countries={countries} />
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
            className="rounded-full bg-accent px-4 py-2 text-[12px] font-bold tracking-wide text-bg uppercase"
          >
            Suggest a Place
          </Link>
        </section>
      )}
    </main>
  );
}

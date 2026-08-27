import Link from "next/link";
import { getUser } from "@/lib/dal";
import prisma from "@/lib/prisma";
import NewTripForm from "@/components/NewTripForm";
import { delayClass } from "@/lib/animationDelay";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const user = await getUser();

  const itineraries = await prisma.itinerary.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <main className="flex flex-col gap-8 pt-8 pb-20">
      <div className="fade-slide-up">
        <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">Trips</p>
        <h1 className="font-display text-[32px] leading-none tracking-wide text-text uppercase">
          My Trips
        </h1>
      </div>

      <div className="card-shine fade-slide-up delay-1 rounded-[4px] p-6">
        <NewTripForm />
      </div>

      {itineraries.length === 0 ? (
        <p className="text-[13.5px] text-muted">
          You haven&rsquo;t planned any trips yet &mdash; create one above.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itineraries.map((t, i) => (
            <Link
              key={t.id}
              href={`/trips/${t.id}`}
              prefetch={false}
              className={`card-shine fade-slide-up ${delayClass(i)} rounded-[4px] p-4`}
            >
              <p className="font-display text-[15px] tracking-wide text-text uppercase">
                {t.name}
              </p>
              <p className="mt-1 text-[12px] text-muted">
                {t._count.items} {t._count.items === 1 ? "place" : "places"}
              </p>
              <p className="mt-2 text-[11px] text-muted">
                Created {t.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

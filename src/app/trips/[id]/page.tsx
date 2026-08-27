import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/dal";
import prisma from "@/lib/prisma";
import PlaceCard, { type PlaceCardData } from "@/components/PlaceCard";
import TripNameEditor from "@/components/TripNameEditor";
import DeleteItineraryButton from "@/components/DeleteItineraryButton";
import RemoveFromTripButton from "@/components/RemoveFromTripButton";
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

export default async function TripDetailPage(props: PageProps<"/trips/[id]">) {
  const { id } = await props.params;
  const user = await getUser();

  const itinerary = await prisma.itinerary.findUnique({
    where: { id },
    include: {
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

  if (!itinerary || itinerary.userId !== user.id) notFound();

  return (
    <main className="flex flex-col gap-8 pt-8 pb-20">
      <div className="fade-slide-up">
        <Link
          href="/trips"
          prefetch={false}
          className="text-[12px] font-semibold tracking-wide text-muted underline-offset-2 hover:text-accent hover:underline"
        >
          &larr; My Trips
        </Link>
        <TripNameEditor itineraryId={itinerary.id} name={itinerary.name} />
        <p className="mt-1 text-[13.5px] text-muted">
          Created{" "}
          {itinerary.createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {itinerary.items.length === 0 ? (
        <p className="text-[13.5px] text-muted">
          No places yet &mdash; browse places and use <strong>Add to Trip</strong> to save them
          here. <Link href="/" className="font-semibold text-accent hover:underline">Start browsing</Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itinerary.items.map((item, i) => (
            <div key={item.id} className={`fade-slide-up ${delayClass(i)} flex flex-col gap-1.5`}>
              <PlaceCard place={toCardData(item.place)} />
              <RemoveFromTripButton itineraryId={itinerary.id} placeId={item.place.id} />
            </div>
          ))}
        </div>
      )}

      <div className="fade-slide-up flex flex-col gap-4 rounded-[4px] border border-red-600/30 p-6">
        <h2 className="text-[13px] font-bold tracking-wide text-red-600 uppercase">
          Danger Zone
        </h2>
        <DeleteItineraryButton itineraryId={itinerary.id} />
      </div>
    </main>
  );
}

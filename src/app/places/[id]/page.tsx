import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getOptionalUser } from "@/lib/dal";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import DeletePlaceButton from "@/components/DeletePlaceButton";

export const dynamic = "force-dynamic";

export default async function PlaceDetailPage(props: PageProps<"/places/[id]">) {
  const { id } = await props.params;

  const [place, user] = await Promise.all([
    prisma.place.findUnique({
      where: { id },
      include: {
        country: true,
        photos: { orderBy: { createdAt: "asc" } },
        reviews: {
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true } } },
        },
      },
    }),
    getOptionalUser(),
  ]);

  if (!place) notFound();

  const reviewCount = place.reviews.length;
  const avgRating =
    reviewCount > 0
      ? place.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : null;
  const myReview = user ? place.reviews.find((r) => r.userId === user.id) : undefined;
  const isOwner = user != null && place.createdByUserId === user.id;

  return (
    <main className="flex flex-col gap-8 pt-8 pb-20">
      <div>
        <Link
          href={`/countries/${place.country.slug}`}
          prefetch={false}
          className="text-[12px] font-semibold tracking-wide text-muted underline-offset-2 hover:text-accent hover:underline"
        >
          &larr; {place.country.name}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[36px] leading-none tracking-wide text-text uppercase">
            {place.name}
          </h1>
          {place.isHiddenGem && (
            <span className="rounded-full border border-accent-teal bg-accent-teal-soft px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-accent-teal uppercase">
              Hidden Gem
            </span>
          )}
        </div>
        <p className="mt-1 text-[13.5px] text-muted">
          {place.city}, {place.country.name}
        </p>
        {avgRating != null && (
          <p className="mt-2 text-[14px] font-semibold text-accent">
            &#9733; {avgRating.toFixed(1)}{" "}
            <span className="font-normal text-muted">
              ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
            </span>
          </p>
        )}
        {isOwner && (
          <div className="mt-3 flex items-center gap-4">
            <Link
              href={`/places/${place.id}/edit`}
              prefetch={false}
              className="text-[12px] font-semibold text-muted underline-offset-2 hover:text-accent hover:underline"
            >
              Edit
            </Link>
            <DeletePlaceButton placeId={place.id} />
          </div>
        )}
      </div>

      {place.photos.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {place.photos.map((photo) => (
            <div key={photo.id} className="relative h-56 w-72 flex-shrink-0 overflow-hidden rounded-xl">
              <Image src={photo.url} alt={place.name} fill sizes="288px" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <p className="max-w-2xl text-[14.5px] leading-relaxed text-text/90">{place.description}</p>

      {place.latitude != null && place.longitude != null && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
        <div className="flex flex-col gap-1.5">
          <div className="h-72 w-full max-w-2xl overflow-hidden rounded-xl border border-border">
            <iframe
              title={`Map of ${place.name}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${
                place.googlePlaceId ? `place_id:${place.googlePlaceId}` : `${place.latitude},${place.longitude}`
              }`}
            />
          </div>
          {place.formattedAddress && (
            <p className="text-[12px] text-muted">{place.formattedAddress}</p>
          )}
        </div>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-[20px] tracking-wide text-text uppercase">Reviews</h2>

        {!user && (
          <p className="text-[13px] text-muted">
            <Link href={`/login?next=/places/${place.id}`} className="font-semibold text-accent hover:underline">
              Log in
            </Link>{" "}
            to leave a review.
          </p>
        )}

        {user && !myReview && <ReviewForm placeId={place.id} />}

        {place.reviews.length === 0 ? (
          <p className="text-[13.5px] text-muted">No reviews yet &mdash; be the first.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {place.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={{
                  id: review.id,
                  rating: review.rating,
                  comment: review.comment,
                  photoUrl: review.photoUrl,
                  createdAt: review.createdAt.toISOString(),
                  userId: review.userId,
                  userName: review.user.name,
                }}
                currentUserId={user?.id ?? null}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

import { notFound } from "next/navigation";
import { getUser } from "@/lib/dal";
import prisma from "@/lib/prisma";
import NewPlaceForm from "@/components/NewPlaceForm";

export const dynamic = "force-dynamic";

export default async function EditPlacePage(props: PageProps<"/places/[id]/edit">) {
  const { id } = await props.params;
  const user = await getUser();

  const [place, countries] = await Promise.all([
    prisma.place.findUnique({ where: { id } }),
    prisma.country.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!place) notFound();
  if (place.createdByUserId !== user.id) notFound();

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 pt-8 pb-20">
      <div className="fade-slide-up">
        <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">Edit</p>
        <h1 className="font-display text-[32px] leading-none tracking-wide text-text uppercase">
          {place.name}
        </h1>
      </div>
      <NewPlaceForm
        countries={countries}
        editing={{
          id: place.id,
          name: place.name,
          countryId: place.countryId,
          city: place.city,
          description: place.description,
          isHiddenGem: place.isHiddenGem,
          location:
            place.latitude != null && place.longitude != null
              ? {
                  latitude: place.latitude,
                  longitude: place.longitude,
                  formattedAddress: place.formattedAddress ?? "",
                  googlePlaceId: place.googlePlaceId ?? "",
                }
              : null,
        }}
      />
    </main>
  );
}

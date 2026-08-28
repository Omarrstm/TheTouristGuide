import { getUser } from "@/lib/dal";
import prisma from "@/lib/prisma";
import GuideProfileForm from "@/components/GuideProfileForm";

export const dynamic = "force-dynamic";

export default async function GuideProfilePage() {
  const user = await getUser();

  const [profile, countries] = await Promise.all([
    prisma.guideProfile.findUnique({ where: { userId: user.id } }),
    prisma.country.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 pt-8 pb-20">
      <div className="fade-slide-up">
        <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">
          Guide Profile
        </p>
        <h1 className="font-display text-[32px] leading-none tracking-wide text-text uppercase">
          {profile ? "Edit Your Guide Profile" : "Become a Guide"}
        </h1>
        <p className="mt-2 text-[13.5px] text-muted">
          Let travelers visiting your city find you and reach out to plan a trip together.
        </p>
      </div>
      <GuideProfileForm
        countries={countries}
        initial={
          profile
            ? {
                bio: profile.bio ?? "",
                languages: profile.languages.join(", "),
                specialties: profile.specialties.join(", "),
                city: profile.city,
                countryId: profile.countryId,
                isPublic: profile.isPublic,
              }
            : null
        }
      />
    </main>
  );
}

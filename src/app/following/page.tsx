import { getUser } from "@/lib/dal";
import prisma from "@/lib/prisma";
import GuideCard, { type GuideCardData } from "@/components/GuideCard";
import { delayClass } from "@/lib/animationDelay";

export const dynamic = "force-dynamic";

export default async function FollowingPage() {
  const user = await getUser();

  const follows = await prisma.follow.findMany({
    where: { followerId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          guideProfile: {
            select: { city: true, languages: true, specialties: true, country: { select: { name: true } } },
          },
        },
      },
    },
  });

  const guides: GuideCardData[] = follows
    .filter((f) => f.following.guideProfile)
    .map((f) => ({
      userId: f.following.id,
      name: f.following.name,
      city: f.following.guideProfile!.city,
      countryName: f.following.guideProfile!.country.name,
      languages: f.following.guideProfile!.languages,
      specialties: f.following.guideProfile!.specialties,
    }));

  return (
    <main className="flex flex-col gap-8 pt-8 pb-20">
      <div className="fade-slide-up">
        <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">Following</p>
        <h1 className="font-display text-[32px] leading-none tracking-wide text-text uppercase">
          Guides You Follow
        </h1>
      </div>

      {guides.length === 0 ? (
        <p className="text-[13.5px] text-muted">
          You&rsquo;re not following any guides yet &mdash; look for the Follow button on a guide&rsquo;s
          profile.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g, i) => (
            <GuideCard key={g.userId} guide={g} className={`fade-slide-up ${delayClass(i)}`} />
          ))}
        </div>
      )}
    </main>
  );
}

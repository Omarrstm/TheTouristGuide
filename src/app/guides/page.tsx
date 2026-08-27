import Link from "next/link";
import prisma from "@/lib/prisma";
import GuideDirectory from "@/components/GuideDirectory";

export const dynamic = "force-dynamic";

export default async function GuidesPage() {
  const guides = await prisma.guideProfile.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true } }, country: { select: { name: true } } },
  });

  return (
    <main className="flex flex-col gap-6 pt-8 pb-20">
      <div className="fade-slide-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">
            Meet the Locals
          </p>
          <h1 className="font-display text-[36px] leading-none tracking-wide text-text uppercase">
            Tourist Guides
          </h1>
          <p className="mt-2 max-w-xl text-[13.5px] text-muted">
            Local guides who can show you around and help plan your trip. Message one directly to
            get started.
          </p>
        </div>
        <Link
          href="/guide/profile"
          prefetch={false}
          className="btn-primary rounded-full"
        >
          Become a Guide
        </Link>
      </div>

      {guides.length === 0 ? (
        <p className="text-[13.5px] text-muted">
          No guides registered yet &mdash; be the first to offer to show travelers around.
        </p>
      ) : (
        <GuideDirectory
          guides={guides.map((g) => ({
            userId: g.user.id,
            name: g.user.name,
            city: g.city,
            countryName: g.country.name,
            languages: g.languages,
          }))}
        />
      )}
    </main>
  );
}

import { getUser } from "@/lib/dal";
import prisma from "@/lib/prisma";
import NewPlaceForm from "@/components/NewPlaceForm";

export const dynamic = "force-dynamic";

export default async function NewPlacePage(props: PageProps<"/places/new">) {
  await getUser(); // redirects to /login if not signed in

  const searchParams = await props.searchParams;
  const preselectedSlug = typeof searchParams.country === "string" ? searchParams.country : null;

  const countries = await prisma.country.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 pt-8 pb-20">
      <div className="fade-slide-up">
        <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">
          Contribute
        </p>
        <h1 className="font-display text-[32px] leading-none tracking-wide text-text uppercase">
          Suggest a Place
        </h1>
        <p className="mt-2 text-[13.5px] text-muted">
          Share a touristic attraction, or a hidden gem only locals know about.
        </p>
      </div>
      <NewPlaceForm countries={countries} preselectedSlug={preselectedSlug} />
    </main>
  );
}

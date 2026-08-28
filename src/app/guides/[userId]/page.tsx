import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getOptionalUser } from "@/lib/dal";
import StartConversationForm from "@/components/StartConversationForm";
import ReportButton from "@/components/ReportButton";
import { reportUser } from "@/app/reports/actions";

export const dynamic = "force-dynamic";

export default async function GuideDetailPage(props: PageProps<"/guides/[userId]">) {
  const { userId } = await props.params;

  const [profile, viewer] = await Promise.all([
    prisma.guideProfile.findUnique({
      where: { userId },
      include: { user: { select: { id: true, name: true } }, country: true },
    }),
    getOptionalUser(),
  ]);

  if (!profile || (!profile.isPublic && viewer?.id !== userId)) notFound();

  const isSelf = viewer?.id === userId;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 pt-8 pb-20">
      <div className="fade-slide-up">
        <Link
          href="/guides"
          prefetch={false}
          className="text-[12px] font-semibold tracking-wide text-muted underline-offset-2 hover:text-accent hover:underline"
        >
          &larr; All Guides
        </Link>
        <p className="mt-2 font-display text-[13px] tracking-[0.12em] text-accent uppercase">
          Local Guide
        </p>
        <h1 className="font-display text-[34px] leading-none tracking-wide text-text uppercase">
          {profile.user.name ?? "Guide"}
        </h1>
        <p className="mt-1 text-[13.5px] text-muted">
          {profile.city}, {profile.country.name}
        </p>
        {profile.languages.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.languages.map((l) => (
              <span
                key={l}
                className="rounded-full border border-border px-2.5 py-1 text-[10.5px] font-semibold text-muted uppercase"
              >
                {l}
              </span>
            ))}
          </div>
        )}
      </div>

      {profile.bio && (
        <p className="max-w-xl text-[14.5px] leading-relaxed text-text/90">{profile.bio}</p>
      )}

      {isSelf ? (
        <p className="text-[13px] text-muted">
          This is your public guide profile.{" "}
          <Link href="/guide/profile" className="font-semibold text-accent hover:underline">
            Edit it
          </Link>
          .
        </p>
      ) : viewer ? (
        <div className="flex flex-col gap-3">
          <StartConversationForm guideUserId={userId} />
          <ReportButton
            label="Report user"
            onSubmit={async (reason) => {
              "use server";
              await reportUser({ userId, reason });
            }}
          />
        </div>
      ) : (
        <p className="text-[13px] text-muted">
          <Link
            href={`/login?next=/guides/${userId}`}
            className="font-semibold text-accent hover:underline"
          >
            Log in
          </Link>{" "}
          to message this guide.
        </p>
      )}
    </main>
  );
}

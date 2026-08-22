import Link from "next/link";
import { getUser } from "@/lib/dal";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const user = await getUser();

  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ travelerId: user.id }, { guideId: user.id }] },
    include: {
      traveler: { select: { id: true, name: true } },
      guide: { select: { id: true, name: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const rows = conversations
    .map((c) => {
      const isTraveler = c.travelerId === user.id;
      const counterpart = isTraveler ? c.guide : c.traveler;
      const lastMessage = c.messages[0] ?? null;
      return {
        id: c.id,
        counterpartName: counterpart.name ?? (isTraveler ? "Guide" : "Traveler"),
        roleLabel: isTraveler ? "Guiding you" : "Traveler",
        lastMessageBody: lastMessage?.body ?? "",
        lastMessageAt: lastMessage?.createdAt ?? c.createdAt,
      };
    })
    .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 pt-8 pb-20">
      <div>
        <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">
          Inbox
        </p>
        <h1 className="font-display text-[32px] leading-none tracking-wide text-text uppercase">
          Messages
        </h1>
      </div>

      {rows.length === 0 ? (
        <p className="text-[13.5px] text-muted">
          No conversations yet &mdash;{" "}
          <Link href="/guides" className="font-semibold text-accent hover:underline">
            find a guide
          </Link>{" "}
          to start planning.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <Link key={row.id} href={`/messages/${row.id}`} prefetch={false}>
              <div className="card-shine flex items-center justify-between gap-3 rounded-xl p-4">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-text">{row.counterpartName}</p>
                  <p className="truncate text-[12.5px] text-muted">{row.lastMessageBody}</p>
                </div>
                <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[10px] font-bold tracking-wide text-muted uppercase">
                  {row.roleLabel}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

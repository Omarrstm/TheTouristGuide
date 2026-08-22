import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/dal";
import prisma from "@/lib/prisma";
import MessageThread from "@/components/MessageThread";

export const dynamic = "force-dynamic";

export default async function ConversationPage(props: PageProps<"/messages/[conversationId]">) {
  const { conversationId } = await props.params;
  const user = await getUser();

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      traveler: { select: { id: true, name: true } },
      guide: { select: { id: true, name: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conversation || (conversation.travelerId !== user.id && conversation.guideId !== user.id)) {
    notFound();
  }

  const isTraveler = conversation.travelerId === user.id;
  const counterpart = isTraveler ? conversation.guide : conversation.traveler;

  return (
    <main className="mx-auto flex h-[75vh] w-full max-w-2xl flex-col gap-4 pt-8 pb-10">
      <div>
        <Link
          href="/messages"
          prefetch={false}
          className="text-[12px] font-semibold tracking-wide text-muted underline-offset-2 hover:text-accent hover:underline"
        >
          &larr; Messages
        </Link>
        <h1 className="mt-1 font-display text-[26px] leading-none tracking-wide text-text uppercase">
          {counterpart.name ?? (isTraveler ? "Guide" : "Traveler")}
        </h1>
      </div>
      <MessageThread
        conversationId={conversation.id}
        currentUserId={user.id}
        messages={conversation.messages.map((m) => ({
          id: m.id,
          body: m.body,
          createdAt: m.createdAt.toISOString(),
          senderId: m.senderId,
        }))}
      />
    </main>
  );
}

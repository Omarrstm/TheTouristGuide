"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startConversation } from "@/app/messages/actions";

export default function StartConversationForm({ guideUserId }: { guideUserId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const { conversationId } = await startConversation({ guideUserId, body });
        router.push(`/messages/${conversationId}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't send that message.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card-shine flex flex-col gap-3 rounded-xl p-4">
      <p className="text-[13px] font-semibold text-text">Send a message</p>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Introduce yourself and what you're hoping to plan..."
        className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none placeholder:text-muted focus-visible:border-accent"
      />
      {error && <p className="text-[12px] text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending || body.trim().length === 0}
        className="btn-primary w-fit rounded-[4px]"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

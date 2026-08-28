"use client";

import { useState, useTransition } from "react";
import { setTripSharing, regenerateShareLink } from "@/app/trips/actions";

export default function ShareTripButton({
  itineraryId,
  initialIsShared,
  initialShareToken,
}: {
  itineraryId: string;
  initialIsShared: boolean;
  initialShareToken: string;
}) {
  const [isShared, setIsShared] = useState(initialIsShared);
  const [shareToken, setShareToken] = useState(initialShareToken);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/trips/shared/${shareToken}` : "";

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      try {
        await setTripSharing({ itineraryId, isShared: !isShared });
        setIsShared((v) => !v);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't update sharing.");
      }
    });
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleRegenerate() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await regenerateShareLink(itineraryId);
        setShareToken(result.shareToken);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't regenerate the link.");
      }
    });
  }

  return (
    <div className="card-shine flex flex-col gap-3 rounded-[4px] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-semibold text-text">Share this trip</p>
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          className={`rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-wide uppercase disabled:opacity-50 ${
            isShared
              ? "border-accent bg-accent-soft text-accent"
              : "border-border bg-surface-2 text-text hover:border-accent hover:text-accent"
          }`}
        >
          {isShared ? "Sharing On" : "Sharing Off"}
        </button>
      </div>

      {isShared && (
        <div className="flex flex-col gap-2">
          <p className="text-[12px] text-muted">
            Anyone with this link can view this trip &mdash; no account needed.
          </p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              onFocus={(e) => e.target.select()}
              className="w-full min-w-0 rounded-lg border border-border bg-surface-2 px-3 py-2 text-[12.5px] text-text outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-[4px] border border-border px-3 py-2 text-[11px] font-bold tracking-wide text-text uppercase hover:border-accent hover:text-accent"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isPending}
            className="w-fit text-[12px] font-semibold text-muted underline-offset-2 hover:text-accent hover:underline disabled:opacity-50"
          >
            Regenerate link
          </button>
        </div>
      )}

      {error && <p className="text-[12px] text-red-600">{error}</p>}
    </div>
  );
}

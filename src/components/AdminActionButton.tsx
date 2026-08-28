"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function AdminActionButton({
  action,
  label,
  confirmLabel,
  danger = false,
}: {
  action: () => Promise<void>;
  label: string;
  confirmLabel?: string;
  danger?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick() {
    if (confirmLabel && !confirming) {
      setConfirming(true);
      resetRef.current = setTimeout(() => setConfirming(false), 3000);
      return;
    }
    if (resetRef.current) clearTimeout(resetRef.current);
    setError(null);
    startTransition(async () => {
      try {
        await action();
        setConfirming(false);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't complete this action.");
        setConfirming(false);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`rounded-[4px] px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase disabled:opacity-50 ${
          danger
            ? confirming
              ? "bg-red-600 text-white"
              : "border border-red-600/60 text-red-600 hover:bg-red-600 hover:text-white"
            : "border border-border text-text hover:border-accent hover:text-accent"
        }`}
      >
        {isPending ? "Working..." : confirming ? confirmLabel : label}
      </button>
      {error && <span className="text-[12px] text-red-600">{error}</span>}
    </div>
  );
}

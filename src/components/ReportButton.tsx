"use client";

import { useState, useTransition } from "react";

export default function ReportButton({
  onSubmit,
  label = "Report",
}: {
  onSubmit: (reason: string) => Promise<void>;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await onSubmit(reason);
        setDone(true);
        setOpen(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't submit this report.");
      }
    });
  }

  if (done) {
    return <p className="text-[12px] text-muted">Reported &mdash; thanks for letting us know.</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[12px] font-semibold text-muted underline-offset-2 hover:text-accent hover:underline"
      >
        {label}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        autoFocus
        placeholder="Why are you reporting this?"
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-[13px] text-text outline-none focus-visible:border-accent"
      />
      {error && <p className="text-[12px] text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={isPending} className="btn-primary rounded-[4px] px-3 py-1.5 text-[11px]">
          {isPending ? "Submitting..." : "Submit Report"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[12px] font-semibold text-muted hover:text-text"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

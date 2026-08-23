"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "@/app/account/actions";

export default function DeleteAccountButton() {
  const [isPending, startTransition] = useTransition();
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteAccount();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't delete your account.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12.5px] text-muted">
        This permanently deletes your account, your reviews, your guide profile (if any), and all
        your messages. Places you suggested stay up, just no longer credited to you. Type{" "}
        <span className="font-semibold text-text">DELETE</span> to confirm.
      </p>
      <input
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="DELETE"
        className="w-40 rounded-lg border border-border bg-surface-2 px-3 py-2 text-[13px] text-text outline-none placeholder:text-muted focus-visible:border-red-400"
      />
      {error && <p className="text-[12px] text-red-400">{error}</p>}
      <button
        type="button"
        onClick={handleDelete}
        disabled={confirmText !== "DELETE" || isPending}
        className="w-fit rounded-lg border border-red-400/60 bg-red-400/10 px-4 py-2 text-[12px] font-bold tracking-wide text-red-400 uppercase disabled:opacity-40"
      >
        {isPending ? "Deleting..." : "Delete My Account"}
      </button>
    </div>
  );
}

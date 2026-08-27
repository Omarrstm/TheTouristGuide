"use client";

import { useState, useTransition } from "react";
import { updateAccountProfile } from "@/app/account/actions";

export default function AccountProfileForm({
  initialName,
  initialHomeCountry,
}: {
  initialName: string;
  initialHomeCountry: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [homeCountry, setHomeCountry] = useState(initialHomeCountry);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    startTransition(async () => {
      try {
        await updateAccountProfile({ name, homeCountry });
        setStatus("Saved.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't save your profile.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none focus-visible:border-accent"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
          Home Country
        </span>
        <input
          value={homeCountry}
          onChange={(e) => setHomeCountry(e.target.value)}
          placeholder="Optional"
          className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none placeholder:text-muted focus-visible:border-accent"
        />
      </label>
      {error && <p className="text-[12px] text-red-600">{error}</p>}
      {status && <p className="text-[12px] text-accent">{status}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-fit rounded-[4px]"
      >
        {isPending ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}

"use client";

import Link from "next/link";
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signup } from "./actions";
import Logo from "@/components/Logo";

function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, undefined);
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  return (
    <form action={formAction} className="relative z-10 mt-5 flex flex-col gap-3">
      {next && <input type="hidden" name="next" value={next} />}

      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
          Name
        </span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          required
          className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none focus-visible:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
          Email
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none focus-visible:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
          Password
        </span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none focus-visible:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
          Home country (optional)
        </span>
        <input
          name="homeCountry"
          type="text"
          placeholder="So we can flag your hidden gem tips as coming from a local"
          className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-[14px] text-text outline-none placeholder:text-muted/60 focus-visible:border-accent"
        />
      </label>

      {state?.error && <p className="text-[12px] text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary mt-2 w-full rounded-[4px] text-center text-[13px]"
      >
        {pending ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}

export default function SignupPage() {
  return (
    <div className="relative flex min-h-[80vh] w-full flex-1 items-center justify-center overflow-hidden px-4">
      <div
        className="pointer-events-none absolute top-0 right-0 -z-10 h-[420px] w-[420px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "var(--color-accent)" }}
      />
      <div className="card-shine fade-slide-up w-full max-w-sm rounded-[4px] p-6">
        <Logo className="mb-3" />
        <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">
          TheTouristGuide
        </p>
        <h1 className="font-display text-[28px] leading-none tracking-wide text-text uppercase">
          Create Account
        </h1>

        <Suspense fallback={null}>
          <SignupForm />
        </Suspense>

        <p className="relative z-10 mt-4 text-center text-[13px] text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

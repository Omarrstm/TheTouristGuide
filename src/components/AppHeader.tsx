import Link from "next/link";
import { logout } from "@/app/actions";

export default function AppHeader({ user }: { user: { name: string | null } | null }) {
  return (
    <header className="flex flex-col gap-4 border-b border-border/70 py-5 sm:flex-row sm:items-center sm:justify-between">
      <Link href="/" prefetch={false} className="font-display text-[22px] tracking-[0.1em] text-text uppercase">
        TheTouristGuide
      </Link>
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link
          href="/guides"
          prefetch={false}
          className="text-[13px] font-semibold tracking-wide text-muted hover:text-accent"
        >
          Guides
        </Link>
        <Link
          href="/places/new"
          prefetch={false}
          className="text-[13px] font-semibold tracking-wide text-muted hover:text-accent"
        >
          Suggest a Place
        </Link>
        {user ? (
          <>
            <Link
              href="/messages"
              prefetch={false}
              className="text-[13px] font-semibold tracking-wide text-muted hover:text-accent"
            >
              Messages
            </Link>
            <span className="text-[13px] font-semibold tracking-wide text-muted">
              {user.name ?? "Account"}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="text-[13px] font-semibold tracking-wide text-muted hover:text-accent"
              >
                Log Out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              prefetch={false}
              className="text-[13px] font-semibold tracking-wide text-muted hover:text-accent"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              prefetch={false}
              className="rounded-full bg-accent px-3.5 py-1.5 text-[12px] font-bold text-bg uppercase tracking-wide"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

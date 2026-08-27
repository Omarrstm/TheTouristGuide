import Link from "next/link";
import { logout } from "@/app/actions";
import Logo from "@/components/Logo";

export default function AppHeader({
  user,
  hasUnreadMessages = false,
}: {
  user: { name: string | null } | null;
  hasUnreadMessages?: boolean;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border/70 py-5 sm:flex-row sm:items-center sm:justify-between">
      <Link href="/" prefetch={false} className="flex items-center gap-2.5">
        <Logo />
        <span className="font-display text-[22px] tracking-[0.1em] text-text uppercase">
          TheTouristGuide
        </span>
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
          href="/map"
          prefetch={false}
          className="text-[13px] font-semibold tracking-wide text-muted hover:text-accent"
        >
          Map
        </Link>
        <Link
          href="/places/new"
          prefetch={false}
          className="text-[13px] font-semibold tracking-wide text-muted hover:text-accent"
        >
          Suggest a Place
        </Link>
        <form action="/search" method="GET">
          <input
            type="search"
            name="q"
            placeholder="Search places..."
            className="w-36 rounded-full border border-border bg-surface-2 px-3.5 py-1.5 text-[12.5px] text-text outline-none placeholder:text-muted focus-visible:border-accent sm:w-48"
          />
        </form>
        {user ? (
          <>
            <Link
              href="/messages"
              prefetch={false}
              className="relative text-[13px] font-semibold tracking-wide text-muted hover:text-accent"
            >
              Messages
              {hasUnreadMessages && (
                <span className="absolute -top-1 -right-2.5 h-2 w-2 rounded-full bg-accent" />
              )}
            </Link>
            <Link
              href="/account"
              prefetch={false}
              className="text-[13px] font-semibold tracking-wide text-muted hover:text-accent"
            >
              {user.name ?? "Account"}
            </Link>
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
              className="btn-primary rounded-full"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

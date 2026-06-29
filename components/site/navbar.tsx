import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/properties", label: "Properties" },
  { href: "/compare", label: "Compare" },
  { href: "/properties", label: "How it works" },
];

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Habitat home">
          <Image
            src="/habitat_logo.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8"
            priority
          />
          <span className="font-display text-xl font-semibold tracking-tight">
            Habitat
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden text-sm font-medium text-muted transition-colors hover:text-foreground sm:block"
              >
                Dashboard
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-card"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden text-sm font-medium text-muted transition-colors hover:text-foreground sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

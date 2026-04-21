"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { clearSession, getStoredSession } from "@/lib/auth";

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: "/", label: "Головна" },
  { href: "/tickets", label: "Заявки" },
  { href: "/categories", label: "Категорії" },
  { href: "/users", label: "Користувачі" },
  { href: "/profile", label: "Профіль" }
];

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<ReturnType<typeof getStoredSession>>(null);

  const activeHref = useMemo(() => pathname ?? "/", [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const syncSession = () => setSession(getStoredSession());

    syncSession();

    window.addEventListener("helpdesk-auth-change", syncSession);
    window.addEventListener("storage", syncSession);

    return () => {
      window.removeEventListener("helpdesk-auth-change", syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  const onNavClick = () => setOpen(false);

  const onLogout = () => {
    clearSession();
    onNavClick();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2" onClick={onNavClick}>
              <div className="h-8 w-8 rounded-xl bg-neutral-900" />
              <div className="leading-tight">
                <div className="text-sm font-semibold">Helpdesk</div>
                <div className="hidden text-xs text-neutral-500 sm:block">Ticket system</div>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((it) => {
                const isActive =
                  activeHref === it.href ||
                  (it.href !== "/" && activeHref.startsWith(it.href));
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={onNavClick}
                    className={cx(
                      "rounded-xl px-3 py-2 text-sm transition",
                      isActive
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    {it.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {session?.user ? (
              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium text-neutral-900">{session.user.name}</div>
                <div className="text-xs text-neutral-500">{session.user.role}</div>
              </div>
            ) : null}
            <Link
              href="/tickets/new"
              onClick={onNavClick}
              className="hidden items-center justify-center rounded-xl bg-neutral-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 active:translate-y-px sm:inline-flex"
            >
              Нова заявка
            </Link>
            {session?.user ? (
              <button
                type="button"
                onClick={onLogout}
                className="hidden items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-neutral-50 active:translate-y-px sm:inline-flex"
              >
                Вийти
              </button>
            ) : (
              <Link
                href="/login"
                onClick={onNavClick}
                className="hidden items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-neutral-50 active:translate-y-px sm:inline-flex"
              >
                Увійти
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border transition hover:bg-neutral-50 md:hidden"
              aria-label="Відкрити меню"
              aria-expanded={open}
            >
              <span className="sr-only">Menu</span>
              <div className="flex flex-col gap-1">
                <span
                  className={cx(
                    "block h-0.5 w-5 bg-neutral-900 transition",
                    open && "translate-y-1.5 rotate-45"
                  )}
                />
                <span
                  className={cx("block h-0.5 w-5 bg-neutral-900 transition", open && "opacity-0")}
                />
                <span
                  className={cx(
                    "block h-0.5 w-5 bg-neutral-900 transition",
                    open && "-translate-y-1.5 -rotate-45"
                  )}
                />
              </div>
            </button>
          </div>
        </div>

        <div
          className={cx(
            "overflow-hidden transition-[max-height,opacity] duration-200 md:hidden",
            open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="pb-4 pt-2">
            <div className="grid gap-1">
              {NAV.map((it) => {
                const isActive =
                  activeHref === it.href ||
                  (it.href !== "/" && activeHref.startsWith(it.href));
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={onNavClick}
                    className={cx(
                      "rounded-xl px-3 py-2 text-sm transition",
                      isActive ? "bg-neutral-100 text-neutral-900" : "text-neutral-700 hover:bg-neutral-50"
                    )}
                  >
                    {it.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-3 flex gap-2">
              <Link
                href="/tickets/new"
                onClick={onNavClick}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-neutral-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 active:translate-y-px"
              >
                Нова заявка
              </Link>
              {session?.user ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex flex-1 items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-neutral-50 active:translate-y-px"
                >
                  Вийти
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={onNavClick}
                  className="inline-flex flex-1 items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-neutral-50 active:translate-y-px"
                >
                  Увійти
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-neutral-600">© {year} Helpdesk.</div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/docs"
              className="text-neutral-600 hover:text-neutral-900 transition"
            >
              Docs
            </Link>
            <Link
              href="/about"
              className="text-neutral-600 hover:text-neutral-900 transition"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-neutral-600 hover:text-neutral-900 transition"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

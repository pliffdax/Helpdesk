import Link from "next/link";

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Категорії</h1>
      <p className="mt-2 text-neutral-600">
        Заглушка сторінки. У наступних роботах тут буде список категорій та
        керування ними.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/tickets"
          className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 transition"
        >
          До заявок
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 transition"
        >
          На головну
        </Link>
      </div>
    </div>
  );
}

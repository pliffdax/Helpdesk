import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Документація</h1>
      <p className="mt-2 text-neutral-600">
        Заглушка сторінки. Тут буде опис системи, правила роботи з заявками та
        інструкції для користувачів.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/about"
          className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 transition"
        >
          Про сервіс
        </Link>
        <Link
          href="/privacy"
          className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 transition"
        >
          Політика конфіденційності
        </Link>
      </div>
    </div>
  );
}

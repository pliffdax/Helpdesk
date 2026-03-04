import Link from "next/link";

export default async function TicketDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-neutral-500">
            {decodeURIComponent(id)}
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            Деталі заявки
          </h1>
        </div>
        <Link
          href="/tickets"
          className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 active:translate-y-px transition"
        >
          Назад
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="font-medium">Опис</div>
          <p className="mt-2 text-sm text-neutral-700">
            Тут буде опис тикета та історія змін статусу. Пізніше підтягнемо з
            API.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="font-medium">Дані</div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <dt className="text-neutral-600">Статус</dt>
            <dd className="text-neutral-900">Open</dd>
            <dt className="text-neutral-600">Категорія</dt>
            <dd className="text-neutral-900">UI</dd>
            <dt className="text-neutral-600">Пріоритет</dt>
            <dd className="text-neutral-900">High</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { TicketList } from "@/components/tickets/ticket-list";

export default function TicketsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Заявки</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Перегляд звернень користувачів, фільтрація та статуси.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/tickets/new"
            className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 active:translate-y-px transition"
          >
            Нова заявка
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <TicketList />
      </div>
    </div>
  );
}

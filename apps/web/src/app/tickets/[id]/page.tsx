import Link from "next/link";
import { TicketActions } from "@/components/tickets/ticket-actions";
import { getCategories, getPublicApiBaseUrl, getTicketById } from "@/lib/helpdesk-api";
import { ui } from "@/components/ui/ui";

export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  switch (status) {
    case "OPEN":
      return "Open";
    case "IN_PROGRESS":
      return "In progress";
    case "RESOLVED":
      return "Resolved";
    case "CLOSED":
      return "Closed";
    default:
      return status;
  }
}

function priorityLabel(priority: string) {
  switch (priority) {
    case "LOW":
      return "Low";
    case "MEDIUM":
      return "Medium";
    case "HIGH":
      return "High";
    default:
      return priority;
  }
}

export default async function TicketDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticketId = Number(id);
  const ticket = Number.isInteger(ticketId) ? await getTicketById(ticketId) : null;

  if (!ticket) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className={`${ui.card} p-5`}>
          <h1 className="text-xl font-semibold tracking-tight">Заявку не знайдено</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Перевір ідентифікатор або створи нову заявку.
          </p>
          <Link href="/tickets" className={`${ui.btnSecondary} mt-4`}>
            Назад до списку
          </Link>
        </div>
      </div>
    );
  }

  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-neutral-500">TCK-{String(ticket.id).padStart(4, "0")}</div>
          <h1 className="text-xl font-semibold tracking-tight">{ticket.title}</h1>
        </div>
        <Link href="/tickets" className={ui.btnSecondary}>
          Назад
        </Link>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="grid gap-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="font-medium">Опис</div>
            <p className="mt-2 text-sm leading-6 text-neutral-700">{ticket.description}</p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="font-medium">Дані</div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <dt className="text-neutral-600">Статус</dt>
              <dd className="text-neutral-900">{statusLabel(ticket.status)}</dd>
              <dt className="text-neutral-600">Категорія</dt>
              <dd className="text-neutral-900">{ticket.category.name}</dd>
              <dt className="text-neutral-600">Пріоритет</dt>
              <dd className="text-neutral-900">{priorityLabel(ticket.priority)}</dd>
              <dt className="text-neutral-600">Автор</dt>
              <dd className="text-neutral-900">{ticket.creator.name}</dd>
              <dt className="text-neutral-600">Email</dt>
              <dd className="break-all text-neutral-900">{ticket.creator.email}</dd>
              <dt className="text-neutral-600">Створено</dt>
              <dd className="text-neutral-900">{new Date(ticket.createdAt).toLocaleString("uk-UA")}</dd>
              <dt className="text-neutral-600">Оновлено</dt>
              <dd className="text-neutral-900">{new Date(ticket.updatedAt).toLocaleString("uk-UA")}</dd>
            </dl>
          </div>
        </div>

        <TicketActions
          ticket={ticket}
          categories={categories}
          apiBaseUrl={getPublicApiBaseUrl()}
        />
      </div>
    </div>
  );
}

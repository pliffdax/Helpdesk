import Link from "next/link";
import { ui } from "@/components/ui/ui";
import type { Ticket } from "@/lib/helpdesk-api";

type Filters = {
  search?: string;
  status?: string;
  priority?: string;
};

function badge(status: Ticket["status"]) {
  switch (status) {
    case "OPEN":
      return "bg-sky-50 text-sky-700 border-sky-100";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "RESOLVED":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "CLOSED":
      return "bg-neutral-100 text-neutral-700 border-neutral-200";
  }
}

function label(status: Ticket["status"]) {
  switch (status) {
    case "OPEN":
      return "Open";
    case "IN_PROGRESS":
      return "In progress";
    case "RESOLVED":
      return "Resolved";
    case "CLOSED":
      return "Closed";
  }
}

function priorityLabel(priority: Ticket["priority"]) {
  switch (priority) {
    case "LOW":
      return "Low";
    case "MEDIUM":
      return "Medium";
    case "HIGH":
      return "High";
  }
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function TicketList({
  tickets,
  filters,
}: {
  tickets: Ticket[];
  filters: Filters;
}) {
  return (
    <div className="grid gap-4">
      <form className={`${ui.card} p-4`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <input
              name="search"
              defaultValue={filters.search ?? ""}
              placeholder="Пошук по назві або опису..."
              className={`w-full sm:w-72 ${ui.input}`}
            />
            <select name="status" className={ui.select} defaultValue={filters.status ?? ""}>
              <option value="">Статус: всі</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select name="priority" className={ui.select} defaultValue={filters.priority ?? ""}>
              <option value="">Пріоритет: всі</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <button type="submit" className={ui.btnSecondary}>
              Застосувати
            </button>
          </div>

          <div className="text-sm text-neutral-600">
            Всього: <span className="font-medium text-neutral-900">{tickets.length}</span>
          </div>
        </div>
      </form>

      <div className="grid gap-3 md:hidden">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/tickets/${ticket.id}`}
            className={`${ui.card} p-4 transition hover:shadow-md`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-neutral-500">TCK-{String(ticket.id).padStart(4, "0")}</div>
                <div className="mt-1 font-medium">{ticket.title}</div>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${badge(
                  ticket.status,
                )}`}
              >
                {label(ticket.status)}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="text-neutral-600">Категорія</div>
              <div className="text-neutral-900">{ticket.category.name}</div>
              <div className="text-neutral-600">Пріоритет</div>
              <div className="text-neutral-900">{priorityLabel(ticket.priority)}</div>
              <div className="text-neutral-600">Автор</div>
              <div className="text-neutral-900">{ticket.creator.name}</div>
              <div className="text-neutral-600">Дата</div>
              <div className="text-neutral-900">{dateLabel(ticket.createdAt)}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className={`hidden md:block ${ui.card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Назва</th>
                <th className="px-4 py-3 text-left font-medium">Категорія</th>
                <th className="px-4 py-3 text-left font-medium">Статус</th>
                <th className="px-4 py-3 text-left font-medium">Пріоритет</th>
                <th className="px-4 py-3 text-left font-medium">Автор</th>
                <th className="px-4 py-3 text-left font-medium">Дата</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t transition hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link className="font-medium hover:underline" href={`/tickets/${ticket.id}`}>
                      TCK-{String(ticket.id).padStart(4, "0")}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-900">{ticket.title}</td>
                  <td className="px-4 py-3 text-neutral-700">{ticket.category.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badge(
                        ticket.status,
                      )}`}
                    >
                      {label(ticket.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{priorityLabel(ticket.priority)}</td>
                  <td className="px-4 py-3 text-neutral-700">{ticket.creator.name}</td>
                  <td className="px-4 py-3 text-neutral-700">{dateLabel(ticket.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className={`${ui.card} p-5 text-sm text-neutral-600`}>
          За поточними фільтрами заявки не знайдено.
        </div>
      ) : null}
    </div>
  );
}

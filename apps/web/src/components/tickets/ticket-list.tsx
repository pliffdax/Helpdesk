import Link from "next/link";
import { ui } from "@/components/ui/ui";

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

type Ticket = {
  id: string;
  title: string;
  category: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  createdAt: string;
  author: string;
};

const MOCK: Ticket[] = [
  {
    id: "TCK-1001",
    title: "Не працює вхід",
    category: "Auth",
    status: "open",
    priority: "high",
    createdAt: "2026-03-02",
    author: "User A",
  },
  {
    id: "TCK-1002",
    title: "Помилка на сторінці профілю",
    category: "UI",
    status: "in_progress",
    priority: "medium",
    createdAt: "2026-03-03",
    author: "User B",
  },
  {
    id: "TCK-1003",
    title: "Запит на нову категорію",
    category: "Requests",
    status: "resolved",
    priority: "low",
    createdAt: "2026-03-01",
    author: "User C",
  },
];

function badge(status: TicketStatus) {
  switch (status) {
    case "open":
      return "bg-sky-50 text-sky-700 border-sky-100";
    case "in_progress":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "resolved":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "closed":
      return "bg-neutral-100 text-neutral-700 border-neutral-200";
  }
}

function label(status: TicketStatus) {
  switch (status) {
    case "open":
      return "Open";
    case "in_progress":
      return "In progress";
    case "resolved":
      return "Resolved";
    case "closed":
      return "Closed";
  }
}

export function TicketList() {
  return (
    <div className="grid gap-4">
      <div className={`${ui.card} p-4`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <input
              placeholder="Пошук по назві..."
              className={`w-full sm:w-72 ${ui.input}`}
            />
            <select className={ui.select} defaultValue="">
              <option value="">Статус: всі</option>
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select className={ui.select} defaultValue="">
              <option value="">Пріоритет: всі</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="text-sm text-neutral-600">
            Всього:{" "}
            <span className="font-medium text-neutral-900">{MOCK.length}</span>
          </div>
        </div>
      </div>

      {/* Mobile: cards */}
      <div className="grid gap-3 md:hidden">
        {MOCK.map((t) => (
          <Link
            key={t.id}
            href={`/tickets/${encodeURIComponent(t.id)}`}
            className={`${ui.card} p-4 hover:shadow-md transition`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-neutral-500">{t.id}</div>
                <div className="mt-1 font-medium">{t.title}</div>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${badge(
                  t.status,
                )}`}
              >
                {label(t.status)}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="text-neutral-600">Категорія</div>
              <div className="text-neutral-900">{t.category}</div>
              <div className="text-neutral-600">Пріоритет</div>
              <div className="text-neutral-900">{t.priority}</div>
              <div className="text-neutral-600">Автор</div>
              <div className="text-neutral-900">{t.author}</div>
              <div className="text-neutral-600">Дата</div>
              <div className="text-neutral-900">{t.createdAt}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: table */}
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
                <th className="px-4 py-3 text-left font-medium">Дата</th>
              </tr>
            </thead>
            <tbody>
              {MOCK.map((t) => (
                <tr
                  key={t.id}
                  className="border-t hover:bg-neutral-50 transition"
                >
                  <td className="px-4 py-3">
                    <Link
                      className="font-medium hover:underline"
                      href={`/tickets/${encodeURIComponent(t.id)}`}
                    >
                      {t.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-900">{t.title}</td>
                  <td className="px-4 py-3 text-neutral-700">{t.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badge(
                        t.status,
                      )}`}
                    >
                      {label(t.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{t.priority}</td>
                  <td className="px-4 py-3 text-neutral-700">{t.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { ui } from "@/components/ui/ui";
import type {
  Category,
  Ticket,
  TicketPriority,
  TicketStatus,
} from "@/lib/helpdesk-api";

type FormState = {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  categoryId: string;
};

export function TicketActions({
  ticket,
  categories,
  apiBaseUrl,
}: {
  ticket: Ticket;
  categories: Category[];
  apiBaseUrl: string;
}) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    categoryId: String(ticket.categoryId),
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateTicket(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          status: form.status,
          priority: form.priority,
          categoryId: Number(form.categoryId),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? "Не вдалося оновити заявку");
      }

      setMessage("Зміни збережено");
      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : "Сталася помилка",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteTicket() {
    const confirmed = window.confirm("Видалити цю заявку?");
    if (!confirmed) return;

    setDeleting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/tickets/${ticket.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? "Не вдалося видалити заявку");
      }

      router.push("/tickets");
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Сталася помилка",
      );
      setDeleting(false);
    }
  }

  return (
    <form className={`grid gap-4 ${ui.card} p-5`} onSubmit={updateTicket}>
      <div>
        <h2 className="font-medium">Керування заявкою</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Через цю форму можна перевірити PATCH і DELETE без Postman.
        </p>
      </div>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Назва</span>
        <input
          className={ui.input}
          value={form.title}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              title: event.target.value,
            }))
          }
          placeholder="Введи назву заявки"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Опис</span>
        <textarea
          className={`${ui.input} min-h-28 resize-y px-4 pt-3 pb-3 leading-6`}
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          placeholder="Введи опис заявки"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Статус</span>
        <select
          className={ui.select}
          value={form.status}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              status: event.target.value as TicketStatus,
            }))
          }
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Пріоритет</span>
        <select
          className={ui.select}
          value={form.priority}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              priority: event.target.value as TicketPriority,
            }))
          }
        >
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Категорія</span>
        <select
          className={ui.select}
          value={form.categoryId}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              categoryId: event.target.value,
            }))
          }
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      {message ? (
        <div className="text-sm text-emerald-700">{message}</div>
      ) : null}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className={ui.btnPrimary}
          disabled={saving || deleting}
        >
          {saving ? "Збереження..." : "Зберегти зміни"}
        </button>

        <button
          type="button"
          className={ui.btnDanger}
          disabled={saving || deleting}
          onClick={deleteTicket}
        >
          {deleting ? "Видалення..." : "Видалити"}
        </button>
      </div>
    </form>
  );
}

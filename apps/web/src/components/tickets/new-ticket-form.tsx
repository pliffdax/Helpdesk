"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "@/components/ui/ui";
import type { Category, User } from "@/lib/helpdesk-api";

type FormState = {
  title: string;
  description: string;
  categoryId: string;
  creatorId: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

export function NewTicketForm({
  categories,
  users,
  apiBaseUrl,
}: {
  categories: Category[];
  users: User[];
  apiBaseUrl: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    categoryId: categories[0] ? String(categories[0].id) : "",
    creatorId: users[0] ? String(users[0].id) : "",
    priority: "MEDIUM",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          categoryId: Number(form.categoryId),
          creatorId: Number(form.creatorId),
          priority: form.priority,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? "Не вдалося створити заявку");
      }

      const payload = (await response.json()) as { data: { id: number } };
      router.push(`/tickets/${payload.data.id}`);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Сталася помилка",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={`mt-6 grid gap-4 ${ui.card} p-5`} onSubmit={onSubmit}>
      <label className="grid gap-1">
        <span className="text-sm font-medium">Назва</span>
        <input
          className={ui.input}
          value={form.title}
          onChange={(event) =>
            setForm((current) => ({ ...current, title: event.target.value }))
          }
          required
        />
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
          required
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Автор</span>
        <select
          className={ui.select}
          value={form.creatorId}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              creatorId: event.target.value,
            }))
          }
          required
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </option>
          ))}
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
              priority: event.target.value as FormState["priority"],
            }))
          }
        >
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Опис</span>
        <textarea
          className={`${ui.input} min-h-28 resize-y pt-3 leading-6`}
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          required
        />
      </label>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="flex gap-2">
        <button type="submit" className={ui.btnPrimary} disabled={loading}>
          {loading ? "Створення..." : "Створити"}
        </button>
        <button
          type="button"
          className={ui.btnSecondary}
          onClick={() =>
            setForm({
              title: "",
              description: "",
              categoryId: categories[0] ? String(categories[0].id) : "",
              creatorId: users[0] ? String(users[0].id) : "",
              priority: "MEDIUM",
            })
          }
        >
          Очистити
        </button>
      </div>
    </form>
  );
}

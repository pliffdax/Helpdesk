"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "@/components/ui/ui";
import type { User, UserRole } from "@/lib/helpdesk-api";

type FormState = {
  name: string;
  email: string;
  role: UserRole;
};

export function UserManager({
  users,
  apiBaseUrl
}: {
  users: User[];
  apiBaseUrl: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    role: "USER"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "Не вдалося створити користувача");
      }

      setForm({
        name: "",
        email: "",
        role: "USER"
      });
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Сталася помилка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className={`${ui.card} overflow-hidden`}>
        <div className="border-b px-5 py-4">
          <h2 className="font-medium">Список користувачів</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Дані з таблиці users, які використовуються при створенні заявок.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Ім'я</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Роль</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-3 text-neutral-700">{user.id}</td>
                  <td className="px-4 py-3 text-neutral-900">{user.name}</td>
                  <td className="px-4 py-3 text-neutral-700">{user.email}</td>
                  <td className="px-4 py-3 text-neutral-700">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form className={`grid gap-4 ${ui.card} p-5`} onSubmit={onSubmit}>
        <div>
          <h2 className="font-medium">Новий користувач</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Простий інтерфейс для перевірки POST /api/users.
          </p>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Ім'я</span>
          <input
            className={ui.input}
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            className={ui.input}
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Роль</span>
          <select
            className={ui.select}
            value={form.role}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                role: event.target.value as UserRole
              }))
            }
          >
            <option value="USER">USER</option>
            <option value="AGENT">AGENT</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button type="submit" className={ui.btnPrimary} disabled={loading}>
          {loading ? "Створення..." : "Створити користувача"}
        </button>
      </form>
    </div>
  );
}

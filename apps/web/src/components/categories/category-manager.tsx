"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "@/components/ui/ui";
import type { Category } from "@/lib/helpdesk-api";

export function CategoryManager({
  categories,
  apiBaseUrl
}: {
  categories: Category[];
  apiBaseUrl: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "Не вдалося створити категорію");
      }

      setName("");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Сталася помилка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className={`${ui.card} p-5`}>
            <div className="text-sm text-neutral-500">CAT-{String(category.id).padStart(3, "0")}</div>
            <div className="mt-2 text-base font-semibold">{category.name}</div>
            <div className="mt-3 text-sm text-neutral-600">
              Заявок у категорії: <span className="font-medium text-neutral-900">{category.ticketsCount ?? 0}</span>
            </div>
          </div>
        ))}
      </div>

      <form className={`grid gap-4 ${ui.card} p-5`} onSubmit={onSubmit}>
        <div>
          <h2 className="font-medium">Нова категорія</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Дає швидку перевірку POST /api/categories та оновлення списку.
          </p>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Назва категорії</span>
          <input
            className={ui.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Наприклад, Billing"
            required
          />
        </label>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button type="submit" className={ui.btnPrimary} disabled={loading}>
          {loading ? "Створення..." : "Створити категорію"}
        </button>
      </form>
    </div>
  );
}

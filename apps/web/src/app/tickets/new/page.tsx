import Link from "next/link";
import { ui } from "@/components/ui/ui";
import { NewTicketForm } from "@/components/tickets/new-ticket-form";
import { getCategories, getPublicApiBaseUrl, getUsers } from "@/lib/helpdesk-api";

export const dynamic = "force-dynamic";

export default async function NewTicketPage() {
  const [categories, users] = await Promise.all([getCategories(), getUsers()]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Нова заявка</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Форма створення звернення з відправкою до Fastify API.
          </p>
        </div>
        <Link href="/tickets" className={ui.btnSecondary}>
          Назад
        </Link>
      </div>

      <NewTicketForm
        categories={categories}
        users={users}
        apiBaseUrl={getPublicApiBaseUrl()}
      />
    </div>
  );
}

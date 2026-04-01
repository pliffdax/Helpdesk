import Link from "next/link";
import { TicketList } from "@/components/tickets/ticket-list";
import { ui } from "@/components/ui/ui";
import { getTickets } from "@/lib/helpdesk-api";

export const dynamic = "force-dynamic";

export default async function TicketsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;
  const status = typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : undefined;
  const priority = typeof resolvedSearchParams.priority === "string" ? resolvedSearchParams.priority : undefined;

  const tickets = await getTickets({ search, status, priority });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Заявки</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Повний список звернень з фільтрацією, переходом у деталі та керуванням через PostgreSQL API.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/tickets/new" className={ui.btnPrimary}>
            Нова заявка
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <TicketList tickets={tickets} filters={{ search, status, priority }} />
      </div>
    </div>
  );
}

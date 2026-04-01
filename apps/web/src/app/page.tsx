import Link from "next/link";
import { getDashboardStats } from "@/lib/helpdesk-api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const stats = await getDashboardStats();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-neutral-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Helpdesk / PostgreSQL + Prisma + Fastify
            </div>

            <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              Helpdesk для лабораторної: жива база, API-маршрути та робочий frontend
            </h1>

            <p className="mt-3 text-neutral-600">
              Система демонструє зв&apos;язок між таблицями users, categories і tickets,
              підтримує CRUD для заявок та дає окремі сторінки для перевірки API безпосередньо з UI.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/tickets/new"
                className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
              >
                Створити заявку
              </Link>

              <Link
                href="/tickets"
                className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-neutral-50"
              >
                Перейти до заявок
              </Link>
            </div>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 md:w-[26rem]">
            <StatCard value={stats.tickets} label="Усього заявок" />
            <StatCard value={stats.openTickets} label="Відкритих заявок" />
            <StatCard value={stats.categories} label="Категорій" />
            <StatCard value={stats.users} label="Користувачів" />
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Що вже можна показати на захисті</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            title="Заявки"
            desc="Список, фільтри, перегляд деталей, зміна статусу та видалення."
            href="/tickets"
          />
          <FeatureCard
            title="Нова заявка"
            desc="Форма створення з підстановкою реальних users і categories."
            href="/tickets/new"
          />
          <FeatureCard
            title="Категорії"
            desc="Окрема сторінка довідника та додавання нових категорій."
            href="/categories"
          />
          <FeatureCard
            title="Користувачі"
            desc="Перегляд таблиці users і швидка форма для POST /api/users."
            href="/users"
          />
        </div>
      </section>

      <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Як працює схема даних</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <StepCard
            step="1"
            title="User"
            desc="Один користувач може створити багато заявок, тому між users і tickets реалізовано One-to-Many."
          />
          <StepCard
            step="2"
            title="Category"
            desc="Кожна заявка належить до однієї категорії, а категорія містить багато заявок."
          />
          <StepCard
            step="3"
            title="Ticket"
            desc="У заявці зберігаються title, description, status, priority і зовнішні ключі на автора та категорію."
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border bg-neutral-50 p-5">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-neutral-600">{label}</div>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  href
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="text-base font-semibold">{title}</div>
      <p className="mt-2 text-sm text-neutral-600">{desc}</p>
    </Link>
  );
}

function StepCard({
  step,
  title,
  desc
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border bg-neutral-50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold text-white">
          {step}
        </div>
        <div className="text-base font-semibold">{title}</div>
      </div>
      <p className="mt-3 text-sm text-neutral-600">{desc}</p>
    </div>
  );
}

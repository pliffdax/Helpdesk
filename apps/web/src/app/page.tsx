import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-neutral-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Ticket system / Helpdesk
            </div>

            <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              Підтримка без хаосу: заявки, статуси, категорії — в одному місці
            </h1>

            <p className="mt-3 text-neutral-600">
              Helpdesk допомагає фіксувати звернення користувачів, не губити
              важливе та прозоро відстежувати прогрес: від створення заявки до
              закриття.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/tickets/new"
                className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 transition"
              >
                Створити заявку
              </Link>

              <Link
                href="/tickets"
                className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 transition"
              >
                Перейти до заявок
              </Link>
            </div>

            <div className="mt-4 text-xs text-neutral-500">
              У поточній лабораторній реалізовано UI та адаптивність.
              Backend/авторизація — наступні етапи.
            </div>
          </div>

          <div className="w-full md:w-90">
            <div className="rounded-2xl border bg-neutral-50 p-5">
              <div className="text-sm font-medium">Що можна зробити зараз</div>

              <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-neutral-400" />
                  Відкрити список заявок
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-neutral-400" />
                  Переглянути деталі заявки
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-neutral-400" />
                  Створити заявку через форму
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-neutral-400" />
                  Перевірити адаптивне меню (бургер)
                </li>
              </ul>

              <div className="mt-4 rounded-xl border bg-white p-3 text-xs text-neutral-600">
                Порада: зроби скріни hero + mobile burger — це прям жирний плюс
                для ЛР.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Навіщо цей сервіс</h2>
        <p className="mt-2 text-neutral-600">
          Щоб звернення не губилися, а обробка була передбачуваною та прозорою.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Єдиний журнал звернень"
            desc="Заявки зібрані в одному місці: список, деталі, історія."
          />
          <FeatureCard
            title="Категорії та статуси"
            desc="Класифікація заявок і контроль прогресу (Open → Closed)."
          />
          <FeatureCard
            title="Адаптивний інтерфейс"
            desc="Зручно і на desktop, і на телефоні: бургер-меню та адаптивна верстка."
          />
        </div>
      </section>

      <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Як це працює</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <StepCard
            step="1"
            title="Створи заявку"
            desc="Опиши проблему або запит і обери категорію."
          />
          <StepCard
            step="2"
            title="Відстежуй статус"
            desc="Заявка рухається по статусах під час обробки."
          />
          <StepCard
            step="3"
            title="Закрий звернення"
            desc="Після вирішення заявка переходить у завершений стан."
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/tickets/new"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 transition"
          >
            Почати з заявки
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 transition"
          >
            Дізнатись більше
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="text-base font-semibold">{title}</div>
      <p className="mt-2 text-sm text-neutral-600">{desc}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  desc,
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

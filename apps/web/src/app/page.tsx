import Link from "next/link";
import { ui } from "@/components/ui/ui";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className={`${ui.card} ${ui.cardPad}`}>
        <h1 className="text-2xl font-semibold tracking-tight">Helpdesk</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Адаптивний інтерфейс для системи звернень: створення, перегляд,
          коментарі та статуси.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/tickets" className={ui.btnSecondary}>
            Перейти до заявок
          </Link>
          <Link href="/tickets/new" className={ui.btnPrimary}>
            Створити заявку
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ui } from "@/components/ui/ui";

export default function NewTicketPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Нова заявка</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Форма створення звернення (поки мок, потім підв’яжемо до API).
          </p>
        </div>
        <Link href="/tickets" className={ui.btnSecondary}>
          Назад
        </Link>
      </div>

      <form className={`mt-6 grid gap-4 ${ui.card} p-5`}>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Назва</span>
          <input className={ui.input} />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Категорія</span>
          <select className={ui.select}>
            <option>UI</option>
            <option>Auth</option>
            <option>Requests</option>
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Опис</span>
          <textarea className={ui.textarea} />
        </label>

        <div className="flex gap-2">
          <button type="button" className={ui.btnPrimary}>
            Створити
          </button>
          <button type="reset" className={ui.btnSecondary}>
            Очистити
          </button>
        </div>
      </form>
    </div>
  );
}

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Політика конфіденційності</h1>
      <p className="mt-2 text-neutral-600">
        Заглушка сторінки. Текст буде доповнений після реалізації автентифікації
        та збереження даних.
      </p>

      <ul className="mt-4 list-disc pl-5 text-neutral-700 space-y-1">
        <li>Мінімізуємо збирання персональних даних</li>
        <li>Дані заявок використовуються лише для обробки звернень</li>
        <li>Доступ до адміністративних функцій обмежується ролями</li>
        <li>
          Журнали та технічні метрики використовуються для покращення якості
          сервісу
        </li>
      </ul>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 transition"
        >
          На головну
        </Link>
      </div>
    </div>
  );
}

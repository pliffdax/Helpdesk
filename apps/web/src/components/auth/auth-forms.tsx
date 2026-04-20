"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ui } from "@/components/ui/ui";
import { loginUser, registerUser } from "@/lib/helpdesk-api";
import { storeSession } from "@/lib/auth";

type Mode = "login" | "register";

type FormState = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export function AuthForms({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "register" && form.password !== form.passwordConfirmation) {
        throw new Error("Паролі не збігаються");
      }

      const session =
        mode === "login"
          ? await loginUser({
              email: form.email,
              password: form.password,
            })
          : await registerUser({
              name: form.name,
              email: form.email,
              password: form.password,
              passwordConfirmation: form.passwordConfirmation,
            });

      storeSession(session);
      router.push("/profile");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Сталася помилка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`mx-auto max-w-md ${ui.card} p-6`}>
      <h1 className="text-2xl font-semibold">{mode === "login" ? "Вхід" : "Реєстрація"}</h1>
      <p className="mt-2 text-sm text-neutral-600">
        {mode === "login"
          ? "Увійдіть за email і паролем, щоб переглянути та редагувати свій профіль."
          : "Створіть обліковий запис користувача з підтвердженням пароля."}
      </p>

      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        {mode === "register" ? (
          <label className="grid gap-1">
            <span className="text-sm font-medium">Ім&apos;я</span>
            <input
              className={ui.input}
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </label>
        ) : null}

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
          <span className="text-sm font-medium">Пароль</span>
          <input
            type="password"
            className={ui.input}
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            required
            minLength={8}
          />
        </label>

        {mode === "register" ? (
          <label className="grid gap-1">
            <span className="text-sm font-medium">Підтвердження пароля</span>
            <input
              type="password"
              className={ui.input}
              value={form.passwordConfirmation}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  passwordConfirmation: event.target.value,
                }))
              }
              required
              minLength={8}
            />
          </label>
        ) : null}

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button type="submit" className={ui.btnPrimary} disabled={loading}>
          {loading
            ? mode === "login"
              ? "Вхід..."
              : "Реєстрація..."
            : mode === "login"
              ? "Увійти"
              : "Зареєструватися"}
        </button>
      </form>

      <div className="mt-4 text-sm text-neutral-600">
        {mode === "login" ? "Ще немає акаунта?" : "Вже є акаунт?"}{" "}
        <Link
          href={mode === "login" ? "/register" : "/login"}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {mode === "login" ? "Реєстрація" : "Увійти"}
        </Link>
      </div>
    </div>
  );
}

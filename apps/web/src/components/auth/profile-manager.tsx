"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "@/components/ui/ui";
import {
  changePassword,
  getCurrentUser,
  logoutUser,
  updateProfile,
} from "@/lib/helpdesk-api";
import { clearSession, getAccessToken, storeSession } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";

type ProfileFormState = {
  name: string;
  email: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

export function ProfileManager() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    name: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
  });
  const [loadingUser, setLoadingUser] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      clearSession();
      router.replace("/login");
      return;
    }

    getCurrentUser(token)
      .then(({ user: currentUser, session }) => {
        if (session) {
          storeSession(session);
        }

        setUser(currentUser);
        setProfileForm({
          name: currentUser.name,
          email: currentUser.email,
        });
      })
      .catch(() => {
        clearSession();
        router.replace("/login");
      })
      .finally(() => setLoadingUser(false));
  }, [router]);

  async function onProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getAccessToken();

    if (!token) {
      clearSession();
      router.replace("/login");
      return;
    }

    setProfileLoading(true);
    setError(null);
    setMessage(null);

    try {
      const session = await updateProfile(token, profileForm);
      storeSession(session);
      setUser(session.user);
      setMessage("Профіль оновлено");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Сталася помилка");
    } finally {
      setProfileLoading(false);
    }
  }

  async function onPasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getAccessToken();

    if (!token) {
      clearSession();
      router.replace("/login");
      return;
    }

    setPasswordLoading(true);
    setError(null);
    setMessage(null);

    try {
      const session = await changePassword(token, passwordForm);

      if (session) {
        storeSession(session);
      }

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        newPasswordConfirmation: "",
      });
      setMessage("Пароль змінено");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Сталася помилка");
    } finally {
      setPasswordLoading(false);
    }
  }

  async function onLogout() {
    const token = getAccessToken();

    try {
      if (token) {
        await logoutUser(token);
      }
    } finally {
      clearSession();
      router.push("/login");
      router.refresh();
    }
  }

  if (loadingUser) {
    return <div className="text-sm text-neutral-600">Завантаження профілю...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className={`${ui.card} p-5`}>
        <h1 className="text-2xl font-semibold">Профіль</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Захищена сторінка користувача з роллю, редагуванням профілю та зміною пароля.
        </p>

        <dl className="mt-6 grid gap-3 text-sm">
          <div>
            <dt className="text-neutral-500">Ім&apos;я</dt>
            <dd className="font-medium text-neutral-900">{user.name}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Email</dt>
            <dd className="font-medium text-neutral-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Роль</dt>
            <dd className="font-medium text-neutral-900">{user.role}</dd>
          </div>
        </dl>

        <button type="button" className={`${ui.btnSecondary} mt-6`} onClick={onLogout}>
          Вийти
        </button>
      </div>

      <div className="grid gap-6">
        <form className={`${ui.card} grid gap-4 p-5`} onSubmit={onProfileSubmit}>
          <div>
            <h2 className="font-medium">Оновити профіль</h2>
            <p className="mt-1 text-sm text-neutral-600">Змінює ім&apos;я та email поточного користувача.</p>
          </div>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Ім&apos;я</span>
            <input
              className={ui.input}
              value={profileForm.name}
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, name: event.target.value }))
              }
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              className={ui.input}
              value={profileForm.email}
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
          </label>

          <button type="submit" className={ui.btnPrimary} disabled={profileLoading}>
            {profileLoading ? "Оновлення..." : "Зберегти профіль"}
          </button>
        </form>

        <form className={`${ui.card} grid gap-4 p-5`} onSubmit={onPasswordSubmit}>
          <div>
            <h2 className="font-medium">Змінити пароль</h2>
            <p className="mt-1 text-sm text-neutral-600">Потрібен поточний пароль і підтвердження нового.</p>
          </div>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Поточний пароль</span>
            <input
              type="password"
              className={ui.input}
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  currentPassword: event.target.value,
                }))
              }
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Новий пароль</span>
            <input
              type="password"
              className={ui.input}
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  newPassword: event.target.value,
                }))
              }
              required
              minLength={8}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Підтвердження нового пароля</span>
            <input
              type="password"
              className={ui.input}
              value={passwordForm.newPasswordConfirmation}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  newPasswordConfirmation: event.target.value,
                }))
              }
              required
              minLength={8}
            />
          </label>

          <button type="submit" className={ui.btnPrimary} disabled={passwordLoading}>
            {passwordLoading ? "Зміна..." : "Змінити пароль"}
          </button>
        </form>

        {message ? <div className="text-sm text-emerald-700">{message}</div> : null}
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
      </div>
    </div>
  );
}

import {
  AUTH_COOKIE_NAME,
  AUTH_REFRESH_COOKIE_NAME,
  AUTH_ROLE_COOKIE_NAME,
  AUTH_STORAGE_KEY,
} from "@/lib/auth-constants";

export { AUTH_COOKIE_NAME, AUTH_REFRESH_COOKIE_NAME, AUTH_ROLE_COOKIE_NAME, AUTH_STORAGE_KEY };

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "AGENT" | "ADMIN";
  createdAt?: string;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function emitAuthChange() {
  window.dispatchEvent(new Event("helpdesk-auth-change"));
}

export function getStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthSession;
  } catch {
    return null;
  }
}

export function storeSession(session: AuthSession) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  setCookie(AUTH_COOKIE_NAME, session.accessToken, 60 * 15);
  setCookie(AUTH_ROLE_COOKIE_NAME, session.user.role, 60 * 60 * 8);
  emitAuthChange();
}

export function clearSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  clearCookie(AUTH_COOKIE_NAME);
  clearCookie(AUTH_REFRESH_COOKIE_NAME);
  clearCookie(AUTH_ROLE_COOKIE_NAME);
  emitAuthChange();
}

export function getAccessToken() {
  return getStoredSession()?.accessToken ?? null;
}

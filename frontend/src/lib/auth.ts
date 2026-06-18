/**
 * Auth & API helper — integrasi nyata dengan backend Laravel Sanctum.
 * Token disimpan di localStorage; profil user disimpan lewat session helper lama
 * agar komponen yang membaca getSession() tetap berfungsi.
 */

import { setSession, clearSession, type AuthUser } from "./localStorage";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const TOKEN_KEY = "auth_token";

// ─── Token ──────────────────────────────────────────────────────────────────
export const getToken = (): string | null =>
  typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);

export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// ─── Core fetch ─────────────────────────────────────────────────────────────
interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  message: string;
  data: T | null;
  errors?: Record<string, string[]>;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResult<T>> {
  const token = getToken();
  const isForm = options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isForm && options.body) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    return { ok: false, status: 0, message: "Tidak dapat terhubung ke server.", data: null };
  }

  let json: Record<string, unknown> = {};
  try {
    json = await res.json();
  } catch {
    /* respons kosong */
  }

  return {
    ok: res.ok,
    status: res.status,
    message: String(json.message ?? (res.ok ? "OK" : "Terjadi kesalahan.")),
    data: (json.data as T) ?? null,
    errors: json.errors as Record<string, string[]> | undefined,
  };
}

// ─── Mapping user API → AuthUser (session lama) ──────────────────────────────
interface ApiUser {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: string;
}

function toAuthUser(u: ApiUser, punches = 0): AuthUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email ?? "",
    phone: u.phone,
    role: u.role === "barber" ? "barber" : "user",
    password: "",
    loyalty_punches: punches,
    created_at: new Date().toISOString().split("T")[0],
  };
}

// ─── Flows ──────────────────────────────────────────────────────────────────

/** Ambil profil user yang sedang login lalu simpan ke session. */
export async function loadMe(): Promise<AuthUser | null> {
  const res = await apiFetch<{ user: ApiUser; punch_card?: { punch_count: number } }>("/auth/me");
  if (!res.ok || !res.data?.user) return null;
  const user = toAuthUser(res.data.user, res.data.punch_card?.punch_count ?? 0);
  setSession(user);
  return user;
}

export async function login(phone: string, password: string): Promise<ApiResult<{ token: string }>> {
  const res = await apiFetch<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ phone, password }),
  });
  if (res.ok && res.data?.token) {
    setToken(res.data.token);
    await loadMe();
  }
  return res;
}

export async function register(payload: {
  name: string;
  phone: string;
  email?: string;
  password: string;
  password_confirmation: string;
}): Promise<ApiResult<{ token: string }>> {
  const res = await apiFetch<{ token: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (res.ok && res.data?.token) {
    setToken(res.data.token);
    await loadMe();
  }
  return res;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    /* abaikan */
  }
  clearToken();
  clearSession();
}

/** Pesan error pertama dari respons validasi Laravel, atau message umum. */
export function firstError(res: ApiResult): string {
  if (res.errors) {
    const first = Object.values(res.errors)[0];
    if (first?.[0]) return first[0];
  }
  return res.message;
}

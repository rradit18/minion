/**
 * localStorage Helper
 * Semua baca/tulis session, booking, dan user data lewat sini
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "barber";
  password: string;
  loyalty_punches: number;
  created_at: string;
}

export interface BookingData {
  id: string;
  branch_id: string;
  branch_name: string;
  barber_id: string;
  barber_name: string;
  service_id: string;
  service_name: string;
  date: string;
  time: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  price: number;
  promo_code?: string;
  discount?: number;
  final_price: number;
  status: "Upcoming" | "Selesai" | "Dibatalkan";
  rating?: number;
  rating_comment?: string;
  created_at: string;
  hair_style?: string;
}

const KEYS = {
  SESSION:  "auth_session",
  USERS:    "auth_users",
  BOOKINGS: "user_bookings",
  PROMO:    "active_promo",
  PREFILL:  "booking_prefill",
} as const;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const getSession = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEYS.SESSION);
  return raw ? JSON.parse(raw) : null;
};

export const setSession = (user: AuthUser) => {
  localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(KEYS.SESSION);
};

export const isLoggedIn = (): boolean => !!getSession();

export const hasRole = (role: AuthUser["role"]): boolean => {
  return getSession()?.role === role;
};

// ─── User List (register/login) ───────────────────────────────────────────────

export const getUsers = (): AuthUser[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEYS.USERS);
  const stored: AuthUser[] = raw ? JSON.parse(raw) : [];

  // Seed default accounts jika belum ada
  const defaults: AuthUser[] = [
    { id: "user-003", name: "Pelanggan Demo", email: "user@minion.com",  phone: "081234567892", role: "user",   password: "user123",   loyalty_punches: 7,  created_at: "2026-01-01" },
    { id: "user-004", name: "Hendra Barber",  email: "barber@minion.com",phone: "081234567893", role: "barber", password: "barber123", loyalty_punches: 0,  created_at: "2026-01-01" },
  ];

  const merged = [...defaults];
  stored.forEach((u) => {
    if (!merged.find((d) => d.email === u.email)) merged.push(u);
  });
  return merged;
};

export const saveUser = (user: AuthUser) => {
  const users = getUsers().filter((u) => u.email !== user.email);
  localStorage.setItem(KEYS.USERS, JSON.stringify([...users, user]));
};

export const findUserByEmail = (email: string): AuthUser | undefined =>
  getUsers().find((u) => u.email === email);

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const getBookings = (): BookingData[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEYS.BOOKINGS);
  return raw ? JSON.parse(raw) : [];
};

export const saveBooking = (booking: BookingData) => {
  const bookings = getBookings();
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([...bookings, booking]));
};

export const updateBooking = (id: string, updates: Partial<BookingData>) => {
  const bookings = getBookings().map((b) =>
    b.id === id ? { ...b, ...updates } : b
  );
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
};

export const getLastBooking = (): BookingData | null => {
  const bookings = getBookings();
  return bookings.length > 0 ? bookings[bookings.length - 1] : null;
};

export const getUpcomingBookings = (): BookingData[] => {
  const today = new Date().toISOString().split("T")[0];
  return getBookings().filter(
    (b) => b.status === "Upcoming" && b.date >= today
  );
};

// ─── Promo & Prefill ──────────────────────────────────────────────────────────

export const setActivePromo = (code: string) => {
  sessionStorage.setItem(KEYS.PROMO, code);
};

export const getActivePromo = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(KEYS.PROMO);
};

export const clearActivePromo = () => {
  sessionStorage.removeItem(KEYS.PROMO);
};

export const setBookingPrefill = (data: Partial<BookingData>) => {
  sessionStorage.setItem(KEYS.PREFILL, JSON.stringify(data));
};

export const getBookingPrefill = (): Partial<BookingData> | null => {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEYS.PREFILL);
  return raw ? JSON.parse(raw) : null;
};

export const clearBookingPrefill = () => {
  sessionStorage.removeItem(KEYS.PREFILL);
};

// ─── Loyalty ──────────────────────────────────────────────────────────────────

export const getLoyaltyPunches = (): number => {
  const user = getSession();
  if (!user) return 0;
  const completedBookings = getBookings().filter(
    (b) => b.status === "Selesai"
  ).length;
  return completedBookings + (user.loyalty_punches ?? 0);
};

export const getLoyaltyRewardCode = (): string | null => {
  const punches = getLoyaltyPunches();
  if (punches >= 10) return "LOYALTY50K";
  return null;
};

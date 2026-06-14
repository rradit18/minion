/**
 * Mock Data Loader
 * Swap-ready: ganti fungsi fetchX() dengan API call nyata tanpa ubah struktur komponen
 */

import branchesData    from "@/src/mocks/branches.json";
import barbersData     from "@/src/mocks/barbers.json";
import servicesData    from "@/src/mocks/services.json";
import slotsData       from "@/src/mocks/slots.json";
import promosData      from "@/src/mocks/promos.json";
import ratingsData     from "@/src/mocks/ratings.json";
import scheduleData    from "@/src/mocks/barber-schedule.json";
import hairStylesData  from "@/src/mocks/hair-styles.json";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  maps_url: string;
  hours: string;
  days: string;
  image: string;
  rating: number;
  total_reviews: number;
}

export interface Barber {
  id: string;
  name: string;
  nickname: string;
  specialty: string;
  bio: string;
  rating: number;
  total_reviews: number;
  experience_years: number;
  image: string;
  color: string;
  branch_ids: string[];
  available_days: string[];
  skills: string[];
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  duration_minutes: number;
  icon: string;
  prices: Record<string, number>;
}

export interface Promo {
  id: string;
  code: string;
  title: string;
  description: string;
  type: string;
  value: number;
  min_transaction: number;
  max_discount: number;
  valid_from: string;
  valid_until: string;
  applicable_services: string[];
  applicable_branches: string[];
  image: string;
  is_active: boolean;
  terms: string[];
}

export interface HairStyle {
  id: string;
  name: string;
  description: string;
  suitable_for: string[];
  difficulty: string;
  maintenance: string;
  image: string;
  tags: string[];
  recommended_services: string[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
  bulan: string;
}

// ─── Fetchers (swap dengan API call di sini) ─────────────────────────────────

export const fetchBranches   = (): Branch[]    => branchesData as Branch[];
export const fetchBarbers    = (): Barber[]    => barbersData as Barber[];
export const fetchServices   = (): Service[]   => servicesData as Service[];
export const fetchPromos     = (): Promo[]     => promosData as Promo[];
export const fetchHairStyles = (): HairStyle[] => hairStylesData as HairStyle[];
export const fetchSlots      = ()              => slotsData;
export const fetchRatings    = ()              => ratingsData;
export const fetchSchedule   = ()              => scheduleData;

export const fetchBarbersByBranch = (branchId: string): Barber[] =>
  barbersData.filter((b) => b.branch_ids.includes(branchId)) as Barber[];

export const fetchServicePrice = (serviceId: string, branchId: string): number => {
  const svc = (servicesData as Service[]).find((s) => s.id === serviceId);
  return svc?.prices[branchId] ?? 0;
};

export const fetchPromoByCode = (code: string): Promo | undefined =>
  promosData.find((p) => p.code === code && p.is_active) as Promo | undefined;

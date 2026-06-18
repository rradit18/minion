const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  const json = await res.json();
  return json.data as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiService {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  default_price: number;
}

export interface ApiBarber {
  id: string;
  name: string;
  slug: string;
  photo_url: string | null;
  tagline: string | null;
  signature_color: string | null;
  avg_rating: number;
  branches: { id: string; name: string; slug: string }[];
}

export interface ApiBranch {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  opening_time: string;
  closing_time: string;
  google_maps_url: string | null;
  image_url: string | null;
  is_active: boolean;
}

export interface ApiGalleryItem {
  id: string;
  title: string | null;
  image_url: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  category_label: string | null;
  price: number;
  image_url: string | null;
  best_seller: boolean;
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export const fetchServices = () => get<ApiService[]>('/services');
export const fetchBarbers  = () => get<ApiBarber[]>('/barbers');
export const fetchBranches = () => get<ApiBranch[]>('/branches');
export const fetchGallery  = () => get<ApiGalleryItem[]>('/gallery');
export const fetchProducts = () => get<ApiProduct[]>('/products');

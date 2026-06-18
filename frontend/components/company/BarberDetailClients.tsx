"use client";

import Link from 'next/link';

interface BarberReview {
  stars: number;
  comment: string | null;
  reviewer: string;
  created_at: string;
}

export interface ApiBarberDetail {
  id: string;
  name: string;
  slug: string;
  photo_url: string | null;
  bio: string | null;
  tagline: string | null;
  signature_color: string | null;
  specializations: string[] | null;
  instagram: string | null;
  tiktok: string | null;
  branches: { id: string; name: string; slug: string }[];
  rating: { avg: number; total: number; distribution: Record<string, number> };
  recent_reviews: BarberReview[];
}

export interface OtherBarber {
  id: string;
  name: string;
  slug: string;
  photo_url: string | null;
  tagline: string | null;
  signature_color: string | null;
  avg_rating?: number;
}

interface Props {
  barber: ApiBarberDetail;
  otherBarbers: OtherBarber[];
}

const COLOR_BG: Record<string, string> = {
  teal:   "bg-teal-500",
  yellow: "bg-yellow-400",
  coral:  "bg-orange-400",
  violet: "bg-purple-400",
};

const COLOR_RING: Record<string, string> = {
  teal:   "ring-teal-400",
  yellow: "ring-yellow-400",
  coral:  "ring-orange-400",
  violet: "ring-purple-400",
};

function SocialBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid place-items-center w-10 h-10 rounded-full bg-white text-[#1a1a1a] shadow-md ring-1 ring-black/5 hover:bg-[#1a1a1a] hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}

function StarRating({ avg }: { avg: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i <= Math.round(avg) ? "text-[#F9C74F]" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function BarberDetailClients({ barber, otherBarbers }: Props) {
  const accent = COLOR_BG[barber.signature_color ?? ""] ?? "bg-gray-500";
  const ring   = COLOR_RING[barber.signature_color ?? ""] ?? "ring-gray-400";

  const parts     = barber.name.split(' ');
  const firstName = parts[0];
  const lastName  = parts.slice(1).join(' ');

  const location  = barber.branches[0]?.name ?? "Minion Barbershop";
  const avgRating = barber.rating?.avg ?? 0;
  const totalReviews = barber.rating?.total ?? 0;

  return (
    <div className="bg-[#FAF7EE] min-h-screen font-sans text-[#1a1a1a]">

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-6 pt-8 md:pt-12 pb-12">
        <p className="text-center lg:text-left text-sm font-semibold text-gray-400 mb-4">Hai, kenalin gue —</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,380px)_1fr] gap-10 lg:gap-6 items-center">

          {/* LEFT — nama + bio + CTA */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h1 className="font-black leading-[0.92] tracking-tight text-5xl sm:text-6xl">
              <span className="block text-[#1a1a1a]">{firstName}</span>
              {lastName && (
                <span className="block text-transparent" style={{ WebkitTextStroke: "1.5px #1a1a1a" }}>
                  {lastName}
                </span>
              )}
            </h1>
            {barber.tagline && (
              <p className="mt-3 text-sm font-semibold text-[#178E81] uppercase tracking-widest">{barber.tagline}</p>
            )}
            <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto lg:mx-0">
              {barber.bio ?? `Barber profesional di ${location}.`}
            </p>
            <div className="mt-3 flex items-center gap-2 justify-center lg:justify-start text-sm">
              <StarRating avg={avgRating} />
              <span className="font-bold text-[#1a1a1a]">{avgRating.toFixed(1)}</span>
              <span className="text-gray-400">({totalReviews} ulasan)</span>
            </div>
            <Link
              href={`/booking?barber=${barber.slug}`}
              className="mt-7 inline-flex items-center gap-2 bg-[#F9C74F] text-[#1a1a1a] font-bold text-sm pl-6 pr-2 py-2 rounded-full hover:bg-yellow-400 transition group"
            >
              Booking Sekarang
              <span className="grid place-items-center w-9 h-9 rounded-full bg-[#1a1a1a] text-white transition-transform group-hover:rotate-45">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                </svg>
              </span>
            </Link>
          </div>

          {/* CENTER — foto + sosial */}
          <div className="order-1 lg:order-2 relative mx-auto w-full max-w-[340px]">
            <div className="relative rounded-[28px] overflow-hidden aspect-[3/4] bg-gray-100 shadow-xl">
              <div className={`absolute inset-x-0 bottom-0 h-3/4 ${accent} opacity-90`} />
              {barber.photo_url ? (
                <img
                  src={barber.photo_url}
                  alt={barber.name}
                  className="relative z-10 w-full h-full object-cover object-top"
                />
              ) : (
                <div className="relative z-10 w-full h-full flex items-end justify-center pb-8">
                  <span className="text-white/30 text-8xl font-black">{firstName[0]}</span>
                </div>
              )}
            </div>

            {/* Sosial */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5">
              {barber.instagram && (
                <SocialBtn href={`https://instagram.com/${barber.instagram.replace('@', '')}`} label="Instagram">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                </SocialBtn>
              )}
              {barber.tiktok && (
                <SocialBtn href={`https://tiktok.com/@${barber.tiktok.replace('@', '')}`} label="TikTok">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.08a8.15 8.15 0 004.77 1.53V7.17a4.87 4.87 0 01-1-.48z"/>
                  </svg>
                </SocialBtn>
              )}
            </div>

            {/* Badge lokasi */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 bg-white rounded-full shadow-lg ring-1 ring-black/5 px-4 py-2 flex items-center gap-2 whitespace-nowrap">
              <svg className="w-3.5 h-3.5 text-[#178E81] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-bold text-[#1a1a1a]">{location}</span>
            </div>
          </div>

          {/* RIGHT — statistik */}
          <div className="order-3 text-center lg:text-right space-y-4">
            <div>
              <p className="text-4xl font-black text-[#1a1a1a]">{avgRating.toFixed(1)}</p>
              <StarRating avg={avgRating} />
              <p className="text-xs text-gray-400 mt-1">{totalReviews} ulasan</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#1a1a1a]">{barber.branches.length}</p>
              <p className="text-xs text-gray-400">Cabang Aktif</p>
            </div>
            {(barber.specializations ?? []).length > 0 && (
              <div>
                <p className="text-2xl font-black text-[#1a1a1a]">{(barber.specializations ?? []).length}</p>
                <p className="text-xs text-gray-400">Spesialisasi</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SPESIALISASI & CTA ── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className={`grid grid-cols-1 ${(barber.specializations ?? []).length > 0 ? 'lg:grid-cols-2' : ''} gap-5`}>

          {(barber.specializations ?? []).length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="grid place-items-center w-9 h-9 rounded-xl bg-[#178E81]/10 text-[#178E81]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 5 5.6.8-4 3.9 1 5.6L12 19.6 6.9 22l1-5.6-4-3.9 5.6-.8z" />
                  </svg>
                </span>
                <h3 className="text-[11px] font-extrabold tracking-[3px] uppercase text-[#178E81]">Spesialisasi</h3>
              </div>
              <ul className="space-y-1">
                {(barber.specializations ?? []).map((s, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#FAF7EE] transition-colors">
                    <span className="grid place-items-center w-6 h-6 rounded-full bg-gradient-to-br from-[#F9C74F] to-[#f0b21f] shadow-sm flex-shrink-0">
                      <svg className="w-3 h-3 text-[#1a1a1a]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm font-semibold text-[#1a1a1a]">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] p-7 flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "url(/ui/pattern.png)" }} />
            <div className="relative z-10 flex flex-col items-center">
              <span className="grid place-items-center w-14 h-14 rounded-2xl bg-[#F9C74F]/15 ring-1 ring-[#F9C74F]/30 text-[#F9C74F] mb-4">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <h3 className="text-white font-bold text-base leading-snug mb-1.5">
                Mau cukuran keren dari <span className="text-[#F9C74F]">{firstName}</span>?
              </h3>
              <p className="text-white/50 text-xs leading-relaxed max-w-[220px] mb-5">
                Slot terbatas tiap harinya. Amankan jadwalmu sebelum keduluan orang.
              </p>
              <Link
                href={`/booking?barber=${barber.slug}`}
                className="inline-flex items-center gap-2 bg-[#F9C74F] hover:bg-yellow-400 text-[#1a1a1a] text-sm font-extrabold px-6 py-3 rounded-xl transition-colors group"
              >
                Book Now <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ULASAN TERBARU ── */}
      {barber.recent_reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[#178E81] text-[11px] font-extrabold tracking-[3px] uppercase">Ulasan Pelanggan</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {barber.recent_reviews.map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <svg key={n} className={`w-3.5 h-3.5 ${n <= review.stars ? "text-[#F9C74F]" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                {review.comment ? (
                  <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-3">&ldquo;{review.comment}&rdquo;</p>
                ) : (
                  <p className="text-sm text-gray-400 italic mb-3">Tanpa komentar.</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1a1a1a]">{review.reviewer}</span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(review.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── BARBERMAN LAINNYA ── */}
      {otherBarbers.length > 0 && (
        <section className="bg-[#1a1a1a] mt-14 py-14 px-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-[#F9C74F] text-xs font-bold tracking-[3px] uppercase mb-2">Tim Kami</p>
            <h2 className="text-center text-3xl font-black mb-10">
              <span className="text-[#F9C74F]">Barberman</span> <span className="text-white">Lainnya</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {otherBarbers.map((b) => {
                const bAccent = COLOR_BG[b.signature_color ?? ""] ?? "bg-gray-500";
                const bRing   = COLOR_RING[b.signature_color ?? ""] ?? "ring-gray-400";
                return (
                  <Link
                    key={b.slug}
                    href={`/barberman/${b.slug}`}
                    className="bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div className="relative flex-shrink-0 w-16 h-16">
                      <div className={`absolute inset-0 rounded-full ${bAccent} scale-110`} />
                      {b.photo_url ? (
                        <img
                          src={b.photo_url}
                          alt={b.name}
                          className={`relative w-full h-full object-cover object-top rounded-full border-2 border-white ring-2 ${bRing}`}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className={`relative w-full h-full rounded-full border-2 border-white ring-2 ${bRing} ${bAccent} flex items-center justify-center`}>
                          <span className="text-white font-black text-lg">{b.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[15px] text-[#1a1a1a] leading-tight truncate">{b.name}</p>
                      {b.tagline && <p className="text-xs text-gray-500 mb-1 truncate">{b.tagline}</p>}
                      {b.avg_rating !== undefined && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-[#F9C74F]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          <span className="text-xs font-bold text-[#1a1a1a]">{b.avg_rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

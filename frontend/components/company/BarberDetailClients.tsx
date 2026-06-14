"use client";

import Link from 'next/link';
import AnimatedTooltip from '@/components/ui/AnimatedTooltip';

interface Props {
  barberName: string;
  barberSlug: string;
}

const ALL_BARBERS = [
  { slug: 'hendra',  name: 'Hendra Schevenko', role: 'Fade King',    badge: 'Fade Specialist',    rating: '4.9', reviewCount: '2300+', img: '/hendra.png',  color: 'bg-teal-400'   },
  { slug: 'juan',    name: 'Juan Samudra',      role: 'Sculptor',     badge: 'Classic Specialist',  rating: '4.9', reviewCount: '1800+', img: '/juan.png',    color: 'bg-purple-400' },
  { slug: 'yoga',    name: 'Yoga Harahap',      role: 'Sharpie',      badge: 'Line Up Expert',      rating: '4.8', reviewCount: '1500+', img: '/yoga.png',    color: 'bg-yellow-400' },
  { slug: 'bastian', name: 'Bastian Narendra',  role: 'The Artist',   badge: 'Color Specialist',    rating: '4.9', reviewCount: '2100+', img: '/bastian.png', color: 'bg-orange-400' },
];

const barberData: Record<string, {
  title: string; rating: number; reviewCount: string; location: string;
  quote: string; experience: string; clientReturns: string;
  speciality: string[]; tools: string[]; portfolio: string[];
  accent: string;
}> = {
  hendra: {
    title: "Top Rated", rating: 4.9, reviewCount: "2300+", location: "Jl. Pramuka",
    quote: "Fade yang sempurna bukan hanya soal teknik, tapi soal memahami karakter setiap pelanggan. Saya hadir untuk memastikan kamu pulang dengan percaya diri.",
    experience: "7th+ Pengalaman", clientReturns: "380 Client Returns",
    speciality: ["Skin Fade & Mid Fade", "High Taper", "Crew Cut", "Buzz Cut Presisi"],
    tools: ["Wahl Magic Clip", "Andis Fade Master", "Feather Artist Club", "Kamisori Shear"],
    portfolio: ["/gallery1.jpg", "/gallery2.png", "/gallery3.jpg", "/gallery4.png", "/gallery5.jpg", "/gallery6.png"],
    accent: "bg-teal-400",
  },
  juan: {
    title: "Top Rated", rating: 4.9, reviewCount: "1800+", location: "Kijang Kota",
    quote: "Setiap kepala punya cerita. Saya menciptakan potongan yang menonjolkan kepribadian dan memberikan kesan pertama yang tak terlupakan.",
    experience: "6th+ Pengalaman", clientReturns: "310 Client Returns",
    speciality: ["Classic Cut", "Modern Pompadour", "Textured Quiff", "Undercut Classic"],
    tools: ["Oster Fast Feed", "Wahl Senior", "Kamisori Scissors", "Straight Razor"],
    portfolio: ["/gallery7.jpg", "/gallery8.png", "/gallery9.jpg", "/gallery10.png", "/gallery11.jpg", "/gallery12.png"],
    accent: "bg-purple-400",
  },
  yoga: {
    title: "Rising Star", rating: 4.8, reviewCount: "1500+", location: "Bt. 9",
    quote: "Line up yang tajam adalah seni. Saya percaya detail kecil yang membuat perbedaan besar antara biasa dan luar biasa.",
    experience: "5th+ Pengalaman", clientReturns: "260 Client Returns",
    speciality: ["Line Up Tajam", "Hard Part Design", "Curly Hair Expert", "Mohawk & Faux Hawk"],
    tools: ["Andis T-Outliner", "Wahl Detailer", "Feather Razor", "Barber Comb Set"],
    portfolio: ["/gallery13.jpg", "/gallery14.png", "/gallery15.jpg", "/gallery16.png", "/gallery17.jpg", "/gallery18.png"],
    accent: "bg-yellow-400",
  },
  bastian: {
    title: "Top Rated", rating: 4.9, reviewCount: "2100+", location: "Jl. Ganet",
    quote: "Mengubah setiap potongan menjadi karya seni yang elit adalah passion. Saya tidak hanya memotong rambut, saya mendefinisikan identitas.",
    experience: "8th+ Pengalaman", clientReturns: "400 Client Returns",
    speciality: ["Skin Fade & Taper Fade", "Hard Part & Line Up", "Textured Crop", "Pompadour & Quiff"],
    tools: ["Wahl Senior Clipper", "Andis T Outliner", "Feather Razor", "Kamisori Shear"],
    portfolio: ["/gallery1.jpg", "/gallery2.png", "/gallery3.jpg", "/gallery4.png", "/gallery5.jpg", "/gallery6.png"],
    accent: "bg-orange-400",
  },
};

// ─── Social icons ───────────────────────────────────────────────────────────
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

export default function BarberDetailClients({ barberName, barberSlug }: Props) {
  const data = barberData[barberSlug] ?? barberData['bastian'];
  const self = ALL_BARBERS.find(b => b.slug === barberSlug);
  const others = ALL_BARBERS.filter(b => b.slug !== barberSlug);

  const parts = barberName.split(' ');
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');

  const clients = data.portfolio.slice(0, 4).map((img, i) => ({
    id: i, name: `Klien ${i + 1}`, designation: 'Happy Client', image: img,
  }));

  return (
    <div className="bg-[#FAF7EE] min-h-screen font-sans text-[#1a1a1a]">

      {/* ── HERO PORTFOLIO ── */}
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
            <p className="mt-5 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto lg:mx-0">
              Maestro {self?.badge?.toLowerCase()} di {data.location}. {data.experience}, dipercaya {data.clientReturns}.
            </p>
            <Link
              href="/booking"
              className="mt-7 inline-flex items-center gap-2 bg-[#F9C74F] text-[#1a1a1a] font-display font-bold text-sm pl-6 pr-2 py-2 rounded-full hover:bg-yellow-400 transition group"
            >
              Booking Sekarang
              <span className="grid place-items-center w-9 h-9 rounded-full bg-[#1a1a1a] text-white transition-transform group-hover:rotate-45">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                </svg>
              </span>
            </Link>
          </div>

          {/* CENTER — foto + sosial + badge */}
          <div className="order-1 lg:order-2 relative mx-auto w-full max-w-[340px]">
            <div className="relative rounded-[28px] overflow-hidden aspect-[3/4] bg-gray-100 shadow-xl">
              <div className={`absolute inset-x-0 bottom-0 h-3/4 ${data.accent} opacity-90`} />
              <img
                src={`/${barberSlug}.png`}
                alt={barberName}
                className="relative z-10 w-full h-full object-cover object-top"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>

            {/* Sosial mengambang di tepi kanan */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5">
              <SocialBtn href="https://instagram.com" label="Instagram">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </SocialBtn>
              <SocialBtn href="https://wa.me/6281260403854" label="WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
              </SocialBtn>
              <SocialBtn href="tel:+6281260403854" label="Telepon">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.5a1 1 0 01.95.68l1 3a1 1 0 01-.27 1.05l-1.5 1.3a14 14 0 006.05 6.05l1.3-1.5a1 1 0 011.05-.27l3 1a1 1 0 01.68.95V19a2 2 0 01-2 2A16 16 0 013 5z" />
                </svg>
              </SocialBtn>
            </div>

            {/* Badge open for booking */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 bg-white rounded-full shadow-lg ring-1 ring-black/5 px-4 py-2 flex items-center gap-2 whitespace-nowrap">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              <span className="text-xs font-bold text-[#1a1a1a]">Open for Booking</span>
            </div>
          </div>

          {/* RIGHT — title, role besar, statistik */}
          <div className="order-3 text-center lg:text-right">
            <p className="text-xs font-semibold text-gray-400 leading-relaxed">
              {data.title} · 2026<br />{self?.badge}
            </p>
            <h2 className="mt-2 font-black uppercase leading-[0.95] tracking-tight text-3xl sm:text-4xl text-[#1a1a1a]">
              {self?.role}
            </h2>
            <div className="mt-3 flex items-center gap-1 justify-center lg:justify-end">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-4 h-4 text-[#F9C74F]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="ml-1 text-sm font-bold">{data.rating}</span>
            </div>

            <div className="mt-7 flex items-center gap-3 justify-center lg:justify-end">
              <AnimatedTooltip items={clients} />
              <div className="text-left">
                <p className="font-black text-lg leading-none">{data.reviewCount}</p>
                <p className="text-[11px] text-gray-400">Klien · disukai warga lokal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[#178E81] text-[11px] font-extrabold tracking-[3px] uppercase">Portfolio</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <h2 className="text-3xl font-black mb-6"><span className="text-[#7B5EA7]">{firstName}&apos;s</span> Best Work</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {data.portfolio.map((img, i) => (
            <div key={i} className="rounded-2xl overflow-hidden aspect-square bg-gray-200 hover:scale-105 transition-transform">
              <img src={img} alt={`Porto ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* ── SPECIALITY / TOOLS / CTA ── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Speciality */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span className="grid place-items-center w-9 h-9 rounded-xl bg-[#178E81]/10 text-[#178E81]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 5 5.6.8-4 3.9 1 5.6L12 19.6 6.9 22l1-5.6-4-3.9 5.6-.8z" /></svg>
                </span>
                <h3 className="text-[11px] font-extrabold tracking-[3px] uppercase text-[#178E81]">Speciality</h3>
              </div>
              <span className="text-[11px] font-bold text-gray-300">{data.speciality.length} skill</span>
            </div>
            <ul className="space-y-1">
              {data.speciality.map((s, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#FAF7EE] transition-colors">
                  <span className="grid place-items-center w-6 h-6 rounded-full bg-gradient-to-br from-[#F9C74F] to-[#f0b21f] shadow-sm flex-shrink-0">
                    <svg className="w-3 h-3 text-[#1a1a1a]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span className="text-sm font-semibold text-[#1a1a1a]">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Signature Tools */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span className="grid place-items-center w-9 h-9 rounded-xl bg-[#7B5EA7]/10 text-[#7B5EA7]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></svg>
                </span>
                <h3 className="text-[11px] font-extrabold tracking-[3px] uppercase text-[#7B5EA7]">Signature Tools</h3>
              </div>
              <span className="text-[11px] font-bold text-gray-300">{data.tools.length} alat</span>
            </div>
            <ul className="space-y-1">
              {data.tools.map((t, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#FAF7EE] transition-colors">
                  <span className="grid place-items-center w-6 h-6 rounded-md bg-gray-100 text-gray-500 text-[10px] font-black flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold text-[#1a1a1a]">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] p-7 flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "url(/pattern.png)" }} />
            <div className="relative z-10 flex flex-col items-center">
              <span className="grid place-items-center w-14 h-14 rounded-2xl bg-[#F9C74F]/15 ring-1 ring-[#F9C74F]/30 text-[#F9C74F] mb-4">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </span>
              <h3 className="text-white font-bold text-base leading-snug mb-1.5">
                Mau cukuran keren dari <span className="text-[#F9C74F]">{firstName}</span>?
              </h3>
              <p className="text-white/50 text-xs leading-relaxed max-w-[220px] mb-5">
                Slot terbatas tiap harinya. Amankan jadwalmu sebelum keduluan orang.
              </p>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-[#F9C74F] hover:bg-yellow-400 text-[#1a1a1a] text-sm font-extrabold px-6 py-3 rounded-xl transition-colors group"
              >
                Book Now <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── BARBERMAN LAINNYA ── */}
      <section className="bg-[#1a1a1a] mt-14 py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[#F9C74F] text-xs font-bold tracking-[3px] uppercase mb-2">Tim Kami</p>
          <h2 className="text-center text-3xl font-black mb-10"><span className="text-[#F9C74F]">Barberman</span> <span className="text-white">Lainnya</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {others.map((barber) => (
              <Link key={barber.slug} href={`/barberman/${barber.slug}`} className="bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="relative flex-shrink-0 w-16 h-16"><div className={`absolute inset-0 rounded-full ${barber.color} scale-110`} /><img src={barber.img} alt={barber.name} className="relative w-full h-full object-cover object-top rounded-full border-2 border-white" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[15px] text-[#1a1a1a] leading-tight truncate">{barber.name}</p>
                  <p className="text-xs text-gray-500 mb-1.5">{barber.role}</p>
                  <span className="inline-block bg-[#7B5EA7] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1.5">{barber.badge}</span>
                  <div className="flex items-center gap-1"><svg className="w-3.5 h-3.5 text-[#F9C74F]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><span className="text-xs font-bold text-[#1a1a1a]">{barber.rating} ({barber.reviewCount})</span></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

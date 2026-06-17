import Link from 'next/link';
import BarbermanGrid from '@/components/company/BarbermanGrid';
import FadeIn from '@/components/ui/FadeIn';

const stats = [
  { value: "7+", label: "Maestro" },
  { value: "10K+", label: "Pelanggan Puas" },
  { value: "4.9", label: "Rating Rata-rata" },
  { value: "4", label: "Cabang" },
];

const reasons = [
  {
    color: "#178E81",
    title: "Presisi Terlatih",
    desc: "Tiap maestro lulus standar internal yang ketat. Hasil potongan konsisten, rapi, dan tahan lama.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    color: "#7B5EA7",
    title: "Paham Karaktermu",
    desc: "Konsultasi dulu sebelum mulai — gaya disesuaikan bentuk wajah, rambut, dan kepribadianmu.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 21a8 8 0 0116 0" />
      </svg>
    ),
  },
  {
    color: "#E76F51",
    title: "Alat Steril & Premium",
    desc: "Higienis nomor satu. Setiap alat disterilkan tiap sesi, pakai produk grooming kelas atas.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export default function BarbersListPage() {
  return (
    <div className="min-h-screen bg-[#FAF7EF]">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ── HEADING ── */}
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
            <div>
              <p className="text-[#1a1a1a] text-base sm:text-lg font-semibold mb-1">
                KENALAN SAMA <span className="line-through decoration-1 italic">KANG CUKUR</span>
              </p>
              <h1 className="font-black leading-[1.05] flex flex-col sm:flex-row sm:items-baseline gap-x-3 gap-y-0.5">
                <span className="text-[#7B5EA7] text-4xl sm:text-5xl">MAESTRO</span>
                <span className="text-[#1a1a1a] text-base sm:text-lg md:text-2xl font-bold italic">KAMI DULU GASIH??!!!</span>
              </h1>
            </div>
            <div className="md:max-w-sm lg:max-w-md">
              <p className="text-gray-500 text-sm leading-relaxed">
                Lebih dari sekadar memangkas, mereka adalah seniman. Master barber yang
                mendefinisikan ulang pengalaman mewah melalui presisi teknis dan ekspresi
                kreatif yang murni.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ── GRID BARBER (ProfileCard interaktif) ── */}
        <FadeIn delay={0.1}><BarbermanGrid /></FadeIn>

        {/* ── STATS ── */}
        <FadeIn delay={0.05}>
          <section className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-3xl border border-gray-200 bg-gray-200">
            {stats.map((s) => (
              <div key={s.label} className="bg-white px-6 py-7 text-center">
                <p className="font-display font-black text-3xl sm:text-4xl text-[#1a1a1a]">{s.value}</p>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </section>
        </FadeIn>

        {/* ── KENAPA PILIH KAMI ── */}
        <FadeIn delay={0.05}>
          <section className="mt-16">
            <div className="text-center mb-8">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#178E81] mb-2">Kenapa Kami</p>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1a1a1a]">
                Bukan asal cukur, <span className="text-[#7B5EA7]">tapi craft.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {reasons.map((r) => (
                <div key={r.title} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl mb-4" style={{ backgroundColor: `${r.color}1A`, color: r.color }}>
                    {r.icon}
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#1a1a1a] mb-1.5">{r.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* ── CTA ── */}
        <FadeIn delay={0.05}>
          <section className="mt-16">
            <div className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] px-8 py-12 md:px-14 md:py-16 text-center">
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "url(/pattern.png)" }} />
              <div className="relative z-10">
                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white mb-3">
                  Udah nemu maestro <span className="text-[#F9C74F]">favoritmu?</span>
                </h2>
                <p className="text-white/60 text-sm max-w-md mx-auto mb-7">
                  Pilih barberman, tentukan jadwal, dan biarkan mereka yang bikin kamu makin pede.
                </p>
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 bg-[#F9C74F] text-[#1a1a1a] px-7 py-3.5 rounded-xl font-display font-bold hover:bg-yellow-400 transition"
                >
                  Booking Sekarang <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </section>
        </FadeIn>

      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import Timeline, { TimelineEntry } from "@/components/ui/Timeline";
import TestimonialsCarousel from "@/components/company/TestimonialsCarousel";

// ─── DNA icons (inline, sejalan gaya doodle situs) ─────────────────────────────
const IconScissors = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);
const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-6 h-6">
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconSparkles = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z" />
  </svg>
);

const dna = [
  { icon: <IconScissors />, title: "Anti-Mainstream", text: "Kami nggak ikut tren asal ramai. Tiap potongan dirancang biar lo tampil beda — bukan jadi kembaran orang lain.", color: "#F9C74F", text_on: "#1a1a1a" },
  { icon: <IconTarget />,   title: "Presisi Tanpa Kompromi", text: "Dari fade sampe line-up, semua dikerjain milimeter demi milimeter. Buat kami, rapi itu harga mati.", color: "#178E81", text_on: "#fff" },
  { icon: <IconUsers />,    title: "Vibe Kekeluargaan", text: "Masuk sebagai pelanggan, pulang sebagai keluarga. Ngobrol santai sambil tampilan lo dirapiin.", color: "#7B5EA7", text_on: "#fff" },
  { icon: <IconSparkles />, title: "Selalu Upgrade", text: "Barber kami rutin belajar teknik baru, biar gaya lo selalu update dan nggak ketinggalan zaman.", color: "#E76F51", text_on: "#fff" },
];

// ─── Timeline data (sejarah) ──────────────────────────────────────────────────
const TimelineImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm aspect-[4/3] bg-gray-100">
    <img src={src} alt={alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
  </div>
);

const timelineData: TimelineEntry[] = [
  {
    title: "2019",
    subtitle: "Awal dari ruko kecil",
    content: (
      <div className="space-y-4">
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          Semua berawal dari satu kursi di ruko sempit Jl. Pramuka. Bermodal nekat, sepasang gunting,
          dan mimpi bikin orang Tanjungpinang tampil lebih percaya diri.
        </p>
        <TimelineImage src="/minion1.jfif" alt="Ruko pertama Minion" />
      </div>
    ),
  },
  {
    title: "2021",
    subtitle: "Mulai dikenal",
    content: (
      <div className="space-y-4">
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          Dari mulut ke mulut, antrean makin panjang. Pelanggan rela nunggu demi cukuran rapi.
          Tahun ini kami berani buka cabang kedua di Kijang.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <TimelineImage src="/minion2.jfif" alt="Suasana barbershop 2021" />
          <TimelineImage src="/gallery5.jpg" alt="Hasil potongan 2021" />
        </div>
      </div>
    ),
  },
  {
    title: "2023",
    subtitle: "Tumbuh jadi tim",
    content: (
      <div className="space-y-4">
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          Maestro-maestro baru bergabung. Standar layanan naik kelas — bukan cuma potong rambut,
          tapi pengalaman grooming yang utuh dari awal sampai akhir.
        </p>
        <TimelineImage src="/minion3.jfif" alt="Tim Minion berkembang" />
      </div>
    ),
  },
  {
    title: "2026",
    subtitle: "4 cabang, satu visi",
    content: (
      <div className="space-y-4">
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          Kini Minion hadir di 4 titik Tanjungpinang. Yang berubah cuma skalanya — misinya tetap sama:
          bikin setiap orang pulang dengan kepala tegak dan senyum lebar.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <TimelineImage src="/gallery8.png" alt="Cabang Minion 2026" />
          <TimelineImage src="/gallery11.jpg" alt="Pelanggan Minion 2026" />
        </div>
      </div>
    ),
  },
];

const AboutSection = () => {
  return (
    <div className="bg-[#FAF7EE] text-[#1a1a1a]">

      {/* ── 1. Hero ── */}
      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-10">
        <div className="bg-white p-7 md:p-12 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 text-[#F9C74F] opacity-90">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 rotate-12">
              <path d="M12 2l2.9 6.5L22 9.3l-5 4.6 1.3 7.1L12 17.8 5.7 21l1.3-7.1-5-4.6 7.1-.8L12 2z" />
            </svg>
          </div>
          <p className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase mb-5 text-gray-400">Tentang Kami</p>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05]">
              Good hair,<br />good mood,<br />
              <span className="text-[#7B5EA7]">good day.</span>
            </h1>
            <p className="text-base md:text-lg font-medium leading-relaxed border-l-4 border-[#1a1a1a] pl-5 md:pl-8 text-gray-700">
              &ldquo;Minion ga cuma barbershop biasa, king. Kami{" "}
              <span className="font-bold text-[#1a1a1a]">pencari kesempurnaan.</span>{" "}
              Mastiin tiap pelanggan dapat{" "}
              <span className="font-bold italic text-[#178E81]">perfection</span>{" "}
              dalam penampilan — itu tugas kami.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Tim + Owner dalam satu frame ── */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Frame foto (GANTI src dengan foto grup tim + owner asli) */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#F9C74F] rounded-2xl rotate-6 -z-0" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#178E81]/20 rounded-full -z-0" />
            <figure className="relative z-10 bg-white p-3 pb-5 rounded-2xl shadow-lg border border-gray-100 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="overflow-hidden rounded-xl aspect-[4/3] bg-gray-100">
                <img src="/barber.png" alt="Tim Minion bersama owner" className="w-full h-full object-cover" />
              </div>
              <figcaption className="pt-3 text-center">
                <span className="block font-display font-bold text-[#1a1a1a]">Keluarga Besar Minion</span>
                <span className="block text-xs text-gray-400 font-body">Para barber & sang owner — Tanjungpinang</span>
              </figcaption>
            </figure>
          </div>

          {/* Narasi */}
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#178E81] uppercase mb-3">Satu Frame, Satu Keluarga</p>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-5">
              Di balik tiap cukuran rapi,<br />
              <span className="text-[#7B5EA7]">ada satu keluarga.</span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Minion bukan dibangun sendirian. Dari sang owner yang turun langsung pegang gunting,
                sampai barber muda yang haus belajar — semua duduk di kursi yang sama, ngejar standar yang sama.
              </p>
              <p>
                Kami percaya hasil terbaik lahir dari tim yang solid dan saling jujur. Itulah kenapa setiap
                orang yang masuk ke Minion bukan cuma dapet potongan, tapi juga ngerasain energi satu tim
                yang benar-benar peduli sama tampilan lo.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {["7+ Maestro", "4 Cabang", "10K+ Pelanggan"].map((t) => (
                <span key={t} className="bg-[#1a1a1a] text-white text-xs font-bold px-4 py-2 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. DNA Kami ── */}
      <section className="bg-[#178E81] text-white py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "url(/pattern.png)" }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-10 md:mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/70 mb-2">Yang Bikin Kami Beda</p>
            <h2 className="text-4xl md:text-5xl font-black">DNA Kami.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {dna.map((d) => (
              <div key={d.title} className="group bg-white text-[#1a1a1a] p-6 rounded-3xl shadow-lg hover:-translate-y-1.5 transition-transform duration-300">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: d.color, color: d.text_on }}
                >
                  {d.icon}
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{d.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Sejarah (Timeline Aceternity) ── */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto mb-4 md:mb-8 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[#178E81] uppercase mb-3">Perjalanan Kami</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
            Dari ruko kecil<br className="sm:hidden" /> sampe <span className="text-[#7B5EA7]">4 cabang.</span>
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mt-4 leading-relaxed">
            Tiap cabang punya cerita. Geser ke bawah dan ikuti langkah kami tumbuh.
          </p>
        </div>
        <Timeline data={timelineData} />
      </section>

      {/* ── 5. Testimoni ── */}
      <TestimonialsCarousel />

      {/* ── 6. CTA penutup ── */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] text-white px-8 py-12 md:px-14 md:py-16 text-center">
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "url(/pattern.png)" }} />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black mb-3">
              Siap nulis cerita lo <span className="text-[#F9C74F]">bareng kami?</span>
            </h2>
            <p className="text-white/70 text-sm max-w-md mx-auto mb-8">
              Datang sebagai pelanggan, pulang sebagai keluarga. Booking sekarang dan rasain sendiri vibe-nya.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#F9C74F] text-[#1a1a1a] px-7 py-3.5 rounded-xl font-display font-bold hover:bg-yellow-400 transition"
            >
              Book Sekarang <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutSection;

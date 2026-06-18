"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
    title: "2018",
    subtitle: "Awal dari ruko kecil",
    content: (
      <div className="space-y-4">
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          Minion Barbershop merupakan usaha yang bergerak di bidang jasa pangkas rambut dan didirikan pada bulan November 2018. Usaha ini pertama kali beroperasi di sebuah kios kecil yang berlokasi di Jl. H.Ungar. Pada tahap awal, usaha dijalankan secara mandiri oleh pemilik dengan fasilitas yang masih sederhana, yaitu dua kursi layanan.
        </p>
        <TimelineImage src="/about/ruko2018.png" alt="Ruko pertama Minion" />
      </div>
    ),
  },
  {
    title: "2019",
    subtitle: "Pindah Untuk Lebih Baik",
    content: (
      <div className="space-y-4">
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          Minion Barbershop berpindah lokasi ke Jl. Pramuka yang saat ini menjadi cabang utama. Perpindahan ini dilakukan untuk mendukung pengembangan usaha. Di lokasi baru, kapasitas layanan ditingkatkan menjadi tiga kursi dan terus berkembang seiring meningkatnya jumlah pelanggan.

        </p>
          <TimelineImage src="/about/ruko2019.png" alt="Suasana barbershop 2019" />
      </div>
    ),
  },
  {
    title: "2020",
    subtitle: "Mulai dikenal",
    content: (
      <div className="space-y-4">
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
         Perkembangan usaha yang positif mendorong pemilik untuk membuka cabang kedua di Kijang pada tahun 2020. Meskipun menghadapi berbagai tantangan, seperti pengelolaan tenaga kerja, sistem operasional, dan persaingan usaha yang semakin meningkat, Minion Barbershop tetap mampu mempertahankan pertumbuhan dan stabilitas usahanya.

        </p>
        <TimelineImage src="/about/ruko2020.png" alt="Tim Minion berkembang" />
      </div>
    ),
  },
  {
    title: "2025",
    subtitle: "Tumbuh Jadi Tim",
    content: (
      <div className="space-y-4">
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          Pada tahun 2025, Minion Barbershop membuka cabang premium di kawasan Jl. D.I Panjaitan dengan konsep yang lebih modern dan fasilitas yang lebih lengkap.
        </p>
          <TimelineImage src="/about/ruko2025.png" alt="Cabang Minion 2025" />
      </div>
    ),
  },
  {
    title: "2026",
    subtitle: "4 Cabang, Satu Visi",
    content: (
      <div className="space-y-4">
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
         Keberhasilan cabang keempat mendorong pembukaan cabang baru di Jl. Ganet pada tahun 2026 dengan konsep serupa yang telah disesuaikan dengan perkembangan kebutuhan pelanggan.

        </p>
        <TimelineImage src="/about/ruko2026.png" alt="Tim Minion berkembang" />
      </div>
    ),
  },
];

const AboutSection = () => {
  return (
    <div className="bg-[#FAF7EE] text-[#1a1a1a]">

      {/* ── 1. Hero ── */}
      <motion.section className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-10" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <div className="bg-white p-7 md:p-12 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 text-[#F9C74F] opacity-90">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 rotate-12">
              <path d="M12 2l2.9 6.5L22 9.3l-5 4.6 1.3 7.1L12 17.8 5.7 21l1.3-7.1-5-4.6 7.1-.8L12 2z" />
            </svg>
          </div>
          <p className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase mb-5 text-gray-400">Filosofi Nama Minion</p>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex items-center">
              <img src="/brand/minion.png" alt="Minion Barbershop" className="w-64 md:w-80 object-contain" />
            </div>
            <p className="text-base md:text-lg font-medium leading-relaxed border-l-4 border-[#1a1a1a] pl-5 md:pl-8 text-gray-700">
              Nama &ldquo;Minion&rdquo; dipilih sebagai representasi dari awal perjalanan usaha yang dimulai dari skala kecil dan sederhana. Nama tersebut mencerminkan{" "}
              <span className="font-bold text-[#1a1a1a]">semangat perjuangan, kerja keras, dan komitmen</span>{" "}
              pemilik dalam mengembangkan usaha dari nol hingga menjadi salah satu barbershop yang{" "}
              <span className="font-bold italic text-[#178E81]">dikenal oleh masyarakat.</span>
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── 2. Tim + Owner dalam satu frame ── */}
      <motion.section className="max-w-7xl mx-auto px-6 py-12 md:py-16" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Frame foto (GANTI src dengan foto grup tim + owner asli) */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#F9C74F] rounded-2xl rotate-6 -z-0" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#178E81]/20 rounded-full -z-0" />
            <figure className="relative z-10 bg-white p-3 pb-5 rounded-2xl shadow-lg border border-gray-100 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="overflow-hidden rounded-xl aspect-[4/3] bg-gray-100">
                <img src="/about/KeluargaBesar.png" alt="Tim Minion bersama owner" className="w-full h-full object-cover" />
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
      </motion.section>

      {/* ── 3. DNA Kami ── */}
      <motion.section className="bg-[#178E81] text-white py-16 md:py-20 px-6 relative overflow-hidden" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "url(/ui/pattern.png)" }} />
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
      </motion.section>

      {/* ── 4. Sejarah (Timeline Aceternity) ── */}
      <motion.section className="py-16 md:py-24 px-6" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}>
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
      </motion.section>

      {/* ── 5. Testimoni ── */}
      <TestimonialsCarousel />

      {/* ── 6. CTA penutup ── */}
      <motion.section className="max-w-7xl mx-auto px-6 py-16 md:py-20" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <div className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] text-white px-8 py-12 md:px-14 md:py-16 text-center">
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "url(/ui/pattern.png)" }} />
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
      </motion.section>

    </div>
  );
};

export default AboutSection;

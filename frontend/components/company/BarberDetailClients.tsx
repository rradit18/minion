"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const galleryImages = [
  "/gallery1.jfif", "/gallery2.jfif", "/gallery3.jfif",
  "/gallery4.jfif", "/gallery5.jfif", "/gallery6.jfif",
  "/gallery1.jfif", "/gallery2.jfif", "/gallery3.jfif",
  "/gallery4.jfif", "/gallery5.jfif", "/gallery6.jfif",
  "/gallery1.jfif", "/gallery2.jfif", "/gallery3.jfif",
  "/gallery4.jfif", "/gallery5.jfif", "/gallery6.jfif",
];

const leftTabs = ["Side part", "Low taper", "Perm"];

interface BarberDetailClientProps {
  barberName: string;
  barberSlug: string;
}

export default function BarberDetailClients({ barberName, barberSlug }: BarberDetailClientProps) {
  const [activeTab, setActiveTab] = useState("Barber");

  return (
    <div className="min-h-screen bg-[#FAF7EF]">

      {/* ── HERO HEADER ── */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="text-[40px] sm:text-[52px] font-black leading-none text-[#1a1a1a] uppercase">
              PRESISI
            </h1>
            <h1 className="text-[40px] sm:text-[52px] font-black leading-none text-[#F9C74F] uppercase">
              TANPA TANDING
            </h1>
            <p
              className="text-[#7B5EA7] text-[13px] font-bold tracking-[4px] uppercase mt-2"
              style={{ fontStyle: 'italic' }}
            >
              GALLERY KARYA
            </p>
          </div>
          <div className="md:max-w-sm lg:max-w-md">
            <p className="text-gray-500 text-sm leading-relaxed">
              Selamat datang di galeri mahakarya kami. Mulai dari taper klasik hingga desain
              tepi tajam yang eksperimental, galeri ini menampilkan keahlian elit dari kolektif
              Gold & Grain.
            </p>
          </div>
        </div>
      </section>

      {/* ── BEFORE/AFTER + FEATURE CARD ── */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-md border border-gray-100">

          {/* Before/After Image */}
          <div className="relative w-full lg:w-[420px] flex-shrink-0 min-h-[360px] lg:min-h-[460px] bg-gray-200 overflow-hidden">
            <img
              src="/gallery1.jfif"
              alt="Before After"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex">
              <div className="w-1/2 relative">
                <span className="absolute top-4 left-4 bg-[#178E81] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  sebelum
                </span>
              </div>
              <div className="w-1/2 relative">
                <span className="absolute top-4 right-4 bg-[#7B5EA7] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  sesudah
                </span>
              </div>
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/80" />
            </div>
          </div>

          {/* Feature Info] */}
          <div
            className="flex-1 p-8 lg:p-10 relative overflow-hidden"
            style={{
              backgroundColor: '#ffffff',
              backgroundImage: `url('/pattern.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-white/60" />

            {/* Konten di atas overlay */}
            <div className="relative z-10">
              <span className="absolute top-0 right-2 text-[#F9C74F] text-4xl font-black select-none">✦</span>

              <h2 className="text-[28px] sm:text-[34px] font-black text-[#1a1a1a] leading-tight mb-1">
                Transformasi Khas
              </h2>
              <h2 className="text-[28px] sm:text-[34px] font-black text-[#F9C74F] leading-tight mb-4">
                {barberName}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5 max-w-sm">
                Saksikan kekuatan presisi. Paket "Modern Executive" kami bukan sekadar
                potongan rambut; ini adalah kalibrasi ulang dari citra diri Anda. Dikerjakan
                oleh sang ahli.
              </p>

              <p className="text-[#178E81] text-[11px] font-extrabold tracking-[2px] uppercase mb-3">
                Benefit Utama:
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Cukur', 'Pijat', 'Handuk Panas', 'Bebas Tunggu'].map((b, i) => (
                  <span
                    key={i}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                      i === 0
                        ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                        : i === 3
                        ? 'bg-[#F9C74F] text-[#1a1a1a] border-[#F9C74F]'
                        : 'bg-white text-[#1a1a1a] border-gray-300'
                    }`}
                  >
                    {b}
                  </span>
                ))}
              </div>

              <Link
                href="/booking"
                className="inline-block bg-[#F9C74F] text-[#1a1a1a] px-8 py-3 rounded-xl font-extrabold text-[14px] hover:bg-yellow-400 transition"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TABS ── */}
      <section className="max-w-7xl mx-auto px-6 mb-6">
        <div className="bg-[#1a1a1a] rounded-xl flex items-center px-2 py-2 overflow-x-auto">
          {/* Tab kiri: Side part, Low taper, Perm */}
          <div className="flex items-center gap-1 flex-1">
            {leftTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition ${
                  activeTab === tab
                    ? 'bg-[#F9C74F] text-[#1a1a1a]'
                    : 'text-white hover:text-[#F9C74F]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab kanan: Barber */}
          <button
            onClick={() => setActiveTab("Barber")}
            className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition ${
              activeTab === "Barber"
                ? 'bg-[#F9C74F] text-[#1a1a1a]'
                : 'text-white hover:text-[#F9C74F]'
            }`}
          >
            Barber
          </button>
        </div>
      </section>

      {/* ── GALLERY GRID ── */}
      <section className="max-w-7xl mx-auto px-6 mb-8">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {galleryImages.map((img, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden">
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── LIHAT SEMUA ── */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex items-center justify-between">
          <div className="w-20 h-20 flex-shrink-0">
            <img
                src="/love.png"
                alt="love"
                className="w-full h-full object-contain"
                />
          </div>

          <button className="bg-[#1a1a1a] text-white px-10 py-3 rounded-xl font-bold text-sm hover:bg-[#333] transition">
            - Lihat Semua -
          </button>

          <span className="text-[#F9C74F] text-5xl font-black select-none">✦</span>
        </div>
      </section>
    </div>
  );
}   
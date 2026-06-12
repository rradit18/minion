"use client";

import React from 'react';
import Link from 'next/link';

interface Props {
  barberName: string;
  barberSlug: string;
}

const barberData: Record<string, any> = {
  bastian: {
    title: 'Top Rated',
    rating: 4.9,
    reviewCount: '2300+',
    location: 'Jl. Ganet',
    quote:
      'Mengubah setiap potongan menjadi karya seni yang elit adalah passion. Saya tidak hanya memotong rambut, saya mendefinisikan identitas.',
    experience: '8th+ Pengalaman',
    clientReturns: '400 Client Returns',
    speciality: [
      'Skin Fade & Taper Fade',
      'Hard Part & Line Up',
      'Textured Crop',
      'Pompadour & Quiff',
    ],
    tools: [
      'Wahl Senior Clipper',
      'Andis T Outliner',
      'Feather Razor',
      'Kamisori Shear',
    ],
    portfolio: [
      '/port1.jpg',
      '/port2.jpg',
      '/port3.jpg',
      '/port4.jpg',
      '/port5.jpg',
      '/port6.jpg',
    ],
    others: [
      { slug: 'hendra', name: 'Hendra Schevenko', role: 'Fade King', badge: 'Fade Specialist', rating: '4.9', reviewCount: '2300+', img: '/hendra.jpg' },
      { slug: 'yoga',   name: 'Yoga Harahap',     role: 'Fade King', badge: 'Fade Specialist', rating: '4.9', reviewCount: '2300+', img: '/yoga.jpg'   },
      { slug: 'juan',   name: 'Juan Samudra',     role: 'Fade King', badge: 'Fade Specialist', rating: '4.9', reviewCount: '2300+', img: '/juan.jpg'   },
    ],
  },
};

const defaultData = barberData['bastian'];

export default function BarberDetailClients({ barberName, barberSlug }: Props) {
  const data = barberData[barberSlug] ?? defaultData;
  const firstName = barberName.split(' ')[0];

  return (
    <div className="bg-[#EAE6DF] min-h-screen font-sans">

      {/* ── Hero Section ── */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <div className="flex gap-10 items-start">
          {/* Avatar */}
          <div className="relative flex-shrink-0 w-52 h-52">
            <div className="absolute inset-0 rounded-full bg-[#E8730A]" />
            <img
              src={`/${barberSlug}.jpg`}
              alt={barberName}
              className="absolute inset-0 w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-barber.jpg';
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="border border-[#1a1a1a] text-[#1a1a1a] text-[11px] font-semibold px-3 py-1 rounded-sm tracking-wide">
                {data.title}
              </span>
            </div>

            <h1 className="text-[42px] font-black leading-none tracking-tight mb-3">
              {barberName}
            </h1>

            <div className="flex items-center gap-2 mb-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-[#D4AF37] text-lg">★</span>
                ))}
              </div>
              <span className="font-bold text-[15px]">
                {data.rating} ({data.reviewCount} Reviews)
              </span>
            </div>

            <p className="text-[13px] text-[#444] mb-4">
              Penempatan: {data.location}
            </p>

            {/* Quote */}
            <div className="bg-[#1a1a1a] rounded-r-xl border-l-4 border-[#D4AF37] px-5 py-4 mb-4 max-w-lg">
              <p className="text-white italic text-[13px] leading-relaxed">
                "{data.quote}"
              </p>
            </div>

            {/* Badges */}
            <div className="flex gap-2">
              <span className="border border-[#1a1a1a] text-[#1a1a1a] text-[12px] font-semibold px-4 py-1.5 rounded-full">
                {data.experience}
              </span>
              <span className="border border-[#1a1a1a] text-[#1a1a1a] text-[12px] font-semibold px-4 py-1.5 rounded-full">
                {data.clientReturns}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Porto Section ── */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-center text-[32px] font-black mb-6">
          <span className="text-[#7B5EA7]">{firstName}'s</span> Porto
        </h2>
        <div className="grid grid-cols-6 gap-2">
          {data.portfolio.map((img: string, i: number) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden aspect-square bg-[#d0c8bc]"
            >
              <img
                src={img}
                alt={`Porto ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Speciality & Tools + CTA ── */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex gap-6 items-stretch">
          {/* Speciality */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-[#178E81] text-[11px] font-extrabold tracking-[2px] mb-4 uppercase">
              Speciality
            </p>
            <ul className="space-y-2.5">
              {data.speciality.map((s: string, i: number) => (
                <li key={i} className="flex items-center gap-2.5 text-[14px] font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a] flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Signature Tools */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-[#178E81] text-[11px] font-extrabold tracking-[2px] mb-4 uppercase">
              Signature Tools
            </p>
            <ul className="space-y-2.5">
              {data.tools.map((t: string, i: number) => (
                <li key={i} className="flex items-center gap-2.5 text-[14px] font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a] flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Card */}
          <div className="flex flex-col items-center justify-center gap-4 px-2 min-w-[180px]">
            <p className="text-[15px] font-bold text-center leading-snug">
              Mau Dapetin Cukuran<br />
              Keren dari{' '}
              <span className="text-[#178E81]">{firstName}</span> Juga?
            </p>
            <Link
              href={`/booking/${barberSlug}`}
              className="bg-[#178E81] hover:bg-[#0f6e63] transition-colors text-white text-[13px] font-bold px-5 py-3 rounded-lg text-center whitespace-nowrap"
            >
              Book Appointment Now
            </Link>
          </div>
        </div>
      </div>

      {/* ── Barberman Lainnya ── */}
      <div className="bg-[#1a1a1a] mt-10 py-12 px-6">
        <h2 className="text-center text-[32px] font-black mb-8">
          <span className="text-[#D4AF37]">Barberman</span>{' '}
          <span className="text-white">Lainnya</span>
        </h2>

        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-5">
          {data.others.map((barber: any) => (
            <Link
              key={barber.slug}
              href={`/barber/${barber.slug}`}
              className="bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
            >
              {/* Avatar with teal circle accent */}
              <div className="relative flex-shrink-0 w-16 h-16">
                <div className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-[#E8730A] opacity-70" />
                <img
                  src={barber.img}
                  alt={barber.name}
                  className="relative w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-barber.jpg';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-black text-[15px] leading-tight truncate">
                  {barber.name}
                </p>
                <p className="text-[12px] text-[#555] mb-1.5">{barber.role}</p>
                <span className="inline-block bg-[#7B5EA7] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2">
                  {barber.badge}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[#D4AF37] text-sm">★</span>
                  <span className="text-[12px] font-bold">
                    {barber.rating} ({barber.reviewCount})
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
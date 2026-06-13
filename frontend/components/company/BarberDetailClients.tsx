"use client";

import Link from 'next/link';

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
    portfolio: ["/port1.jpg","/port2.jpg","/port3.jpg","/port4.jpg","/port5.jpg","/port6.jpg"],
    accent: "bg-teal-400",
  },
  juan: {
    title: "Top Rated", rating: 4.9, reviewCount: "1800+", location: "Kijang Kota",
    quote: "Setiap kepala punya cerita. Saya menciptakan potongan yang menonjolkan kepribadian dan memberikan kesan pertama yang tak terlupakan.",
    experience: "6th+ Pengalaman", clientReturns: "310 Client Returns",
    speciality: ["Classic Cut", "Modern Pompadour", "Textured Quiff", "Undercut Classic"],
    tools: ["Oster Fast Feed", "Wahl Senior", "Kamisori Scissors", "Straight Razor"],
    portfolio: ["/port1.jpg","/port2.jpg","/port3.jpg","/port4.jpg","/port5.jpg","/port6.jpg"],
    accent: "bg-purple-400",
  },
  yoga: {
    title: "Rising Star", rating: 4.8, reviewCount: "1500+", location: "Bt. 9",
    quote: "Line up yang tajam adalah seni. Saya percaya detail kecil yang membuat perbedaan besar antara biasa dan luar biasa.",
    experience: "5th+ Pengalaman", clientReturns: "260 Client Returns",
    speciality: ["Line Up Tajam", "Hard Part Design", "Curly Hair Expert", "Mohawk & Faux Hawk"],
    tools: ["Andis T-Outliner", "Wahl Detailer", "Feather Razor", "Barber Comb Set"],
    portfolio: ["/port1.jpg","/port2.jpg","/port3.jpg","/port4.jpg","/port5.jpg","/port6.jpg"],
    accent: "bg-yellow-400",
  },
  bastian: {
    title: "Top Rated", rating: 4.9, reviewCount: "2100+", location: "Jl. Ganet",
    quote: "Mengubah setiap potongan menjadi karya seni yang elit adalah passion. Saya tidak hanya memotong rambut, saya mendefinisikan identitas.",
    experience: "8th+ Pengalaman", clientReturns: "400 Client Returns",
    speciality: ["Skin Fade & Taper Fade", "Hard Part & Line Up", "Textured Crop", "Pompadour & Quiff"],
    tools: ["Wahl Senior Clipper", "Andis T Outliner", "Feather Razor", "Kamisori Shear"],
    portfolio: ["/port1.jpg","/port2.jpg","/port3.jpg","/port4.jpg","/port5.jpg","/port6.jpg"],
    accent: "bg-orange-400",
  },
};

export default function BarberDetailClients({ barberName, barberSlug }: Props) {
  const data    = barberData[barberSlug] ?? barberData['bastian'];
  const self    = ALL_BARBERS.find(b => b.slug === barberSlug);
  const others  = ALL_BARBERS.filter(b => b.slug !== barberSlug);
  const firstName = barberName.split(' ')[0];

  return (
    <div className="bg-[#FAFAF6] min-h-screen font-sans">

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-10">
        <div className="flex flex-col md:flex-row gap-10 items-start">

          {/* Avatar */}
          <div className="relative flex-shrink-0 w-52 h-52">
            <div className={`absolute inset-0 rounded-full ${data.accent} opacity-80`} />
            <img src={`/${barberSlug}.png`} alt={barberName}
              className="absolute inset-0 w-full h-full object-cover object-top rounded-full border-4 border-white shadow-md"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>

          {/* Info */}
          <div className="flex-1">
            {/* Badge */}
            <span className="inline-block border-2 border-[#1a1a1a] text-[#1a1a1a] text-[11px] font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
              {data.title}
            </span>

            <h1
              className="text-[40px] md:text-[52px] font-black leading-none tracking-tight text-[#1a1a1a] mb-1"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              {barberName}
            </h1>
            <p className="text-[#7B5EA7] font-bold text-lg mb-3">{self?.role}</p>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="w-5 h-5 text-[#F9C74F]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="font-bold text-[#1a1a1a] text-sm">{data.rating} · {data.reviewCount} Reviews</span>
            </div>

            <p className="text-sm text-gray-500 mb-5 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#178E81]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
              </svg>
              {data.location}
            </p>

            {/* Quote */}
            <div className="bg-[#1a1a1a] rounded-2xl border-l-4 border-[#F9C74F] px-5 py-4 mb-5 max-w-xl">
              <p className="text-white italic text-[13px] leading-relaxed">"{data.quote}"</p>
            </div>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              <span className="bg-[#F9C74F] text-[#1a1a1a] text-xs font-bold px-4 py-1.5 rounded-full">{data.experience}</span>
              <span className="bg-[#FAFAF6] border-2 border-[#1a1a1a] text-[#1a1a1a] text-xs font-bold px-4 py-1.5 rounded-full">{data.clientReturns}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Portfolio ── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[#178E81] text-[11px] font-extrabold tracking-[3px] uppercase">Portfolio</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <h2 className="text-3xl font-black text-[#1a1a1a] mb-6">
          <span className="text-[#7B5EA7]">{firstName}'s</span> Best Work
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {data.portfolio.map((img, i) => (
            <div key={i} className="rounded-2xl overflow-hidden aspect-square bg-gray-200 hover:scale-105 transition-transform">
              <img src={img} alt={`Porto ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Speciality & Tools + CTA ── */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row gap-5 items-stretch">
          {/* Speciality */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-[#178E81] text-[11px] font-extrabold tracking-[3px] mb-4 uppercase">Speciality</p>
            <ul className="space-y-3">
              {data.speciality.map((s, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium text-[#1a1a1a]">
                  <span className="w-5 h-5 bg-[#F9C74F] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-[#178E81] text-[11px] font-extrabold tracking-[3px] mb-4 uppercase">Signature Tools</p>
            <ul className="space-y-3">
              {data.tools.map((t, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium text-[#1a1a1a]">
                  <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"/>
                    </svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center justify-center gap-4 bg-[#1a1a1a] rounded-2xl px-6 py-8 min-w-[200px] text-center">
            <svg className="w-10 h-10 text-[#F9C74F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p className="text-white text-sm font-bold leading-snug">
              Mau Dapetin Cukuran Keren dari{' '}
              <span className="text-[#F9C74F]">{firstName}</span>?
            </p>
            <Link href="/booking"
              className="bg-[#F9C74F] hover:bg-yellow-400 text-[#1a1a1a] text-sm font-extrabold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
              Book Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Barberman Lainnya ── */}
      <section className="bg-[#1a1a1a] mt-14 py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[#F9C74F] text-xs font-bold tracking-[3px] uppercase mb-2">Tim Kami</p>
          <h2 className="text-center text-3xl font-black mb-10">
            <span className="text-[#F9C74F]">Barberman</span>{' '}
            <span className="text-white">Lainnya</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {others.map((barber) => (
              <Link key={barber.slug} href={`/barberman/${barber.slug}`}
                className="bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="relative flex-shrink-0 w-16 h-16">
                  <div className={`absolute inset-0 rounded-full ${barber.color} scale-110`} />
                  <img src={barber.img} alt={barber.name}
                    className="relative w-full h-full object-cover object-top rounded-full border-2 border-white"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[15px] text-[#1a1a1a] leading-tight truncate">{barber.name}</p>
                  <p className="text-xs text-gray-500 mb-1.5">{barber.role}</p>
                  <span className="inline-block bg-[#7B5EA7] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1.5">
                    {barber.badge}
                  </span>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-[#F9C74F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-xs font-bold text-[#1a1a1a]">{barber.rating} ({barber.reviewCount})</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

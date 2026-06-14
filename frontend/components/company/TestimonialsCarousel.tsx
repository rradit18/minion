"use client";

import { useEffect, useState } from "react";

interface Testi {
  quote: string;
  name: string;
  role: string;
}

const testimonials: Testi[] = [
  { quote: "Bukan sekadar potong rambut, ini pernyataan diri. Vibe di sini nggak ada lawannya.", name: "Rizky A.", role: "Langganan sejak 2022" },
  { quote: "Fade-nya presisi banget. Udah 2 tahun langganan, nggak pernah sekalipun kecewa.", name: "Dimas P.", role: "Pelanggan setia" },
  { quote: "Barbernya ramah dan ngerti banget maunya. Berasa ngobrol sama temen lama.", name: "Bagas W.", role: "Mahasiswa" },
  { quote: "Tempatnya nyaman, hasilnya rapi, harganya masuk akal. Komplit pokoknya.", name: "Yoga H.", role: "Karyawan swasta" },
  { quote: "Sekali nyoba langsung pindah ke sini. Detail line-up-nya juara, susah balik ke tempat lain.", name: "Fadlan R.", role: "Content creator" },
  { quote: "Anak saya yang awalnya takut potong rambut, sekarang malah minta ke Minion terus.", name: "Pak Hendra", role: "Orang tua pelanggan" },
];

const CUT = 34; // ukuran sudut terlipat (dog-ear)

export default function TestimonialsCarousel() {
  const [active, setActive] = useState(0);
  // Jarak sebaran antar kartu (% lebar kartu) — makin lebar layar makin melebar
  const [spread, setSpread] = useState(56);
  const n = testimonials.length;

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1280) setSpread(86);
      else if (w >= 1024) setSpread(78);
      else if (w >= 640) setSpread(66);
      else setSpread(52);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const next = () => setActive((a) => (a + 1) % n);
  const prev = () => setActive((a) => (a - 1 + n) % n);

  return (
    <section className="bg-[#E9E5DC] py-16 md:py-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center mb-10 md:mb-12">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#178E81] mb-2">Kata Mereka</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a1a1a]">Their Thought About Minion</h2>
      </div>

      {/* Stage kartu */}
      <div className="relative mx-auto h-[360px] sm:h-[380px] max-w-5xl">
        {testimonials.map((t, i) => {
          let off = i - active;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;

          const abs = Math.abs(off);
          const visible = abs <= 2;
          const isActive = off === 0;

          const scale = isActive ? 1 : 0.9 - (abs - 1) * 0.06;
          const transform =
            `translate(-50%, -50%) translateX(${off * spread}%) translateY(${abs * 8}px) ` +
            `rotate(${off * 7}deg) scale(${scale})`;

          return (
            <article
              key={i}
              onClick={() => !isActive && setActive(i)}
              aria-hidden={!visible}
              style={{
                transform,
                zIndex: 30 - abs * 10,
                opacity: visible ? 1 : 0,
                pointerEvents: visible && !isActive ? "auto" : isActive ? "none" : "none",
                ...(isActive
                  ? { clipPath: `polygon(0 0, calc(100% - ${CUT}px) 0, 100% ${CUT}px, 100% 100%, 0 100%)` }
                  : {}),
              }}
              className={`absolute left-1/2 top-1/2 w-[260px] sm:w-[320px] h-[300px] sm:h-[320px] p-6 sm:p-7 flex flex-col transition-all duration-500 ease-out select-none ${
                isActive
                  ? "bg-[#7B5EA7] text-white shadow-2xl"
                  : "bg-white text-[#1a1a1a] border-[1.5px] border-[#1a1a1a]/80 shadow-md cursor-pointer"
              }`}
            >
              {/* sudut terlipat hanya di kartu aktif */}
              {isActive && (
                <span
                  className="absolute top-0 right-0"
                  style={{
                    width: CUT,
                    height: CUT,
                    background: "#5d4683",
                    clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                  }}
                />
              )}

              <span className={`font-display text-5xl leading-none mb-2 ${isActive ? "text-[#F9C74F]" : "text-[#7B5EA7]"}`}>
                &ldquo;
              </span>
              <blockquote className={`flex-1 text-[15px] sm:text-base font-semibold leading-snug ${isActive ? "" : ""}`}>
                {t.quote}
              </blockquote>
              <footer className="mt-4">
                <p className={`text-sm font-bold italic ${isActive ? "text-white" : "text-[#1a1a1a]"}`}>
                  &mdash; {t.name}
                </p>
                <p className={`text-xs ${isActive ? "text-white/70" : "text-gray-400"}`}>{t.role}</p>
              </footer>
            </article>
          );
        })}
      </div>

      {/* Navigasi */}
      <div className="flex items-center justify-center gap-8 mt-8">
        <button
          onClick={prev}
          aria-label="Sebelumnya"
          className="grid place-items-center h-11 w-11 rounded-full text-[#1a1a1a] hover:bg-white/70 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Selanjutnya"
          className="grid place-items-center h-11 w-11 rounded-full text-[#1a1a1a] hover:bg-white/70 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}

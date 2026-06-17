"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { setBookingPrefill } from "@/src/lib/localStorage";
import { useFaceDetection } from "./useFaceDetection";

type Stage = "idle" | "camera" | "preview" | "generating" | "result";

interface GridStyle {
  name: string;
  visual: string;
  rating: number;
  tag: string;
}
interface BestPick {
  rank: number;
  name: string;
  benefits: string[];
  rating: number;
}
interface HairAnalysis {
  face_shape: string;
  face_shape_desc: string;
  hair_type: string;
  current_style: string;
  grid_styles: GridStyle[];
  best_picks: BestPick[];
  hair_tips: string[];
}
interface AnalysisResponse {
  analysis: HairAnalysis;
  cardImage: string;
  source: "openai" | "dummy";
  imageError?: string;
}

const MAX_ATTEMPTS = 1; // hanya 1x analisa AI per sesi (kontrol biaya) — 1 call = 1 gambar
const CAPTURE_MAX_DIM = 768; // sisi terpanjang foto yg dikirim (jaga payload ringan)
const CAPTURE_QUALITY = 0.82; // kompresi JPEG

// Layanan default untuk tombol Book (kiosk → potong rambut klasik).
const DEFAULT_SERVICE_ID = "svc-1";

function Stars({ value, gold = false }: { value: number; gold?: boolean }) {
  const n = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span className={`text-[13px] leading-none ${gold ? "text-[#D4AF37]" : "text-[#F9C74F]"}`}>
      {"★".repeat(n)}
      <span className="text-black/15">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export default function HairAnalysisClient() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [stage, setStage] = useState<Stage>("idle");
  const [captured, setCaptured] = useState<string>("");
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [camError, setCamError] = useState("");
  const [genError, setGenError] = useState("");

  const { detected, mode } = useFaceDetection(videoRef, stage === "camera");
  const canCapture = detected || mode === "unavailable";
  const limitReached = attempts >= MAX_ATTEMPTS;

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = async () => {
    setCamError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      setStage("camera");
    } catch {
      setCamError("Kamera nggak bisa diakses. Pastikan izin kamera udah kamu kasih ya.");
    }
  };

  useEffect(() => {
    if (stage === "camera" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [stage]);

  useEffect(() => () => stopStream(), [stopStream]);

  // Ambil frame, perkecil ke CAPTURE_MAX_DIM, kompres JPEG → payload ringan.
  const capture = () => {
    if (!detected && mode !== "unavailable") return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;
    const scale = Math.min(1, CAPTURE_MAX_DIM / Math.max(vw, vh));
    canvas.width = Math.round(vw * scale);
    canvas.height = Math.round(vh * scale);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setCaptured(canvas.toDataURL("image/jpeg", CAPTURE_QUALITY));
    stopStream();
    setGenError("");
    setStage("preview");
  };

  const retake = () => {
    setCaptured("");
    setData(null);
    setGenError("");
    startCamera();
  };

  // Jalankan pipeline AI penuh (STEP 1 vision + STEP 2 image gen) sekali jalan.
  const analyze = async () => {
    if (limitReached || !captured) return;
    setGenError("");
    setStage("generating");
    try {
      const res = await fetch("/api/hair-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: captured }),
      });
      if (!res.ok) throw new Error("gagal");
      const json = (await res.json()) as AnalysisResponse;
      setData(json);
      setAttempts((a) => a + 1);
      setStage("result");
    } catch {
      setGenError("Gagal menganalisa. Coba lagi sebentar ya.");
      setStage("preview");
    }
  };

  const bookThis = (pick: BestPick) => {
    setBookingPrefill({ hair_style: pick.name, service_id: DEFAULT_SERVICE_ID });
    router.push("/booking");
  };

  const reset = () => {
    stopStream();
    setStage("idle");
    setCaptured("");
    setData(null);
    setAttempts(0);
    setCamError("");
    setGenError("");
  };

  const analysis = data?.analysis;

  return (
    <div className="relative min-h-screen bg-[#FAF7EE] text-[#1a1a1a] selection:bg-[#F9C74F] selection:text-[#1a1a1a]">
      {/* Latar doodle compro */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[url('/pattern.png')] bg-cover bg-center opacity-50" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FAF7EE]/50 via-transparent to-[#FAF7EE]/90" />
      <div aria-hidden className="pointer-events-none absolute -top-16 -left-10 h-56 w-56 rounded-full bg-[#F9C74F]/30 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 -right-12 h-64 w-64 rounded-full bg-[#178E81]/15 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-2xl px-5 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[2px] text-[#178E81] font-body">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#178E81] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#178E81]" />
            </span>
            Teknologi AI · Hairstyle Analysis
          </span>
          <h1 className="font-display mt-3 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
            Scan dulu,{" "}
            <span className="relative inline-block text-[#7B5EA7]">
              gantenggg.
              <svg viewBox="0 0 240 18" className="absolute -bottom-1.5 left-0 h-3 w-full" preserveAspectRatio="none">
                <path d="M2 9 Q60 3 120 9 T238 8" stroke="#F9C74F" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-[#666] font-body">
            Pindai wajahmu sekali, AI bikin kartu analisa lengkap — bentuk wajah, gaya terbaik, sampai tips rambut.
          </p>
        </div>

        {/* ── IDLE ── */}
        {stage === "idle" && (
          <div className="animate-ha-pop space-y-6 text-center">
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[#F9C74F]/25" />
              <span className="absolute inset-3 rounded-full ring-1 ring-[#178E81]/30" />
              <svg className="h-16 w-16 text-[#178E81]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="mx-auto max-w-xs text-[14px] text-[#666] font-body">
              Aktifkan kamera, posisikan wajah di dalam oval, lalu ambil foto pas wajahmu kedeteksi.
            </p>
            {camError && (
              <p className="mx-auto max-w-sm rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">{camError}</p>
            )}
            <button
              onClick={startCamera}
              className="font-display inline-flex items-center justify-center gap-2 rounded-xl bg-[#F9C74F] px-7 py-3.5 text-[15px] font-bold text-[#1a1a1a] transition hover:bg-yellow-400 active:scale-95"
            >
              Aktifkan Kamera <span aria-hidden>→</span>
            </button>
          </div>
        )}

        {/* ── CAMERA ── */}
        {stage === "camera" && (
          <div className="animate-ha-pop space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-black shadow-lg ring-1 ring-black/5 sm:aspect-[4/3]">
              <video ref={videoRef} className="h-full w-full -scale-x-100 object-cover" playsInline muted />

              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[62%] w-[52%] -translate-x-1/2 -translate-y-1/2">
                  <div
                    className={`h-full w-full rounded-[50%] transition-colors duration-300 ${
                      detected ? "border-2 border-[#F9C74F] shadow-[0_0_40px_rgba(249,199,79,0.45)]" : "border-2 border-dashed border-white/50"
                    }`}
                  />
                  {detected && (
                    <>
                      <div className="animate-ha-ring absolute inset-0 rounded-[50%] border border-[#F9C74F]/60" />
                      <div className="absolute inset-0 overflow-hidden rounded-[50%]">
                        <div className="animate-ha-sweep absolute left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#178E81] to-transparent shadow-[0_0_12px_#178E81]" />
                      </div>
                      {["left-2 top-2 border-l-2 border-t-2", "right-2 top-2 border-r-2 border-t-2", "left-2 bottom-2 border-l-2 border-b-2", "right-2 bottom-2 border-r-2 border-b-2"].map((pos) => (
                        <span key={pos} className={`animate-ha-corner absolute h-5 w-5 rounded-[3px] border-[#F9C74F] ${pos}`} />
                      ))}
                    </>
                  )}
                </div>

                {mode === "loading" ? (
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
                    Memuat model deteksi…
                  </div>
                ) : detected ? (
                  <div className="animate-ha-badge absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#F9C74F] px-4 py-1.5 text-xs font-bold text-[#1a1a1a]">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Wajah terdeteksi
                  </div>
                ) : mode === "unavailable" ? (
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur">Deteksi wajah tidak tersedia</div>
                ) : (
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur">
                    <span className="flex gap-1">
                      <span className="animate-ha-search h-1.5 w-1.5 rounded-full bg-white/80" style={{ animationDelay: "0ms" }} />
                      <span className="animate-ha-search h-1.5 w-1.5 rounded-full bg-white/80" style={{ animationDelay: "200ms" }} />
                      <span className="animate-ha-search h-1.5 w-1.5 rounded-full bg-white/80" style={{ animationDelay: "400ms" }} />
                    </span>
                    Mencari wajah…
                  </div>
                )}
              </div>
            </div>

            {mode === "unavailable" && (
              <p className="text-center text-[11px] text-[#999] font-body">Deteksi wajah tidak tersedia di perangkat ini — kamu tetap bisa mengambil foto.</p>
            )}

            <div className="flex gap-3">
              <button onClick={reset} className="font-display flex-1 rounded-xl border-2 border-[#1a1a1a] py-3 text-[15px] font-bold text-[#1a1a1a] transition hover:bg-[#1a1a1a] hover:text-white">
                Batal
              </button>
              <button
                onClick={capture}
                disabled={!canCapture}
                className={`font-display flex-[1.4] rounded-xl py-3 text-[15px] font-bold transition active:scale-95 ${
                  canCapture ? "bg-[#F9C74F] text-[#1a1a1a] hover:bg-yellow-400" : "cursor-not-allowed bg-black/10 text-black/30"
                }`}
              >
                {mode === "loading" ? "Memuat model…" : canCapture ? "Ambil Foto" : "Tunggu deteksi wajah…"}
              </button>
            </div>
          </div>
        )}

        {/* ── PREVIEW: konfirmasi foto sebelum analisa ── */}
        {stage === "preview" && (
          <div className="animate-ha-pop space-y-5">
            <div className="overflow-hidden rounded-3xl bg-black shadow-lg ring-1 ring-black/5">
              <div className="aspect-[3/4] sm:aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={captured} alt="Foto kamu" className="h-full w-full -scale-x-100 object-cover" />
              </div>
            </div>

            <p className="text-center text-[13px] text-[#666] font-body">
              {limitReached ? "Analisa sudah dipakai untuk sesi ini." : "Foto sudah pas? AI cuma menganalisa sekali, jadi pastikan posisimu oke ya."}
            </p>

            {genError && (
              <p className="rounded-xl bg-rose-50 px-4 py-3 text-center text-sm text-rose-700 ring-1 ring-rose-200">{genError}</p>
            )}
            {limitReached && (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-center text-[13px] text-amber-700 ring-1 ring-amber-200 font-body">
                Kamu sudah pakai jatah analisa. Klik <b>Scan Ulang</b> untuk mulai sesi baru.
              </p>
            )}

            <div className="flex gap-3">
              <button onClick={retake} className="font-display flex-1 rounded-xl border-2 border-[#1a1a1a] py-3 text-[15px] font-bold text-[#1a1a1a] transition hover:bg-[#1a1a1a] hover:text-white">
                Ulang Foto
              </button>
              <button
                onClick={analyze}
                disabled={limitReached}
                className={`font-display flex-[1.4] rounded-xl py-3 text-[15px] font-bold transition active:scale-95 ${
                  limitReached ? "cursor-not-allowed bg-black/10 text-black/30" : "bg-[#F9C74F] text-[#1a1a1a] hover:bg-yellow-400"
                }`}
              >
                Analisa Sekarang →
              </button>
            </div>
          </div>
        )}

        {/* ── GENERATING ── */}
        {stage === "generating" && (
          <div className="space-y-6">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-black shadow-lg ring-1 ring-black/5 sm:aspect-[4/3]">
              {captured && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={captured} alt="" className="h-full w-full -scale-x-100 object-cover opacity-50" />
              )}
              <div className="absolute inset-0 overflow-hidden">
                <div className="animate-ha-sweep absolute left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#F9C74F] to-transparent shadow-[0_0_16px_#F9C74F]" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                <div className="relative h-16 w-16">
                  <div className="h-16 w-16 rounded-full border-4 border-[#F9C74F]/30" />
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#F9C74F] border-t-transparent" />
                </div>
                <p className="font-display text-lg font-bold">Menganalisa wajahmu…</p>
                <p className="text-xs text-white/70 font-body">AI lagi nyusun gaya & rekomendasi, bentar ya</p>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULT: kartu komposit + analisa ── */}
        {stage === "result" && analysis && data && (
          <div className="animate-ha-pop space-y-5">
            {/* Grid gaya hasil GPT Image 2 — bisa kosong jika diblokir moderasi */}
            {data.cardImage ? (
              <div className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-[#F9C74F]/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.cardImage} alt="Grid gaya rambut yang cocok" className="w-full object-contain" />
              </div>
            ) : (
              <div className="rounded-3xl bg-amber-50 p-4 text-center ring-1 ring-amber-200">
                <p className="font-display text-[14px] font-bold text-amber-800">Visualnya belum bisa dibuat</p>
                <p className="mt-1 text-[12px] text-amber-700 font-body">
                  Gambar gaya tidak lolos sistem keamanan AI kali ini, tapi analisa & rekomendasimu di bawah tetap akurat. Coba foto ulang dengan pencahayaan lebih jelas.
                </p>
              </div>
            )}
            {data.source === "dummy" && (
              <p className="text-center text-[11px] text-[#999] font-body">
                Mode demo — grid gaya muncul setelah <code>OPENAI_API_KEY</code> di-set.
              </p>
            )}

            {/* Bentuk wajah & tipe rambut */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#999] font-body">Bentuk Wajah</p>
                <p className="font-display mt-1 text-lg font-bold text-[#1a1a1a]">{analysis.face_shape}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#666] font-body">{analysis.face_shape_desc}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#999] font-body">Tipe Rambut</p>
                <p className="font-display mt-1 text-lg font-bold text-[#1a1a1a]">{analysis.hair_type}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#666] font-body">Gaya sekarang: {analysis.current_style}</p>
              </div>
            </div>

            {/* Best picks */}
            <div className="rounded-3xl bg-[#2D3B2A] p-4 text-white shadow-md">
              <p className="font-display mb-3 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-[#D4AF37]">
                <span aria-hidden>👑</span> Best Picks
              </p>
              <div className="space-y-3">
                {analysis.best_picks.map((pick) => (
                  <div key={pick.rank} className="flex items-start gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-[13px] font-bold text-[#2D3B2A]">{pick.rank}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-display truncate text-[15px] font-bold">{pick.name}</p>
                        <Stars value={pick.rating} gold />
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {pick.benefits.filter(Boolean).map((b) => (
                          <span key={b} className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/80 font-body">{b}</span>
                        ))}
                      </div>
                      <button
                        onClick={() => bookThis(pick)}
                        className="font-display mt-2.5 rounded-lg bg-[#F9C74F] px-3.5 py-1.5 text-[12px] font-bold text-[#1a1a1a] transition hover:bg-yellow-400 active:scale-95"
                      >
                        Book Gaya Ini →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hair tips */}
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <p className="font-display mb-2 text-[13px] font-bold uppercase tracking-wider text-[#178E81]">Hair Tips</p>
              <ul className="space-y-1.5">
                {analysis.hair_tips.filter(Boolean).map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-[13px] text-[#444] font-body">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F9C74F]" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={reset} className="font-display w-full rounded-xl bg-[#F9C74F] py-3 text-[15px] font-bold text-[#1a1a1a] transition hover:bg-yellow-400 active:scale-95">
              Scan Ulang
            </button>
          </div>
        )}

        {/* Canvas tersembunyi untuk capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

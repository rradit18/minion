"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { setBookingPrefill } from "@/src/lib/localStorage";
import { useFaceDetection } from "./useFaceDetection";
import { HAIR_STYLES, type HairStyleOption } from "./styles";

const ReactCompareSlider = dynamic(
  () => import("react-compare-slider").then((m) => m.ReactCompareSlider),
  { ssr: false },
);
const ReactCompareSliderImage = dynamic(
  () => import("react-compare-slider").then((m) => m.ReactCompareSliderImage),
  { ssr: false },
);

type Stage = "idle" | "camera" | "catalog" | "generating" | "result";

interface AnalysisResult {
  id: string;
  styleName: string;
  description: string;
  imageUrl: string;
  difficulty: string;
  maintenance: string;
  tags: string[];
  recommendedServiceId: string;
}

const MAX_ATTEMPTS = 3; // batasi pemanggilan AI per sesi (kontrol biaya)

const diffColor: Record<string, string> = {
  Easy: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Medium: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Hard: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

export default function HairAnalysisClient() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [stage, setStage] = useState<Stage>("idle");
  const [captured, setCaptured] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeStyle, setActiveStyle] = useState<HairStyleOption | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [camError, setCamError] = useState("");
  const [genError, setGenError] = useState("");

  const { detected, mode } = useFaceDetection(videoRef, stage === "camera");
  const canCapture = detected || mode === "unavailable";
  const remaining = MAX_ATTEMPTS - attempts;
  const limitReached = remaining <= 0;

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

  const capture = () => {
    if (!detected && mode !== "unavailable") return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    setCaptured(canvas.toDataURL("image/jpeg", 0.9));
    stopStream();
    setStage("catalog");
  };

  const retake = () => {
    setCaptured("");
    setResult(null);
    setGenError("");
    startCamera();
  };

  // Generate SATU gaya on-demand (1 call LightX = 1 gaya = 1 gambar).
  const tryStyle = async (style: HairStyleOption) => {
    if (limitReached || !captured) return;
    setGenError("");
    setActiveStyle(style);
    setStage("generating");
    try {
      const res = await fetch("/api/hair-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: captured, styleId: style.id }),
      });
      if (!res.ok) throw new Error("gagal");
      const data = (await res.json()) as { result: AnalysisResult };
      setResult(data.result);
      setAttempts((a) => a + 1);
      setStage("result");
    } catch {
      setGenError("Gagal membuat gaya. Coba lagi sebentar ya.");
      setStage("catalog");
    }
  };

  const bookThis = (r: AnalysisResult) => {
    setBookingPrefill({ hair_style: r.styleName, service_id: r.recommendedServiceId });
    router.push("/booking");
  };

  const reset = () => {
    stopStream();
    setStage("idle");
    setCaptured("");
    setResult(null);
    setActiveStyle(null);
    setAttempts(0);
    setCamError("");
    setGenError("");
  };

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
            Teknologi AI · LightX
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
            Pindai wajahmu, pilih gaya, biar AI yang nunjukin hasilnya — tinggal cocok, langsung book.
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

        {/* ── CATALOG: pilih gaya ── */}
        {stage === "catalog" && (
          <div className="animate-ha-pop space-y-5">
            {/* Foto hasil capture + retake */}
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={captured} alt="Foto kamu" className="h-full w-full -scale-x-100 object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15px] font-bold leading-tight">Pilih gaya buat dicoba</p>
                <p className="text-[12px] text-[#666] font-body">
                  {limitReached ? "Batas percobaan tercapai." : `Sisa ${remaining} percobaan AI sesi ini.`}
                </p>
              </div>
              <button onClick={retake} className="font-display shrink-0 rounded-lg border border-[#1a1a1a]/20 px-3 py-2 text-[12px] font-bold text-[#1a1a1a] transition hover:bg-[#1a1a1a] hover:text-white">
                Ulang foto
              </button>
            </div>

            {genError && (
              <p className="rounded-xl bg-rose-50 px-4 py-3 text-center text-sm text-rose-700 ring-1 ring-rose-200">{genError}</p>
            )}
            {limitReached && (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-center text-[13px] text-amber-700 ring-1 ring-amber-200 font-body">
                Kamu sudah pakai {MAX_ATTEMPTS} percobaan. Klik <b>Scan Ulang</b> untuk mulai sesi baru.
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {HAIR_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => tryStyle(s)}
                  disabled={limitReached}
                  className={`group overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-gray-100 transition ${
                    limitReached ? "cursor-not-allowed opacity-50" : "hover:-translate-y-0.5 hover:shadow-lg hover:ring-[#F9C74F]"
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.reference} alt={s.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/75 to-transparent p-2.5">
                      <p className="text-xs font-bold leading-tight text-white">{s.name}</p>
                      {!limitReached && (
                        <span className="shrink-0 rounded-full bg-[#F9C74F] px-2 py-0.5 text-[9px] font-bold text-[#1a1a1a]">Coba</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button onClick={reset} className="font-display w-full rounded-xl border-2 border-[#1a1a1a] py-3 text-[15px] font-bold text-[#1a1a1a] transition hover:bg-[#1a1a1a] hover:text-white">
              Scan Ulang
            </button>
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
                <p className="font-display text-lg font-bold">Bikin gaya {activeStyle?.name ?? ""}…</p>
                <p className="text-xs text-white/70 font-body">AI lagi kerja, bentar ya</p>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULT: before/after ── */}
        {stage === "result" && result && (
          <div className="animate-ha-pop space-y-5">
            <div className="overflow-hidden rounded-3xl bg-black shadow-lg ring-1 ring-black/5">
              <div className="aspect-[3/4] sm:aspect-[4/3]">
                <ReactCompareSlider
                  className="h-full w-full"
                  itemOne={<ReactCompareSliderImage src={captured} alt="Sebelum" style={{ objectFit: "cover" }} />}
                  itemTwo={<ReactCompareSliderImage src={result.imageUrl} alt={result.styleName} style={{ objectFit: "cover" }} />}
                />
              </div>
            </div>
            <div className="flex justify-between px-1 text-[11px] font-bold uppercase tracking-wider text-[#999] font-body">
              <span>Sebelum</span>
              <span className="text-[#178E81]">Sesudah · {result.styleName}</span>
            </div>

            {/* Detail gaya */}
            <div className="rounded-3xl bg-white p-4 shadow-md ring-1 ring-[#F9C74F]/40">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-[#1a1a1a]">{result.styleName}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${diffColor[result.difficulty] ?? ""}`}>{result.difficulty}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#666] font-body">{result.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {result.tags.map((t) => (
                  <span key={t} className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-[#666] font-body">#{t}</span>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-[#999] font-body">Perawatan: {result.maintenance}</p>
              <button
                onClick={() => bookThis(result)}
                className="font-display mt-4 w-full rounded-xl bg-[#F9C74F] py-3 text-[15px] font-bold text-[#1a1a1a] transition hover:bg-yellow-400 active:scale-95"
              >
                Book Gaya Ini →
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStage("catalog")}
                disabled={limitReached}
                className={`font-display flex-1 rounded-xl border-2 py-3 text-[15px] font-bold transition ${
                  limitReached ? "cursor-not-allowed border-black/10 text-black/30" : "border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white"
                }`}
              >
                {limitReached ? "Batas tercapai" : `Coba gaya lain (${remaining})`}
              </button>
              <button onClick={reset} className="font-display flex-1 rounded-xl bg-[#F9C74F] py-3 text-[15px] font-bold text-[#1a1a1a] transition hover:bg-yellow-400 active:scale-95">
                Scan Ulang
              </button>
            </div>
          </div>
        )}

        {/* Canvas tersembunyi untuk capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

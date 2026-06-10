"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchHairStyles } from "@/src/lib/mockData";
import { setBookingPrefill } from "@/src/lib/localStorage";
import type { HairStyle } from "@/src/lib/mockData";

type Stage = "idle" | "camera" | "captured" | "scanning" | "results";

export default function HairAnalysisClient() {
  const router        = useRouter();
  const videoRef      = useRef<HTMLVideoElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const streamRef     = useRef<MediaStream | null>(null);

  const [stage, setStage]           = useState<Stage>("idle");
  const [results, setResults]       = useState<HairStyle[]>([]);
  const [visibleCount, setVisible]  = useState(0);
  const [selected, setSelected]     = useState<HairStyle | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [camError, setCamError]     = useState("");

  const hairStyles = fetchHairStyles();

  // Start camera
  const startCamera = async () => {
    setCamError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStage("camera");
    } catch {
      setCamError("Kamera tidak tersedia. Pastikan izin kamera diberikan.");
    }
  };

  // Capture photo
  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    canvasRef.current.width  = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    // Stop stream
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setStage("captured");
  };

  // Simulate scan + progressive results
  const startScan = useCallback(() => {
    setStage("scanning");
    setScanProgress(0);
    setVisible(0);

    // Progress bar
    const progressInterval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) { clearInterval(progressInterval); return 100; }
        return p + 2;
      });
    }, 50);

    // After 2.5s, show results progressively
    setTimeout(() => {
      setStage("results");
      const shuffled = [...hairStyles].sort(() => Math.random() - 0.5).slice(0, 6);
      setResults(shuffled);

      shuffled.forEach((_, i) => {
        setTimeout(() => setVisible(i + 1), i * 200);
      });
    }, 2500);
  }, [hairStyles]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, []);

  const handleBookThis = (style: HairStyle) => {
    setBookingPrefill({ hair_style: style.name, service_id: style.recommended_services[0] });
    router.push("/booking");
  };

  const reset = () => {
    setStage("idle");
    setResults([]);
    setVisible(0);
    setSelected(null);
    setScanProgress(0);
    setCamError("");
  };

  const diffColor: Record<string, string> = {
    Easy:   "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard:   "bg-red-100 text-red-600",
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[#F9C74F] text-xs font-bold uppercase tracking-widest mb-2">AI Powered</p>
          <h1 className="text-3xl font-black">Hair Style Analyzer</h1>
          <p className="text-gray-400 text-sm mt-2">Temukan gaya rambut terbaik untuk kamu</p>
        </div>

        {/* Stage: IDLE */}
        {stage === "idle" && (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto text-6xl">💇</div>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">Aktifkan kamera, ambil foto, dan biarkan AI merekomendasikan 6 gaya terbaik untukmu</p>
            {camError && <p className="text-red-400 text-sm bg-red-900/30 rounded-xl px-4 py-3">{camError}</p>}
            <button onClick={startCamera}
              className="bg-[#F9C74F] text-black font-extrabold px-8 py-3.5 rounded-2xl text-sm hover:bg-yellow-400 transition-colors">
              📸 Aktifkan Kamera
            </button>
          </div>
        )}

        {/* Stage: CAMERA */}
        {stage === "camera" && (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              {/* Guide overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-60 border-2 border-[#F9C74F] rounded-[50%] opacity-60" />
              </div>
              <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/60">Posisikan wajah di dalam oval</p>
            </div>
            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 border-2 border-gray-600 text-gray-300 font-bold py-3 rounded-xl text-sm hover:bg-white/5 transition-colors">Batal</button>
              <button onClick={capture} className="flex-1 bg-[#F9C74F] text-black font-extrabold py-3 rounded-xl text-sm hover:bg-yellow-400 transition-colors">📸 Ambil Foto</button>
            </div>
          </div>
        )}

        {/* Stage: CAPTURED */}
        {stage === "captured" && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-black aspect-[4/3]">
              <canvas ref={canvasRef} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { reset(); setTimeout(startCamera, 100); }}
                className="flex-1 border-2 border-gray-600 text-gray-300 font-bold py-3 rounded-xl text-sm hover:bg-white/5 transition-colors">
                🔄 Ulangi
              </button>
              <button onClick={startScan}
                className="flex-1 bg-[#F9C74F] text-black font-extrabold py-3 rounded-xl text-sm hover:bg-yellow-400 transition-colors">
                🔍 Analisis Sekarang
              </button>
            </div>
          </div>
        )}

        {/* Stage: SCANNING */}
        {stage === "scanning" && (
          <div className="text-center space-y-6 py-10">
            <div className="w-20 h-20 mx-auto relative">
              <div className="w-20 h-20 border-4 border-[#F9C74F]/30 rounded-full" />
              <div className="absolute inset-0 border-4 border-[#F9C74F] border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <p className="font-black text-xl mb-2">Menganalisis rambut kamu...</p>
              <p className="text-gray-400 text-sm">AI sedang bekerja</p>
            </div>
            <div className="bg-white/10 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
              <div className="h-full bg-[#F9C74F] rounded-full transition-all duration-100" style={{ width: `${scanProgress}%` }} />
            </div>
            <p className="text-[#F9C74F] font-bold text-sm">{scanProgress}%</p>
          </div>
        )}

        {/* Stage: RESULTS */}
        {stage === "results" && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-[#F9C74F] font-bold text-sm mb-1">✨ Analisis Selesai!</p>
              <h2 className="text-xl font-black">6 Gaya Terbaik untukmu</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {results.slice(0, visibleCount).map((style) => (
                <button key={style.id} onClick={() => setSelected(style)}
                  className={`bg-white/5 border-2 rounded-2xl p-4 text-left transition-all hover:border-[#F9C74F] ${selected?.id === style.id ? "border-[#F9C74F] bg-[#F9C74F]/10" : "border-white/10"}`}>
                  <div className="w-full aspect-square bg-white/10 rounded-xl mb-3 flex items-center justify-center text-4xl">💇</div>
                  <p className="font-bold text-sm">{style.name}</p>
                  <p className="text-gray-400 text-[10px] mt-1 line-clamp-2">{style.description}</p>
                  <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${diffColor[style.difficulty]}`}>{style.difficulty}</span>
                </button>
              ))}
            </div>

            {/* Selected detail */}
            {selected && (
              <div className="bg-white/5 rounded-2xl p-5 border border-[#F9C74F]/30">
                <h3 className="font-black text-lg text-[#F9C74F] mb-2">{selected.name}</h3>
                <p className="text-gray-300 text-sm mb-3">{selected.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="bg-white/10 text-gray-300 text-xs px-2.5 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mb-1">🔧 Maintenance: {selected.maintenance}</p>
                <button onClick={() => handleBookThis(selected)}
                  className="w-full mt-3 bg-[#F9C74F] text-black font-extrabold py-3 rounded-xl text-sm hover:bg-yellow-400 transition-colors">
                  Book Gaya Ini →
                </button>
              </div>
            )}

            <button onClick={reset} className="w-full border-2 border-gray-600 text-gray-300 font-bold py-3 rounded-xl text-sm hover:bg-white/5 transition-colors">
              🔄 Analisis Ulang
            </button>
          </div>
        )}

        {/* Hidden canvas */}
        {stage !== "captured" && stage !== "camera" && <canvas ref={canvasRef} className="hidden" />}
      </div>
    </div>
  );
}

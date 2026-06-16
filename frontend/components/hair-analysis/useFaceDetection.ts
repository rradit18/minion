"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { FilesetResolver, FaceDetector } from "@mediapipe/tasks-vision";

/**
 * Deteksi wajah realtime dari elemen <video>.
 *
 * Prioritas detektor:
 *  1. MediaPipe FaceDetector (BlazeFace, WASM) — model wajah sungguhan,
 *     jalan di semua browser modern. WASM + model dimuat dari CDN.
 *  2. Native Shape Detection API (`window.FaceDetector`) — fallback kalau
 *     MediaPipe gagal dimuat (mis. offline).
 *  3. "unavailable" — kalau dua-duanya tidak ada; capture dibebaskan agar
 *     pengguna tetap bisa lanjut (lihat consumer).
 *
 * Status `detected` di-debounce supaya tidak berkedip.
 */

export type DetectorMode = "loading" | "mediapipe" | "native" | "unavailable";

interface NativeFaceDetectorLike {
  detect(source: CanvasImageSource): Promise<Array<{ boundingBox: DOMRectReadOnly }>>;
}

declare global {
  interface Window {
    FaceDetector?: new (opts?: { fastMode?: boolean; maxDetectedFaces?: number }) => NativeFaceDetectorLike;
  }
}

// CDN MediaPipe — dipin ke versi yang sama dgn package (lihat package.json).
const WASM_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";

const MIN_SCORE = 0.5;     // ambang kepercayaan deteksi
const ON_THRESHOLD = 2;    // frame berturut terdeteksi -> ON
const OFF_THRESHOLD = 5;   // frame berturut hilang -> OFF
const INTERVAL_MS = 120;

export function useFaceDetection(
  videoRef: RefObject<HTMLVideoElement | null>,
  active: boolean,
) {
  const [detected, setDetected] = useState(false);
  const [mode, setMode] = useState<DetectorMode>("loading");

  const hitsRef = useRef(0);
  const missesRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let mpDetector: FaceDetector | null = null;
    let nativeDetector: NativeFaceDetectorLike | null = null;
    hitsRef.current = 0;
    missesRef.current = 0;

    const applyResult = (found: boolean) => {
      if (cancelled) return;
      if (found) {
        hitsRef.current += 1;
        missesRef.current = 0;
        if (hitsRef.current >= ON_THRESHOLD) setDetected(true);
      } else {
        missesRef.current += 1;
        hitsRef.current = 0;
        if (missesRef.current >= OFF_THRESHOLD) setDetected(false);
      }
    };

    const detectOnce = async (video: HTMLVideoElement): Promise<boolean> => {
      if (mpDetector) {
        const res = mpDetector.detectForVideo(video, performance.now());
        return res.detections.some((d) => (d.categories?.[0]?.score ?? 1) >= MIN_SCORE);
      }
      if (nativeDetector) {
        const faces = await nativeDetector.detect(video);
        return faces.length > 0;
      }
      return false;
    };

    const loop = async () => {
      const video = videoRef.current;
      if (!cancelled && video && video.readyState >= 2 && video.videoWidth > 0) {
        try {
          applyResult(await detectOnce(video));
        } catch {
          // Frame belum siap / detektor sibuk — abaikan frame ini.
        }
      }
      if (!cancelled) timer = setTimeout(loop, INTERVAL_MS);
    };

    const init = async () => {
      // 1) Coba MediaPipe.
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_CDN);
        if (cancelled) return;
        mpDetector = await FaceDetector.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          minDetectionConfidence: MIN_SCORE,
        });
        if (cancelled) {
          mpDetector.close();
          mpDetector = null;
          return;
        }
        setMode("mediapipe");
        loop();
        return;
      } catch {
        // lanjut ke fallback
      }

      // 2) Fallback native FaceDetector.
      const Ctor = typeof window !== "undefined" ? window.FaceDetector : undefined;
      if (Ctor) {
        nativeDetector = new Ctor({ fastMode: true, maxDetectedFaces: 1 });
        if (cancelled) return;
        setMode("native");
        loop();
        return;
      }

      // 3) Tidak ada detektor sama sekali.
      if (!cancelled) setMode("unavailable");
    };

    init();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      mpDetector?.close();
      mpDetector = null;
      nativeDetector = null;
      setDetected(false);
      setMode("loading");
      hitsRef.current = 0;
      missesRef.current = 0;
    };
  }, [active, videoRef]);

  return { detected, mode };
}

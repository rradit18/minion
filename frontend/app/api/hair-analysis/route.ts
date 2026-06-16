import { NextResponse } from "next/server";
import {
  analyzeFace,
  generateHairstyleCard,
  hasOpenAI,
  type HairAnalysis,
} from "@/src/lib/openaiHair";

export const runtime = "nodejs";
// Pipeline AI bisa makan waktu (vision + image gen). Beri ruang eksekusi lebih.
export const maxDuration = 120;

export interface HairAnalysisResponse {
  analysis: HairAnalysis;
  cardImage: string; // gambar grid (data URL) — "" jika gagal/diblokir moderasi
  source: "openai" | "dummy";
  imageError?: string; // alasan gambar tak tersedia (analisa teks tetap ada)
}

// Analisa contoh untuk mode dummy (tanpa OPENAI_API_KEY) — agar UI tetap bisa dites.
const DUMMY_ANALYSIS: HairAnalysis = {
  face_shape: "Oval",
  face_shape_desc: "Proporsi seimbang, fleksibel untuk hampir semua gaya.",
  hair_type: "Straight to Wavy",
  current_style: "Middle Part",
  grid_styles: [
    { name: "Two Block", visual: "short faded sides, fuller textured top swept back", rating: 5, tag: "" },
    { name: "Comma Hair", visual: "side-swept fringe with a soft curl at the ends", rating: 5, tag: "" },
    { name: "Middle Part", visual: "hair parted in the middle, soft natural fall", rating: 4, tag: "CURRENT" },
    { name: "Side Part", visual: "clean professional side parting", rating: 4, tag: "" },
    { name: "Textured Fringe", visual: "messy textured front fringe", rating: 4, tag: "" },
    { name: "Curly Top", visual: "natural curly texture on top, shorter sides", rating: 4, tag: "" },
  ],
  best_picks: [
    { rank: 1, name: "Two Block", benefits: ["Modern look", "Easy styling", "Frames face", "Trendy now"], rating: 5 },
    { rank: 2, name: "Comma Hair", benefits: ["Soft texture", "Youthful vibe", "Natural flow", "Korean style"], rating: 5 },
    { rank: 3, name: "Side Part", benefits: ["Clean cut", "Professional", "Timeless", "Versatile"], rating: 4 },
  ],
  hair_tips: ["Pakai pomade ringan", "Keringkan dari akar", "Trim tiap 3 minggu"],
};

/**
 * Analisa gaya rambut dari satu foto selfie.
 * Body: { image: dataURL }
 *
 * STEP 1 GPT-4o Vision -> JSON analisa (AI memilih gaya yang cocok).
 * STEP 2 GPT Image 2   -> grid gaya pilihan AI di wajah orangnya.
 * Lihat hairstyle_analysis_prompts.md.
 */
export async function POST(request: Request) {
  let image: string | undefined;
  try {
    const body = (await request.json()) as { image?: string };
    image = body.image;
  } catch {
    return NextResponse.json({ message: "Body harus JSON { image }" }, { status: 400 });
  }

  if (!image || !image.startsWith("data:image/")) {
    return NextResponse.json({ message: "Field 'image' (data URL) wajib diisi" }, { status: 400 });
  }

  // ── DUMMY: tanpa API key, balikan analisa contoh + foto asli sbg placeholder. ──
  if (!hasOpenAI()) {
    await new Promise((r) => setTimeout(r, 1500));
    const body: HairAnalysisResponse = { analysis: DUMMY_ANALYSIS, cardImage: image, source: "dummy" };
    return NextResponse.json(body);
  }

  try {
    const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(image);
    if (!match) {
      return NextResponse.json({ message: "Format data URL tidak valid" }, { status: 400 });
    }
    const contentType = match[1];
    const buffer = Buffer.from(match[2], "base64");

    // STEP 1 — analisa wajah (AI memilih gaya yang cocok).
    const analysis = await analyzeFace(image);

    // STEP 2 — grid gaya pilihan AI (butuh hasil STEP 1, jadi berurutan).
    // Gambar bisa diblokir safety system OpenAI; jangan jadikan fatal — analisa
    // teks tetap dikembalikan, hanya gridnya yang kosong.
    let cardImage = "";
    let imageError: string | undefined;
    try {
      cardImage = await generateHairstyleCard(buffer, analysis, contentType);
    } catch (err) {
      imageError = err instanceof Error ? err.message : "Gambar gagal dibuat";
    }

    const body: HairAnalysisResponse = { analysis, cardImage, source: "openai", imageError };
    return NextResponse.json(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal memproses analisa";
    return NextResponse.json({ message }, { status: 502 });
  }
}

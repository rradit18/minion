import { NextResponse } from "next/server";
import { getStyle } from "@/components/hair-analysis/styles";
// import { generateHairstyle } from "@/src/lib/lightx"; // <- aktifkan saat pakai LightX

export const runtime = "nodejs";

export interface AnalysisResult {
  id: string;
  styleName: string;
  description: string;
  imageUrl: string; // gambar hasil ("after") — image-to-image
  difficulty: string;
  maintenance: string;
  tags: string[];
  recommendedServiceId: string;
}

/**
 * Generate SATU hasil gaya rambut untuk gambar wajah yang dikirim.
 * Body: { image: dataURL, styleId: string }
 *
 * On-demand: 1 call = 1 gaya = 1 gambar (hemat biaya & latency LightX).
 */
export async function POST(request: Request) {
  let image: string | undefined;
  let styleId: string | undefined;
  try {
    const body = (await request.json()) as { image?: string; styleId?: string };
    image = body.image;
    styleId = body.styleId;
  } catch {
    return NextResponse.json({ message: "Body harus JSON { image, styleId }" }, { status: 400 });
  }

  if (!image || !image.startsWith("data:image/")) {
    return NextResponse.json({ message: "Field 'image' (data URL) wajib diisi" }, { status: 400 });
  }
  const style = styleId ? getStyle(styleId) : undefined;
  if (!style) {
    return NextResponse.json({ message: "styleId tidak dikenal" }, { status: 400 });
  }

  // ── DUMMY: simulasi waktu proses AI, balikan gambar referensi sebagai "hasil" ──
  await new Promise((r) => setTimeout(r, 1800));
  const result: AnalysisResult = {
    id: style.id,
    styleName: style.name,
    description: style.description,
    imageUrl: style.reference,
    difficulty: style.difficulty,
    maintenance: style.maintenance,
    tags: style.tags,
    recommendedServiceId: style.recommendedServiceId,
  };
  return NextResponse.json({ result, source: "dummy" });

  // ── PRODUKSI (LightX): hapus blok dummy di atas & pakai ini ───────────────
  // const base64 = image.split(",")[1];
  // const buffer = Buffer.from(base64, "base64");
  // const output = await generateHairstyle(buffer, style.prompt);
  // const result: AnalysisResult = {
  //   id: style.id,
  //   styleName: style.name,
  //   description: style.description,
  //   imageUrl: output, // URL gambar hasil dari LightX
  //   difficulty: style.difficulty,
  //   maintenance: style.maintenance,
  //   tags: style.tags,
  //   recommendedServiceId: style.recommendedServiceId,
  // };
  // return NextResponse.json({ result, source: "lightx" });
}

/**
 * OpenAI — pipeline analisa gaya rambut (2 langkah).
 *
 * Dipakai SERVER-SIDE saja (di Route Handler) supaya `OPENAI_API_KEY` tidak
 * pernah bocor ke browser. Jangan import file ini dari komponen client.
 *
 * Alur (lihat hairstyle_analysis_prompts.md):
 *   STEP 1  analyzeFace          -> GPT-4o Vision: foto selfie -> JSON analisa.
 *   STEP 2  generateHairstyleCard-> GPT Image 2 (images.edit): foto + JSON ->
 *           satu gambar kartu infografik komposit (8 panel + best picks).
 *
 * Pakai fetch ke REST API OpenAI (konsisten dgn src/lib/lightx.ts, tanpa SDK).
 */

const BASE = "https://api.openai.com/v1";

// ─── Tipe hasil analisa (mengikuti struktur JSON di prompts.md) ──────────────
export interface GridStyle {
  name: string;
  visual: string; // deskripsi visual singkat untuk image model
  rating: number;
  tag: string;
}

export interface BestPick {
  rank: number;
  name: string;
  benefits: string[];
  rating: number;
}

export interface HairAnalysis {
  face_shape: string;
  face_shape_desc: string;
  hair_type: string;
  current_style: string;
  grid_styles: GridStyle[];
  best_picks: BestPick[];
  hair_tips: string[];
}

function apiKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY belum di-set di environment");
  return key;
}

export function hasOpenAI(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

// ─── STEP 1 — Analisa wajah (GPT-4o Vision) ──────────────────────────────────
const SYSTEM_PROMPT = `You are an expert hair stylist and face shape analyst with 15 years of experience.
Your job is to analyze customer photos and recommend the best hairstyles for their face shape and hair type.
Always respond with valid JSON only — no markdown, no explanation, no code blocks.
Be specific, practical, and encouraging in your recommendations.`;

const USER_PROMPT = `Analyze this customer's face photo carefully and recommend hairstyles that genuinely SUIT them.

Return ONLY this exact JSON structure (no other text):

{
  "face_shape": "",
  "face_shape_desc": "",
  "hair_type": "",
  "current_style": "",
  "grid_styles": [
    { "name": "", "visual": "", "rating": 0, "tag": "" }
  ],
  "best_picks": [
    { "rank": 1, "name": "", "benefits": ["", "", "", ""], "rating": 0 },
    { "rank": 2, "name": "", "benefits": ["", "", "", ""], "rating": 0 },
    { "rank": 3, "name": "", "benefits": ["", "", "", ""], "rating": 0 }
  ],
  "hair_tips": ["", "", ""]
}

Rules:
- grid_styles: choose EXACTLY 6 men's hairstyles that suit THIS person's face shape and hair type. Pick real, varied, current styles — do NOT use a fixed/default list, tailor them to the face. Order from most to least recommended.
- For the style closest to the person's current hair, set tag "CURRENT" (otherwise "").
- visual: concise visual description of the hairstyle for an image generator, 8-12 words (e.g. "short faded sides, textured voluminous top swept slightly back").
- rating: integer 1-5 (how well the style suits this specific person).
- face_shape: Oval / Round / Square / Heart / Diamond / Oblong
- hair_type: Straight / Wavy / Curly / Coily — you can combine e.g. "Straight to Wavy"
- best_picks: the top 3 styles from grid_styles (names MUST match exactly), each with up to 4 benefits (max 3 words each, friendly tone).
- hair_tips: practical, actionable, short (max 6 words each)`;

/** Langkah 1: kirim foto ke GPT-4o, balikan objek HairAnalysis. */
export async function analyzeFace(imageDataUrl: string): Promise<HairAnalysis> {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey()}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 1000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageDataUrl, detail: "low" } },
            { type: "text", text: USER_PROMPT },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GPT-4o analisa gagal: ${res.status} ${detail}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  const raw = data.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(raw) as HairAnalysis;
}

// ─── STEP 2 — Generate grid gaya pilihan AI (GPT Image 2) ────────────────────
//
// Prompt DINAMIS — gaya rambut diambil dari grid_styles hasil analisa, jadi yang
// ditampilkan benar-benar gaya yang cocok untuk wajah orang itu. Teks, rating,
// best picks & tips tetap dirender di UI (HTML), bukan di dalam gambar.
export function buildGridPrompt(a: HairAnalysis): string {
  const styles = a.grid_styles.slice(0, 6);
  const cols = styles.length <= 4 ? 2 : 3;
  const rows = Math.ceil(styles.length / cols);
  const panels = styles
    .map((s, i) => `${i + 1}) "${s.name}" — ${s.visual || s.name}`)
    .join("\n");

  return `Edit the uploaded photo into a clean ${rows}x${cols} grid (${rows} rows, ${cols} columns) of portrait panels of THIS EXACT PERSON, each panel showing a DIFFERENT hairstyle that suits them.

CRITICAL: Keep the face 100% identical in every panel — same person, same skin tone, bone structure, eyes, expression, and lighting direction. ONLY the hair changes between panels.

Landscape orientation. Warm cream/beige background (#F5F0E8). Rounded-corner panels with a subtle border and consistent warm studio lighting. Each panel has a small dark olive (#2D3B2A) chip at the bottom with the hairstyle name in clean white text.

Panels (left to right, top to bottom):
${panels}

Modern barbershop/salon aesthetic, professional portrait photography quality, realistic and visually distinct hairstyles. No title, no sidebar, no ratings, no stars, no icons, no extra text — ONLY the portrait panels with their small name labels.`;
}

/**
 * Langkah 2: kirim foto + analisa ke GPT Image 2 (images.edit) -> grid gaya
 * yang cocok. Balikan data URL (data:image/png;base64,...).
 */
export async function generateHairstyleCard(
  imageBuffer: Buffer,
  analysis: HairAnalysis,
  contentType = "image/jpeg",
): Promise<string> {
  const form = new FormData();
  form.append("model", "gpt-image-2");
  form.append("prompt", buildGridPrompt(analysis));
  form.append("size", "1536x1024");
  form.append("quality", "low");
  form.append("moderation", "low"); // kurangi blokir berlebihan saat edit wajah
  form.append("n", "1");
  const ext = contentType.includes("png") ? "png" : "jpg";
  form.append("image", new Blob([new Uint8Array(imageBuffer)], { type: contentType }), `selfie.${ext}`);

  const res = await fetch(`${BASE}/images/edits`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey()}` },
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GPT Image 2 gagal: ${res.status} ${detail}`);
  }

  const data = (await res.json()) as { data: { b64_json?: string; url?: string }[] };
  const item = data.data?.[0];
  if (item?.b64_json) return `data:image/png;base64,${item.b64_json}`;
  if (item?.url) return item.url;
  throw new Error("GPT Image 2 tidak mengembalikan gambar");
}

import hairStyles from "@/src/mocks/hair-styles.json";

/**
 * Katalog gaya rambut untuk AI Hair Analysis.
 *
 * Dibangun dari data mock hair-styles.json, ditambah:
 *  - `prompt`    : teks yang dikirim ke LightX (image-to-image).
 *  - `reference` : thumbnail contoh STATIS (aset publik) untuk katalog —
 *                  tidak memanggil API, jadi katalog tampil instan & gratis.
 *
 * Modul ini dipakai bersama oleh client (tampilan katalog) dan Route Handler
 * (ambil prompt) — tidak ada kode khusus server, aman di kedua sisi.
 */

export interface HairStyleOption {
  id: string;
  name: string;
  prompt: string;
  reference: string;
  description: string;
  difficulty: string;
  maintenance: string;
  tags: string[];
  recommendedServiceId: string;
}

const EXTRA: Record<string, { prompt: string; reference: string }> = {
  "style-1": { prompt: "mid fade haircut, clean tapered sides, short neat top", reference: "/gallery1.jpg" },
  "style-2": { prompt: "textured crop haircut, natural messy top, faded sides", reference: "/gallery3.jpg" },
  "style-3": { prompt: "classic pompadour hairstyle, high volume swept back, short sides", reference: "/gallery5.jpg" },
  "style-4": { prompt: "skin fade with sharp line up, edgy precise hairline", reference: "/gallery7.jpg" },
  "style-5": { prompt: "curly taper haircut, natural curls on top, clean taper sides", reference: "/gallery9.jpg" },
  "style-6": { prompt: "modern quiff hairstyle, volume in front, faded sides", reference: "/gallery11.jpg" },
  "style-7": { prompt: "french crop haircut, short fringe, very short back and sides", reference: "/gallery13.jpg" },
  "style-8": { prompt: "buzz cut, very short even length all around, clean", reference: "/gallery15.jpg" },
};

export const HAIR_STYLES: HairStyleOption[] = (hairStyles as Array<Record<string, unknown>>).map((s) => {
  const id = s.id as string;
  return {
    id,
    name: s.name as string,
    prompt: EXTRA[id]?.prompt ?? (s.name as string),
    reference: EXTRA[id]?.reference ?? "/gallery1.jpg",
    description: s.description as string,
    difficulty: s.difficulty as string,
    maintenance: s.maintenance as string,
    tags: s.tags as string[],
    recommendedServiceId: (s.recommended_services as string[])[0],
  };
});

export const getStyle = (id: string): HairStyleOption | undefined =>
  HAIR_STYLES.find((s) => s.id === id);

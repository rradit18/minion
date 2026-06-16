/**
 * LightX AI — klien image-to-image (hairstyle generator).
 *
 * Dipakai SERVER-SIDE saja (di Route Handler) supaya `LIGHTX_API_KEY` tidak
 * pernah bocor ke browser. Jangan import file ini dari komponen client.
 *
 * Alur resmi LightX (3 langkah):
 *   1. uploadImageUrl  -> dapat presigned URL, lalu PUT biner gambar ke sana.
 *   2. hairstyle       -> kirim imageUrl + textPrompt, dapat orderId.
 *   3. order-status    -> polling sampai status "active", ambil URL output.
 *
 * Docs: https://www.lightxeditor.com/api/  (endpoint v1/v2)
 *
 * Catatan: saat ini Route Handler masih mengembalikan DUMMY. Fungsi di sini
 * sudah lengkap; tinggal set env `LIGHTX_API_KEY` lalu panggil
 * `generateHairstyle()` dari route. Lihat app/api/hair-analysis/route.ts.
 */

const BASE = "https://api.lightxeditor.com/external/api";

interface LightxOrderResponse {
  statusCode: number;
  message: string;
  body: { orderId: string; status: string; output?: string };
}

function apiKey(): string {
  const key = process.env.LIGHTX_API_KEY;
  if (!key) throw new Error("LIGHTX_API_KEY belum di-set di environment");
  return key;
}

/** Langkah 1: minta presigned URL lalu unggah biner gambar. Balikan imageUrl publik. */
async function uploadImage(image: Buffer, contentType: string): Promise<string> {
  const initRes = await fetch(`${BASE}/v2/uploadImageUrl`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey() },
    body: JSON.stringify({ uploadType: "imageUrl", size: image.byteLength, contentType }),
  });
  if (!initRes.ok) throw new Error(`LightX uploadImageUrl gagal: ${initRes.status}`);
  const init = (await initRes.json()) as { body: { uploadImage: string; imageUrl: string } };

  const putRes = await fetch(init.body.uploadImage, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: new Uint8Array(image),
  });
  if (!putRes.ok) throw new Error(`Unggah biner ke LightX gagal: ${putRes.status}`);

  return init.body.imageUrl;
}

/** Langkah 2: buat order hairstyle dari imageUrl + prompt. Balikan orderId. */
async function createHairstyleOrder(imageUrl: string, textPrompt: string): Promise<string> {
  const res = await fetch(`${BASE}/v1/hairstyle`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey() },
    body: JSON.stringify({ imageUrl, textPrompt }),
  });
  if (!res.ok) throw new Error(`LightX hairstyle gagal: ${res.status}`);
  const data = (await res.json()) as LightxOrderResponse;
  return data.body.orderId;
}

/** Langkah 3: polling status order sampai selesai (maks 5x, jeda 3 dtk). */
async function pollOrder(orderId: string): Promise<string> {
  for (let i = 0; i < 5; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const res = await fetch(`${BASE}/v1/order-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey() },
      body: JSON.stringify({ orderId }),
    });
    if (!res.ok) continue;
    const data = (await res.json()) as LightxOrderResponse;
    if (data.body.status === "active" && data.body.output) return data.body.output;
    if (data.body.status === "failed") throw new Error("LightX gagal memproses gambar");
  }
  throw new Error("LightX timeout — order belum selesai");
}

/** Pipeline lengkap: gambar wajah + prompt gaya -> URL gambar hasil. */
export async function generateHairstyle(
  image: Buffer,
  textPrompt: string,
  contentType = "image/jpeg",
): Promise<string> {
  const imageUrl = await uploadImage(image, contentType);
  const orderId = await createHairstyleOrder(imageUrl, textPrompt);
  return pollOrder(orderId);
}

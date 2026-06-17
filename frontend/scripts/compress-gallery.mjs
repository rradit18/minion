import sharp from 'sharp';
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

const PUBLIC_DIR = './public';
const MAX_WIDTH = 800;
const JPEG_QUALITY = 75;
const PNG_QUALITY = 75;

const files = readdirSync(PUBLIC_DIR).filter(f => {
  const lower = f.toLowerCase();
  return lower.startsWith('gallery') && (
    lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png')
  );
});

console.log(`Ditemukan ${files.length} file gallery, mulai compress...\n`);

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const filePath = join(PUBLIC_DIR, file);
  const ext = extname(file).toLowerCase();
  const sizeBefore = statSync(filePath).size;
  totalBefore += sizeBefore;

  try {
    // Baca sebagai buffer untuk menghindari masalah nama file dengan spasi
    const inputBuffer = readFileSync(filePath);
    const image = sharp(inputBuffer).resize({ width: MAX_WIDTH, withoutEnlargement: true });

    let buffer;
    if (ext === '.png') {
      buffer = await image.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toBuffer();
    } else {
      buffer = await image.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    }

    if (buffer.length < sizeBefore) {
      writeFileSync(filePath, buffer);
      const saved = ((sizeBefore - buffer.length) / sizeBefore * 100).toFixed(1);
      totalAfter += buffer.length;
      console.log(`✓ ${file.padEnd(30)} ${(sizeBefore/1024).toFixed(0)}KB → ${(buffer.length/1024).toFixed(0)}KB  (-${saved}%)`);
    } else {
      totalAfter += sizeBefore;
      console.log(`- ${file.padEnd(30)} sudah optimal, dilewati`);
    }
  } catch (err) {
    totalAfter += sizeBefore;
    console.log(`✗ ${file} — error: ${err.message}`);
  }
}

const totalSaved = ((totalBefore - totalAfter) / totalBefore * 100).toFixed(1);
console.log(`\n========================================`);
console.log(`Total sebelum : ${(totalBefore/1024/1024).toFixed(2)} MB`);
console.log(`Total sesudah : ${(totalAfter/1024/1024).toFixed(2)} MB`);
console.log(`Total hemat   : ${((totalBefore-totalAfter)/1024/1024).toFixed(2)} MB (-${totalSaved}%)`);

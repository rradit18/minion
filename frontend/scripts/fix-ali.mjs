import sharp from 'sharp';
import { renameSync } from 'fs';

// Foto ali: 1659x1871, target sama dengan aldi/wanda: 840x1188 (portrait)
await sharp('./public/ali.png')
  .resize({ width: 840, height: 1188, fit: 'cover', position: 'top' })
  .png({ quality: 80 })
  .toFile('./public/ali_new.png');

// Backup dan ganti
renameSync('./public/ali.png', './public/ali_backup.png');
renameSync('./public/ali_new.png', './public/ali.png');

console.log('Selesai! ali.png sudah di-crop ke 840x1188');

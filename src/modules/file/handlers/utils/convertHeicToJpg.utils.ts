import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import convert = require('heic-convert');

export async function convertHeicFileToJpg(filePath: string): Promise<string | null> {
  const ext = filePath.toLowerCase().split('.').pop();
  if (ext !== 'heic' 
    && ext !== 'heif'
    && ext !== 'HEIC'
    && ext !== 'HEIF'
  ) return null;

  const inputBuffer = readFileSync(filePath);
  const outputBuffer = await convert({ buffer: inputBuffer, format: 'JPEG', quality: 0.92 });

  let jpgPath = filePath.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg');

  if (existsSync(jpgPath)) {
    const basePath = jpgPath.replace(/\.jpg$/, '');
    let suffix = 1;
    while (existsSync(`${basePath}_${suffix}.jpg`)) {
      suffix++;
    }
    jpgPath = `${basePath}_${suffix}.jpg`;
  }

  writeFileSync(jpgPath, Buffer.from(outputBuffer));
  unlinkSync(filePath);

  return jpgPath;
}

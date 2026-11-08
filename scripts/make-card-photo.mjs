import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const defaultInput = 'C:/Users/dgb42/.gemini/antigravity/brain/e05b0462-b20f-4b7c-bd1f-cd6e9beacf30/.user_uploaded/media_1794144592176_8001e8fa.jpg';
const inputPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : defaultInput;

const outWebp = path.join(rootDir, 'public', 'images', 'scenes', 'id-card-photo.webp');
const outJpg = path.join(rootDir, 'public', 'images', 'scenes', 'id-card-photo.jpg');

async function processPhoto() {
  console.log(`Processing ID Card Photo from: ${inputPath}`);
  const meta = await sharp(inputPath).metadata();
  console.log(`Input Dimensions: ${meta.width}x${meta.height}`);

  let extractBox;
  if (meta.width === 1024 && meta.height === 1024) {
    // Person is in center in front of gate
    // Face height ~ 110px. 2.6x face height ~ 340px
    // 3:4 aspect ratio => 255 x 340
    // Face center: X: 512, Y: 480
    // Face center at 38% from top => top = 480 - 0.38 * 340 = 351
    // Left = 512 - 255/2 = 384
    extractBox = { left: 384, top: 351, width: 255, height: 340 };
  } else {
    // Proportional 3:4 crop based on attention
    const cropH = Math.round(meta.height * 0.45);
    const cropW = Math.round(cropH * 0.75);
    const top = Math.round((meta.height - cropH) * 0.35);
    const left = Math.round((meta.width - cropW) * 0.5);
    extractBox = { left, top, width: cropW, height: cropH };
  }

  console.log('Extract box:', extractBox);

  // 1. Save WebP (900x1200)
  await sharp(inputPath)
    .extract(extractBox)
    .resize(900, 1200, {
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ quality: 90 })
    .toFile(outWebp);
  console.log(`✓ Saved WebP to: ${outWebp}`);

  // 2. Save JPG (900x1200)
  await sharp(inputPath)
    .extract(extractBox)
    .resize(900, 1200, {
      kernel: sharp.kernel.lanczos3,
    })
    .jpeg({ quality: 90 })
    .toFile(outJpg);
  console.log(`✓ Saved JPG to: ${outJpg}`);
}

processPhoto().catch(err => {
  console.error('Error processing photo:', err);
  process.exit(1);
});


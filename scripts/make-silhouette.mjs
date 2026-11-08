import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputPath = path.join(rootDir, 'public', 'images', 'scenes', 'silhouette.webp');

async function createCrispSilhouette() {
  const width = 480;
  const height = 960;

  // Detailed vector back-view silhouette: hair, neck, broad shoulders, relaxed jacket, arms, legs
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 240 480" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Orange rim lights -->
      <filter id="orange-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <!-- Dual rim gradients -->
      <linearGradient id="rim-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ff7722" stop-opacity="1" />
        <stop offset="6%" stop-color="#ff5a1f" stop-opacity="0.8" />
        <stop offset="14%" stop-color="#0d0d0d" stop-opacity="1" />
        <stop offset="86%" stop-color="#0d0d0d" stop-opacity="1" />
        <stop offset="94%" stop-color="#ff5a1f" stop-opacity="0.8" />
        <stop offset="100%" stop-color="#ff7722" stop-opacity="1" />
      </linearGradient>
      <linearGradient id="top-head-glow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffaa66" stop-opacity="0.9" />
        <stop offset="15%" stop-color="#ff5a1f" stop-opacity="0.5" />
        <stop offset="40%" stop-color="#0c0c0c" stop-opacity="1" />
        <stop offset="100%" stop-color="#080808" stop-opacity="1" />
      </linearGradient>
    </defs>

    <!-- Outer orange contour glow -->
    <g filter="url(#orange-glow)" opacity="0.6">
      <!-- Hair & Head -->
      <path d="M 104 38 Q 120 18 136 38 Q 148 55 142 75 Q 138 88 120 90 Q 102 88 98 75 Q 92 55 104 38 Z" fill="#ff5a1f" />
      <!-- Torso & Arms -->
      <path d="M 98 88 L 74 115 L 60 210 L 78 220 L 88 160 L 92 280 L 148 280 L 152 160 L 162 220 L 180 210 L 166 115 L 142 88 Z" fill="#ff5a1f" />
      <!-- Legs & Trousers -->
      <path d="M 92 280 L 88 430 L 112 430 L 116 320 L 124 320 L 128 430 L 152 430 L 148 280 Z" fill="#ff5a1f" />
    </g>

    <!-- Solid Core Silhouette with Rim Gradient -->
    <!-- Head & Hair with subtle texture -->
    <path d="M 105 40 Q 120 20 135 40 Q 146 56 141 74 Q 136 86 120 88 Q 104 86 99 74 Q 94 56 105 40 Z" fill="url(#top-head-glow)" stroke="#ff7722" stroke-width="1.6" />
    
    <!-- Neck -->
    <path d="M 112 85 L 128 85 L 132 102 L 108 102 Z" fill="#0d0d0d" />

    <!-- Shoulders, Back, Jacket & Arms -->
    <path d="M 108 102 Q 88 106 72 120 Q 64 128 58 170 Q 56 200 62 216 Q 66 222 74 220 Q 80 216 84 195 L 88 152 L 92 145 L 90 278 Q 120 286 150 278 L 148 145 L 152 152 L 156 195 Q 160 216 166 220 Q 174 222 178 216 Q 184 200 182 170 Q 176 128 168 120 Q 152 106 132 102 Z" fill="url(#rim-grad)" stroke="#ff5a1f" stroke-width="1.2" />

    <!-- Pants & Legs -->
    <path d="M 90 278 L 86 360 L 84 445 L 110 445 L 116 330 Q 120 326 124 330 L 130 445 L 156 445 L 154 360 L 150 278 Z" fill="url(#rim-grad)" stroke="#ff5a1f" stroke-width="1.2" />
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .webp({ quality: 95 })
    .toFile(outputPath);

  console.log('✓ High-definition crisp silhouette created at:', outputPath);
}

createCrispSilhouette().catch(console.error);

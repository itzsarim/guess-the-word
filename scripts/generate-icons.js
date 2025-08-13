import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const iconSizes = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' }
];

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'icon.svg');

async function generateIcons() {
  try {
    // Check if SVG exists
    if (!fs.existsSync(svgPath)) {
      console.log('SVG icon not found. Creating a simple fallback icon...');
      await createFallbackIcon();
    }

    console.log('Generating PWA icons...');
    
    for (const icon of iconSizes) {
      const outputPath = path.join(publicDir, icon.name);
      
      await sharp(svgPath)
        .resize(icon.size, icon.size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${icon.name}`);
    }
    
    console.log('🎉 All PWA icons generated successfully!');
    
  } catch (error) {
    console.error('Error generating icons:', error);
    
    // Fallback: create simple colored squares as icons
    console.log('Creating fallback icons...');
    await createFallbackIcons();
  }
}

async function createFallbackIcon() {
  // Create a simple SVG icon if none exists
  const simpleSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="240" fill="url(#grad1)"/>
      <text x="256" y="280" font-family="Arial, sans-serif" font-size="80" font-weight="bold" text-anchor="middle" fill="white">🎭</text>
    </svg>
  `;
  
  fs.writeFileSync(svgPath, simpleSvg);
  console.log('Created fallback SVG icon');
}

async function createFallbackIcons() {
  // Create simple colored square icons as fallback
  for (const icon of iconSizes) {
    const outputPath = path.join(publicDir, icon.name);
    
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${icon.size} ${icon.size}" width="${icon.size}" height="${icon.size}">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${icon.size}" height="${icon.size}" fill="url(#grad1)"/>
        <text x="${icon.size/2}" y="${icon.size/2 + 20}" font-family="Arial, sans-serif" font-size="${icon.size/8}" font-weight="bold" text-anchor="middle" fill="white">🎭</text>
      </svg>
    `;
    
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Generated fallback ${icon.name}`);
  }
}

generateIcons();

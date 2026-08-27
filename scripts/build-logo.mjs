/**
 * Rebuilds the header lockup and standalone mark from the master logo artwork.
 *
 *   node scripts/build-logo.mjs <path-to-logo.png>
 *
 * The mark and the wordmark overlap vertically in the master file, so the
 * tagline cannot be cropped away — the lockup is recomposed instead.
 */
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const SOURCE = process.argv[2] ?? '_prototype/logo-master.png';
const OUTPUT_DIR = 'src/assets';
const PUBLIC_DIR = 'public';

// Regions within the trimmed master.
const MARK = { left: 0, top: 0, width: 274, height: 352 };
const WORDMARK = { left: 303, top: 81, width: 1075, height: 161 };

const GAP = 56; // space between mark and wordmark in the compact lockup
const LOCKUP_HEIGHT = 96; // 3x the ~32px compact render height
const FULL_HEIGHT = 192; // 3x the ~64px full-lockup render height
const FAVICON_SIZES = [32, 180];

const trimmed = await sharp(SOURCE).trim({ threshold: 10 }).png().toBuffer();

const mark = await sharp(trimmed).extract(MARK).trim({ threshold: 10 }).png().toBuffer();
const wordmark = await sharp(trimmed).extract(WORDMARK).trim({ threshold: 10 }).png().toBuffer();

const markMeta = await sharp(mark).metadata();
const wordMeta = await sharp(wordmark).metadata();

const canvasWidth = markMeta.width + GAP + wordMeta.width;
const canvasHeight = markMeta.height;

const lockup = await sharp({
  create: {
    width: canvasWidth,
    height: canvasHeight,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    { input: mark, left: 0, top: 0 },
    // Optically centre the wordmark against the mark.
    {
      input: wordmark,
      left: markMeta.width + GAP,
      top: Math.round((canvasHeight - wordMeta.height) / 2),
    },
  ])
  .png()
  .toBuffer();

await mkdir(OUTPUT_DIR, { recursive: true });

// Full lockup: mark, wordmark and tagline exactly as drawn in the master.
const fullOut = sharp(trimmed).resize({ height: FULL_HEIGHT });
await fullOut.clone().png({ compressionLevel: 9 }).toFile(join(OUTPUT_DIR, 'logo-full.png'));
await fullOut.clone().webp({ quality: 92 }).toFile(join(OUTPUT_DIR, 'logo-full.webp'));

const lockupOut = sharp(lockup).resize({ height: LOCKUP_HEIGHT });
await lockupOut.clone().png({ compressionLevel: 9 }).toFile(join(OUTPUT_DIR, 'logo-lockup.png'));
await lockupOut.clone().webp({ quality: 92 }).toFile(join(OUTPUT_DIR, 'logo-lockup.webp'));

await sharp(mark)
  .resize({ height: LOCKUP_HEIGHT })
  .png({ compressionLevel: 9 })
  .toFile(join(OUTPUT_DIR, 'logo-mark.png'));

// Favicons: the mark is taller than it is wide, so pad it onto a square.
await mkdir(PUBLIC_DIR, { recursive: true });

for (const size of FAVICON_SIZES) {
  await sharp(mark)
    .resize({
      width: size,
      height: size,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(join(PUBLIC_DIR, `favicon-${size}.png`));
}

await sharp(join(PUBLIC_DIR, 'favicon-180.png')).toFile(join(PUBLIC_DIR, 'apple-touch-icon.png'));

const compact = await sharp(join(OUTPUT_DIR, 'logo-lockup.png')).metadata();
const full = await sharp(join(OUTPUT_DIR, 'logo-full.png')).metadata();
console.log(`full ${full.width}x${full.height}  compact ${compact.width}x${compact.height}`);

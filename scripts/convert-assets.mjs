/**
 * One-off conversion of archived source artwork into web-ready variants.
 * Run manually after adding or replacing an image; output is committed.
 *
 *   node scripts/convert-assets.mjs
 */
import { mkdir, readFile, stat } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = '_prototype';
const OUTPUT_DIR = 'src/assets';
// Sources are already at their native display size; widths cap rather than upscale.
const MAX_WIDTH = 1024;

const SOURCES = ['hero-dreamy-butterfly.png'];

async function convert(fileName) {
  const name = basename(fileName, extname(fileName));
  const input = await readFile(join(SOURCE_DIR, fileName));

  const resized = sharp(input).resize({ width: MAX_WIDTH, withoutEnlargement: true });

  await resized
    .clone()
    .avif({ quality: 55 })
    .toFile(join(OUTPUT_DIR, `${name}.avif`));
  await resized
    .clone()
    .webp({ quality: 78 })
    .toFile(join(OUTPUT_DIR, `${name}.webp`));
  await resized
    .clone()
    .flatten({ background: '#efe9f6' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(OUTPUT_DIR, `${name}.jpg`));

  const { size } = await stat(join(SOURCE_DIR, fileName));
  const { width, height } = await sharp(input).metadata();
  console.log(`${fileName}  ${width}x${height}  ${(size / 1024).toFixed(0)} KB -> ${OUTPUT_DIR}`);
}

await mkdir(OUTPUT_DIR, { recursive: true });
await Promise.all(SOURCES.map(convert));

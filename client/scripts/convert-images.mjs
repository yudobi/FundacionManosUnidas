// Convierte los .tif de public/Imagenes/ en .jpg listos para navegador.
// Salida: public/Imagenes/converted/imagen-NN.jpg (numerados, nombre limpio)

import { readdir, mkdir } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "..");
const SRC = join(ROOT, "public", "Imagenes");
const OUT = join(SRC, "converted");

const MAX_WIDTH = 1600;
const QUALITY = 82;

async function main() {
  await mkdir(OUT, { recursive: true });

  const entries = (await readdir(SRC))
    .filter((f) => /\.tif{1,2}$/i.test(f))
    .sort();

  if (entries.length === 0) {
    console.log("No .tif files found in", SRC);
    return;
  }

  console.log(`Converting ${entries.length} files →`, OUT);

  let i = 1;
  for (const file of entries) {
    const out = join(OUT, `imagen-${String(i).padStart(2, "0")}.jpg`);
    try {
      await sharp(join(SRC, file))
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(out);
      console.log(`  ✓ ${file} → imagen-${String(i).padStart(2, "0")}.jpg`);
    } catch (err) {
      console.error(`  ✗ ${file}:`, err.message);
    }
    i++;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import opentype from "opentype.js";
import potrace from "potrace";

const ROOT = process.cwd();
const SOURCE_IMAGE = path.join(ROOT, "assets/images/type-juice-glyph-grid.jpeg");
const OUTPUT_FONT = path.join(ROOT, "assets/fonts/type-juice-custom.otf");
const COLS = 4;
const ROWS = 6;
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!.,:-+*/";

function traceToSvg(filePath) {
  return new Promise((resolve, reject) => {
    potrace.trace(
      filePath,
      {
        threshold: 180,
        turdSize: 4,
        blackOnWhite: true,
      },
      (error, svg) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(svg);
      }
    );
  });
}

function extractPathData(svgText) {
  const matches = [...svgText.matchAll(/<path[^>]*\sd="([^"]+)"/g)];
  if (!matches.length) {
    return "";
  }
  return matches.map((match) => match[1]).join(" ");
}

function transformPath(pathObj, { cellSize, targetSize, xOffset, yOffset }) {
  const scale = targetSize / cellSize;
  pathObj.commands.forEach((command) => {
    ["x", "x1", "x2"].forEach((key) => {
      if (typeof command[key] === "number") {
        command[key] = command[key] * scale + xOffset;
      }
    });

    ["y", "y1", "y2"].forEach((key) => {
      if (typeof command[key] === "number") {
        const flipped = cellSize - command[key];
        command[key] = flipped * scale + yOffset;
      }
    });
  });
}

async function ensureSourceExists() {
  try {
    await fs.access(SOURCE_IMAGE);
  } catch {
    throw new Error(`Missing source image: ${SOURCE_IMAGE}`);
  }
}

async function buildFont() {
  await ensureSourceExists();
  await fs.mkdir(path.dirname(OUTPUT_FONT), { recursive: true });

  const image = sharp(SOURCE_IMAGE);
  const metadata = await image.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  if (!width || !height) {
    throw new Error("Could not read source image dimensions.");
  }

  const cellWidth = Math.floor(width / COLS);
  const cellHeight = Math.floor(height / ROWS);
  const inset = Math.max(2, Math.round(Math.min(cellWidth, cellHeight) * 0.06));
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "type-juice-font-"));

  const glyphs = [new opentype.Glyph({ name: ".notdef", unicode: 0, advanceWidth: 900, path: new opentype.Path() })];

  try {
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const index = row * COLS + col;
        const unicode = CHARSET.codePointAt(index);
        if (!unicode) {
          continue;
        }

        const tilePath = path.join(tmpDir, `glyph-${index}.png`);
        await image
          .extract({
            left: col * cellWidth + inset,
            top: row * cellHeight + inset,
            width: Math.max(1, cellWidth - inset * 2),
            height: Math.max(1, cellHeight - inset * 2),
          })
          .threshold(180)
          .toFile(tilePath);

        const svg = await traceToSvg(tilePath);
        const pathData = extractPathData(svg);
        const glyphPath = pathData ? opentype.Path.fromSVG(pathData) : new opentype.Path();

        transformPath(glyphPath, {
          cellSize: Math.max(cellWidth - inset * 2, cellHeight - inset * 2),
          targetSize: 700,
          xOffset: 90,
          yOffset: 40,
        });

        const char = String.fromCodePoint(unicode);
        glyphs.push(
          new opentype.Glyph({
            name: `glyph_${char}`,
            unicode,
            advanceWidth: 900,
            path: glyphPath,
          })
        );
      }
    }

    const font = new opentype.Font({
      familyName: "TypeJuiceCustom",
      styleName: "Regular",
      unitsPerEm: 1000,
      ascender: 820,
      descender: -180,
      glyphs,
    });

    const arrayBuffer = font.toArrayBuffer();
    await fs.writeFile(OUTPUT_FONT, Buffer.from(arrayBuffer));
    console.log(`Generated font: ${OUTPUT_FONT}`);
    console.log(`Glyph count: ${glyphs.length}`);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

buildFont().catch((error) => {
  console.error(error);
  process.exit(1);
});

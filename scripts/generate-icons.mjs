import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const outputDir = new URL("../public/icons/", import.meta.url);

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;

    for (let index = 0; index < 8; index += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

function mix(start, end, amount) {
  return Math.round(start + (end - start) * amount);
}

function insideRoundedRect(x, y, size, radius) {
  const left = radius;
  const right = size - radius;
  const top = radius;
  const bottom = size - radius;

  if ((x >= left && x < right) || (y >= top && y < bottom)) {
    return true;
  }

  const cornerX = x < left ? left : right - 1;
  const cornerY = y < top ? top : bottom - 1;
  return Math.hypot(x - cornerX, y - cornerY) <= radius;
}

function setPixel(raw, width, x, y, red, green, blue, alpha = 255) {
  const rowStart = y * (width * 4 + 1) + 1;
  const offset = rowStart + x * 4;
  raw[offset] = red;
  raw[offset + 1] = green;
  raw[offset + 2] = blue;
  raw[offset + 3] = alpha;
}

function drawIcon(size) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  const radius = Math.round(size * 0.22);
  const wine = [124, 63, 77];
  const wineDark = [98, 49, 63];

  for (let y = 0; y < size; y += 1) {
    raw[y * (size * 4 + 1)] = 0;

    for (let x = 0; x < size; x += 1) {
      if (!insideRoundedRect(x, y, size, radius)) {
        setPixel(raw, size, x, y, 0, 0, 0, 0);
        continue;
      }

      const amount = (x + y) / (size * 2);
      const red = mix(251, 234, amount);
      const green = mix(247, 220, amount);
      const blue = mix(244, 224, amount);
      setPixel(raw, size, x, y, red, green, blue);
    }
  }

  const bowlX = size * 0.35;
  const bowlY = size * 0.24;
  const bowlW = size * 0.3;
  const bowlH = size * 0.31;
  const stemX = size * 0.48;
  const stemY = size * 0.53;
  const stemW = size * 0.045;
  const stemH = size * 0.18;
  const baseX = size * 0.36;
  const baseY = size * 0.72;
  const baseW = size * 0.28;
  const baseH = size * 0.055;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = (x - (bowlX + bowlW / 2)) / (bowlW / 2);
      const ny = (y - (bowlY + bowlH / 2)) / (bowlH / 2);
      const inBowl = nx * nx + ny * ny < 1 && y > bowlY;
      const inStem = x >= stemX && x <= stemX + stemW && y >= stemY && y <= stemY + stemH;
      const inBase = x >= baseX && x <= baseX + baseW && y >= baseY && y <= baseY + baseH;

      if (inBowl || inStem || inBase) {
        const amount = y / size;
        setPixel(
          raw,
          size,
          x,
          y,
          mix(wine[0], wineDark[0], amount),
          mix(wine[1], wineDark[1], amount),
          mix(wine[2], wineDark[2], amount)
        );
      }
    }
  }

  const shineRadius = Math.round(size * 0.105);
  const shineX = Math.round(size * 0.42);
  const shineY = Math.round(size * 0.32);

  for (let y = shineY - shineRadius; y < shineY + shineRadius; y += 1) {
    for (let x = shineX - shineRadius; x < shineX + shineRadius; x += 1) {
      if (x < 0 || y < 0 || x >= size || y >= size) {
        continue;
      }

      if (Math.hypot(x - shineX, y - shineY) <= shineRadius) {
        setPixel(raw, size, x, y, 255, 255, 255, 172);
      }
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

mkdirSync(outputDir, { recursive: true });

for (const size of [180, 192, 512]) {
  const fileName = size === 180 ? "apple-touch-icon.png" : `icon-${size}.png`;
  writeFileSync(new URL(fileName, outputDir), drawIcon(size));
}

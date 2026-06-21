const fs = require('fs');
const path = require('path');

const pngPath = path.join(__dirname, '../public/logo.png');
const icoPath = path.join(__dirname, '../app/favicon.ico');

try {
  const pngBuffer = fs.readFileSync(pngPath);

  // ICO Header (6 bytes)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type (1 = ICO)
  header.writeUInt16LE(1, 4); // Number of images

  // Directory Entry (16 bytes)
  const entry = Buffer.alloc(16);
  entry.writeUInt8(0, 0); // Width (0 = 256 or auto)
  entry.writeUInt8(0, 1); // Height (0 = 256 or auto)
  entry.writeUInt8(0, 2); // Color palette (0 = no palette)
  entry.writeUInt8(0, 3); // Reserved (0)
  entry.writeUInt16LE(1, 4); // Color planes (1)
  entry.writeUInt16LE(32, 6); // Bits per pixel (32)
  entry.writeUInt32LE(pngBuffer.length, 8); // Image size
  entry.writeUInt32LE(22, 12); // Image offset (header + entry = 22)

  const icoBuffer = Buffer.concat([header, entry, pngBuffer]);
  fs.writeFileSync(icoPath, icoBuffer);
  console.log('Successfully generated app/favicon.ico from logo.png!');
} catch (error) {
  console.error('Error generating favicon.ico:', error);
  process.exit(1);
}

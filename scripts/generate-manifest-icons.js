const sharp = require('sharp');
const path = require('path');

const logoPath = path.join(__dirname, '../public/logo.png');
const icon192Path = path.join(__dirname, '../public/icon-192.png');
const icon512Path = path.join(__dirname, '../public/icon-512.png');

async function generateManifestIcons() {
  try {
    // Generate 192x192 icon
    await sharp(logoPath)
      .resize(192, 192)
      .toFile(icon192Path);
    console.log('Successfully generated public/icon-192.png!');

    // Generate 512x512 icon
    await sharp(logoPath)
      .resize(512, 512)
      .toFile(icon512Path);
    console.log('Successfully generated public/icon-512.png!');
  } catch (error) {
    console.error('Error generating manifest icons:', error);
    process.exit(1);
  }
}

generateManifestIcons();

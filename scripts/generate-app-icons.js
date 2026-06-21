const sharp = require('sharp');
const path = require('path');

const logoPath = path.join(__dirname, '../public/logo.png');
const appIconPath = path.join(__dirname, '../app/icon.png');
const appleIconPath = path.join(__dirname, '../app/apple-icon.png');

async function generateAppIcons() {
  try {
    // 1. Generate app/icon.png (512x512 PNG)
    await sharp(logoPath)
      .resize(512, 512)
      .toFile(appIconPath);
    console.log('Successfully generated app/icon.png!');

    // 2. Generate app/apple-icon.png (180x180 PNG with solid #FAF8F4 background)
    const background = sharp({
      create: {
        width: 180,
        height: 180,
        channels: 4,
        background: { r: 250, g: 248, b: 244, alpha: 1 } // #FAF8F4
      }
    });

    const logoResized = await sharp(logoPath)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 250, g: 248, b: 244, alpha: 0 }
      })
      .toBuffer();

    await background
      .composite([{
        input: logoResized,
        gravity: 'center'
      }])
      .png()
      .toFile(appleIconPath);

    console.log('Successfully generated app/apple-icon.png!');
  } catch (error) {
    console.error('Error generating app icons:', error);
    process.exit(1);
  }
}

generateAppIcons();

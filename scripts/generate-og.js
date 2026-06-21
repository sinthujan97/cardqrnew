const sharp = require('sharp');
const path = require('path');

const logoPath = path.join(__dirname, '../public/logo.png');
const ogPath = path.join(__dirname, '../public/og-image.png');

async function generateOGImage() {
  try {
    // 1. Create a 1200x630 background image with the warm paper background color (#FAF8F4)
    const background = sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 250, g: 248, b: 244, alpha: 1 } // #FAF8F4
      }
    });

    // 2. Resize logo.png to fit nicely (e.g., 400x400)
    const logoResized = await sharp(logoPath)
      .resize(400, 400, {
        fit: 'contain',
        background: { r: 250, g: 248, b: 244, alpha: 0 }
      })
      .toBuffer();

    // 3. Composite logo onto the center of the background
    await background
      .composite([{
        input: logoResized,
        gravity: 'center'
      }])
      .png()
      .toFile(ogPath);

    console.log('Successfully generated public/og-image.png!');
  } catch (error) {
    console.error('Error generating OG image:', error);
    process.exit(1);
  }
}

generateOGImage();

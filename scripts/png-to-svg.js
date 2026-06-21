const fs = require('fs');
const path = require('path');

const pngPath = path.join(__dirname, '../public/logo.png');
const svgPath = path.join(__dirname, '../public/logo.svg');

try {
  const pngBuffer = fs.readFileSync(pngPath);
  const base64 = pngBuffer.toString('base64');
  
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,${base64}" width="512" height="512" />
</svg>`;

  fs.writeFileSync(svgPath, svgContent);
  console.log('Successfully generated public/logo.svg from logo.png!');
} catch (error) {
  console.error('Error generating logo.svg:', error);
  process.exit(1);
}

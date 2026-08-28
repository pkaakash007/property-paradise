import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const logoPath = path.join(projectRoot, 'public', 'logo.png');
const faviconSvgPath = path.join(projectRoot, 'public', 'favicon.svg');

const logoBuf = fs.readFileSync(logoPath);
const base64 = logoBuf.toString('base64');

// Square 512x512 canvas for favicon, centered logo
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${base64}" x="0" y="85" width="512" height="341" />
</svg>`;

fs.writeFileSync(faviconSvgPath, svg);
console.log('Successfully generated favicon.svg from logo.png');

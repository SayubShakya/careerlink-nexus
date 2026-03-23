import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convert() {
    const svgFile = path.join(__dirname, 'public', 'favicon.svg');
    const svgElement = fs.readFileSync(svgFile, 'utf8');

    // 16x16 PNG
    const p16 = path.join(__dirname, 'public', 'favicon-16x16.png');
    await sharp(svgFile).resize(16, 16).png().toFile(p16);

    // 32x32 PNG
    const p32 = path.join(__dirname, 'public', 'favicon-32x32.png');
    await sharp(svgFile).resize(32, 32).png().toFile(p32);

    // 180x180 PNG (Apple touch icon)
    const p180 = path.join(__dirname, 'public', 'apple-touch-icon.png');
    await sharp(svgFile).resize(180, 180).png().toFile(p180);

    // PNG for the generic link rel="icon" type="image/png"
    const pFaviconPng = path.join(__dirname, 'public', 'favicon.png');
    await sharp(svgFile).resize(512, 512).png().toFile(pFaviconPng);

    // Generate .ico from the 16x16 and 32x32
    const pIco = path.join(__dirname, 'public', 'favicon.ico');
    const icoBuffer = await pngToIco([p16, p32]);
    fs.writeFileSync(pIco, icoBuffer);

    console.log("Conversion complete.");
}

convert().catch(console.error);

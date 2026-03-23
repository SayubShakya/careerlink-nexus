const sharp = require('sharp');
const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

async function convert() {
    const svgFile = path.join(__dirname, 'public', 'favicon.svg');
    const svgElement = fs.readFileSync(svgFile, 'utf8');

    // Remove the white background from the SVG so it can be transparent if needed
    // The original SVG has: <rect width="32" height="32" rx="6" fill="#ffffff"/>
    // Wait, the original logo has a white background. It's a dark mode app mostly, but favicons are often their own solid squares. I'll leave it as is or maybe retain it? The prompt says "minimalist, dark background". But the SVG is already created by design. Let's just convert it as-is.

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
    // pngToIco takes an array of file paths or buffers
    const pIco = path.join(__dirname, 'public', 'favicon.ico');
    const icoBuffer = await pngToIco([p16, p32]);
    fs.writeFileSync(pIco, icoBuffer);

    console.log("Conversion complete.");
}

convert().catch(console.error);

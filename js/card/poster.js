/**
 * Poster pipeline for the card. Everything becomes a data URL so html-to-image never
 * re-fetches cross-origin images (no tainted canvas), and the blur is baked in a canvas
 * because CSS `filter` is unreliable inside SVG foreignObject on Safari/iOS.
 */
import { COLORS } from '../shared/tokens';
import { hexToRgb, rgbToHex, rgbToHsl } from './color';
import { mulberry32 } from './prng';

export const POSTER_BASE = 'https://image.tmdb.org/t/p/w780';

const BLUR_W = 135;
const BLUR_H = 169;
const BLUR_DARKEN = 0.42;

const assetCache = new Map();

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Falha ao carregar imagem'));
        img.src = src;
    });
}

function drawCover(ctx, img, width, height) {
    const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
}

/** Separable box blur on RGBA pixels, edges clamped. */
function boxBlur(data, width, height, radius) {
    const tmp = new Float32Array(data.length);
    const span = radius * 2 + 1;

    for (let y = 0; y < height; y++) {
        for (let c = 0; c < 3; c++) {
            let acc = 0;
            for (let k = -radius; k <= radius; k++) {
                const x = Math.min(width - 1, Math.max(0, k));
                acc += data[(y * width + x) * 4 + c];
            }
            for (let x = 0; x < width; x++) {
                tmp[(y * width + x) * 4 + c] = acc / span;
                const out = Math.max(0, x - radius);
                const inn = Math.min(width - 1, x + radius + 1);
                acc += data[(y * width + inn) * 4 + c] - data[(y * width + out) * 4 + c];
            }
        }
    }

    for (let x = 0; x < width; x++) {
        for (let c = 0; c < 3; c++) {
            let acc = 0;
            for (let k = -radius; k <= radius; k++) {
                const y = Math.min(height - 1, Math.max(0, k));
                acc += tmp[(y * width + x) * 4 + c];
            }
            for (let y = 0; y < height; y++) {
                data[(y * width + x) * 4 + c] = acc / span;
                const out = Math.max(0, y - radius);
                const inn = Math.min(height - 1, y + radius + 1);
                acc += tmp[(inn * width + x) * 4 + c] - tmp[(out * width + x) * 4 + c];
            }
        }
    }
}

/** Blurred + darkened poster sized to the card ratio, plus the brightness probe used for contrast checks. */
function makeBlurredBackground(img) {
    const canvas = document.createElement('canvas');
    canvas.width = BLUR_W;
    canvas.height = BLUR_H;
    const ctx = canvas.getContext('2d');
    drawCover(ctx, img, BLUR_W, BLUR_H);

    const imageData = ctx.getImageData(0, 0, BLUR_W, BLUR_H);
    const data = imageData.data;
    boxBlur(data, BLUR_W, BLUR_H, 7);
    boxBlur(data, BLUR_W, BLUR_H, 7);
    boxBlur(data, BLUR_W, BLUR_H, 7);

    const ink = hexToRgb(COLORS.ink);
    const lums = [];
    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * BLUR_DARKEN + ink.r * (1 - BLUR_DARKEN);
        data[i + 1] = data[i + 1] * BLUR_DARKEN + ink.g * (1 - BLUR_DARKEN);
        data[i + 2] = data[i + 2] * BLUR_DARKEN + ink.b * (1 - BLUR_DARKEN);
        data[i + 3] = 255;
        lums.push({ lum: 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2], i: i });
    }
    ctx.putImageData(imageData, 0, 0);

    // 95th percentile brightness = "lightest realistic background" behind text.
    lums.sort((a, b) => a.lum - b.lum);
    const probeIndex = lums[Math.floor(lums.length * 0.95)].i;
    const probe = rgbToHex({ r: data[probeIndex], g: data[probeIndex + 1], b: data[probeIndex + 2] });

    return { url: canvas.toDataURL('image/jpeg', 0.9), probe: probe };
}

/**
 * Samples the poster and returns { vibrant, dominant } hex colors.
 * vibrant: most saturated well-represented hue (accent candidate); null when the poster is too muted.
 * dominant: most frequent hue family, used to tint gradients.
 */
export function extractPalette(img) {
    const w = 60;
    const h = 90;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    drawCover(ctx, img, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;

    const buckets = 24;
    const vibrant = [];
    const dominant = [];
    for (let i = 0; i < buckets; i++) {
        vibrant.push({ score: 0, count: 0, r: 0, g: 0, b: 0 });
        dominant.push({ count: 0, r: 0, g: 0, b: 0 });
    }

    let total = 0;
    let avg = { r: 0, g: 0, b: 0 };
    for (let i = 0; i < data.length; i += 4) {
        const rgb = { r: data[i], g: data[i + 1], b: data[i + 2] };
        const hsl = rgbToHsl(rgb);
        const bucket = Math.min(buckets - 1, Math.floor(hsl.h * buckets));
        total++;
        avg.r += rgb.r;
        avg.g += rgb.g;
        avg.b += rgb.b;

        if (hsl.s >= 0.12 && hsl.l >= 0.1 && hsl.l <= 0.85) {
            const d = dominant[bucket];
            d.count++;
            d.r += rgb.r;
            d.g += rgb.g;
            d.b += rgb.b;
        }

        if (hsl.s >= 0.35 && hsl.l >= 0.25 && hsl.l <= 0.78) {
            const v = vibrant[bucket];
            v.count++;
            v.score += hsl.s * (1 - Math.abs(hsl.l - 0.5) * 1.2);
            v.r += rgb.r;
            v.g += rgb.g;
            v.b += rgb.b;
        }
    }

    const mean = (b) => rgbToHex({ r: b.r / b.count, g: b.g / b.count, b: b.b / b.count });

    const bestVibrant = vibrant.reduce((best, b) => (b.score > best.score ? b : best), vibrant[0]);
    const bestDominant = dominant.reduce((best, b) => (b.count > best.count ? b : best), dominant[0]);

    return {
        vibrant: bestVibrant.count >= total * 0.02 ? mean(bestVibrant) : null,
        dominant: bestDominant.count >= total * 0.04
            ? mean(bestDominant)
            : rgbToHex({ r: avg.r / total, g: avg.g / total, b: avg.b / total }),
    };
}

function assetsFromImage(posterUrl, img) {
    const blur = makeBlurredBackground(img);
    return {
        hasPoster: true,
        posterUrl: posterUrl,
        blurUrl: blur.url,
        blurProbe: blur.probe,
        palette: extractPalette(img),
    };
}

export const NO_POSTER_ASSETS = {
    hasPoster: false,
    posterUrl: null,
    blurUrl: null,
    blurProbe: COLORS.ink,
    palette: { vibrant: null, dominant: COLORS.paper },
};

/** Fetches the poster as a blob (CORS) and derives every image asset the card needs. Cached per path. */
export function loadPosterAssets(posterPath) {
    if (!posterPath) {
        return Promise.resolve(NO_POSTER_ASSETS);
    }

    if (!assetCache.has(posterPath)) {
        const promise = fetch(POSTER_BASE + posterPath, { mode: 'cors' })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Poster HTTP ' + res.status);
                }
                return res.blob();
            })
            .then(blobToDataUrl)
            .then((dataUrl) => loadImage(dataUrl).then((img) => assetsFromImage(dataUrl, img)))
            .catch((err) => {
                console.warn('[card] poster indisponível, usando fallback tipográfico', err);
                assetCache.delete(posterPath);
                return NO_POSTER_ASSETS;
            });
        assetCache.set(posterPath, promise);
    }

    return assetCache.get(posterPath);
}

/** Synthetic poster for the stress gallery (no network). */
export function loadSyntheticPosterAssets(hueDeg, label, muted) {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');
    const sat = muted ? 6 : 70;
    const gradient = ctx.createLinearGradient(0, 0, 500, 750);
    gradient.addColorStop(0, 'hsl(' + hueDeg + ', ' + sat + '%, 55%)');
    gradient.addColorStop(1, 'hsl(' + ((hueDeg + 40) % 360) + ', ' + sat + '%, 18%)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 500, 750);
    ctx.fillStyle = muted ? 'rgba(240, 240, 240, 0.85)' : 'rgba(255, 255, 255, 0.18)';
    ctx.beginPath();
    ctx.arc(250, 300, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, 250, 640);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    return loadImage(dataUrl).then((img) => assetsFromImage(dataUrl, img));
}

let grainUrl = null;

/** Tileable film grain, generated once with a fixed seed (identical on every render). */
export function getGrainUrl() {
    if (grainUrl) {
        return grainUrl;
    }
    const size = 180;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(size, size);
    const rng = mulberry32(20201010);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const value = Math.floor(rng() * 255);
        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = 34;
    }
    ctx.putImageData(imageData, 0, 0);
    grainUrl = canvas.toDataURL('image/png');
    return grainUrl;
}


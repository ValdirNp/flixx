/**
 * PNG export with html-to-image, tuned for iOS/Safari:
 * - fonts are embedded explicitly (data URLs, latin subsets) instead of letting the lib scan stylesheets;
 * - all images are already data URLs (see poster.js), so nothing is fetched cross-origin at export time;
 * - WebKit decodes foreignObject images lazily, so the first passes are discarded there.
 */
import { toBlob } from 'html-to-image';
import { FONTS } from '../shared/tokens';
import { CARD_WIDTH, CARD_HEIGHT } from './Card';

let fontCssPromise = null;

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

/** Google Fonts CSS with every latin/latin-ext woff2 inlined as a data URL. */
export function getFontEmbedCss() {
    if (!fontCssPromise) {
        fontCssPromise = fetch(FONTS.googleFontsUrl)
            .then((res) => res.text())
            .then((css) => {
                const blocks = css.split('/*').slice(1)
                    .map((chunk) => {
                        const end = chunk.indexOf('*/');
                        return { subset: chunk.slice(0, end).trim(), rule: chunk.slice(end + 2).trim() };
                    })
                    .filter((block) => block.subset === 'latin' || block.subset === 'latin-ext');

                return Promise.all(blocks.map((block) => {
                    const match = block.rule.match(/url\((['"]?)([^'")]+)\1\)/);
                    if (!match) {
                        return block.rule;
                    }
                    return fetch(match[2])
                        .then((res) => res.blob())
                        .then(blobToDataUrl)
                        .then((dataUrl) => block.rule.replace(match[0], 'url(' + dataUrl + ')'));
                }));
            })
            .then((rules) => rules.join('\n'))
            .catch((err) => {
                fontCssPromise = null;
                throw err;
            });
    }
    return fontCssPromise;
}

export function isWebKit() {
    const ua = navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const safari = /AppleWebKit/.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Android/.test(ua);
    return iOS || safari;
}

function waitForImages(node) {
    const images = Array.prototype.slice.call(node.querySelectorAll('img'));
    return Promise.all(images.map((img) => {
        if (img.complete && img.naturalWidth) {
            return img.decode ? img.decode().catch(() => null) : null;
        }
        return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
        });
    }));
}

function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function readSize(blob) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('PNG inválido'));
        };
        img.src = url;
    });
}

/** Renders the (unscaled) card node to an exactly 1080×1350 PNG blob. */
export function exportCardPng(node) {
    return Promise.all([document.fonts.ready, waitForImages(node), getFontEmbedCss()])
        .then((results) => nextFrame().then(() => results[2]))
        .then((fontEmbedCSS) => {
            const options = {
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                canvasWidth: CARD_WIDTH,
                canvasHeight: CARD_HEIGHT,
                pixelRatio: 1,
                cacheBust: false,
                fontEmbedCSS: fontEmbedCSS,
                style: { transform: 'none', margin: '0' },
            };
            const passes = isWebKit() ? 3 : 1;

            let chain = Promise.resolve(null);
            for (let i = 0; i < passes; i++) {
                chain = chain.then(() => toBlob(node, options));
            }
            return chain;
        })
        .then((blob) => {
            if (!blob) {
                throw new Error('A exportação não gerou imagem.');
            }
            return readSize(blob).then((size) => {
                if (size.width !== CARD_WIDTH || size.height !== CARD_HEIGHT) {
                    throw new Error('PNG com tamanho inesperado: ' + size.width + '×' + size.height);
                }
                return blob;
            });
        });
}

export function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 30000);
}

export function canShareFiles() {
    if (!navigator.canShare || !window.File) {
        return false;
    }
    try {
        return navigator.canShare({ files: [new File([''], 'test.png', { type: 'image/png' })] });
    } catch (err) {
        return false;
    }
}

export function shareBlob(blob, fileName, text) {
    const file = new File([blob], fileName, { type: 'image/png' });
    return navigator.share({ files: [file], text: text });
}

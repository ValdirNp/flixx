/**
 * Color math for the card: HSL conversions, WCAG contrast and accent resolution.
 */
import { COLORS } from '../shared/tokens';

export const AA_TEXT = 4.5;
export const AA_LARGE = 3;

export function hexToRgb(hex) {
    const value = hex.replace('#', '');
    return {
        r: parseInt(value.slice(0, 2), 16),
        g: parseInt(value.slice(2, 4), 16),
        b: parseInt(value.slice(4, 6), 16),
    };
}

export function rgbToHex(rgb) {
    const toHex = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
    return '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
}

export function rgba(hex, alpha) {
    const rgb = hexToRgb(hex);
    return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + alpha + ')';
}

export function rgbToHsl(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) {
            h = (g - b) / d + (g < b ? 6 : 0);
        } else if (max === g) {
            h = (b - r) / d + 2;
        } else {
            h = (r - g) / d + 4;
        }
        h /= 6;
    }

    return { h: h, s: s, l: l };
}

export function hslToRgb(hsl) {
    const h = hsl.h;
    const s = hsl.s;
    const l = hsl.l;

    if (s === 0) {
        return { r: l * 255, g: l * 255, b: l * 255 };
    }

    const hue2rgb = (p, q, t) => {
        let tt = t;
        if (tt < 0) tt += 1;
        if (tt > 1) tt -= 1;
        if (tt < 1 / 6) return p + (q - p) * 6 * tt;
        if (tt < 1 / 2) return q;
        if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
        return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return {
        r: hue2rgb(p, q, h + 1 / 3) * 255,
        g: hue2rgb(p, q, h) * 255,
        b: hue2rgb(p, q, h - 1 / 3) * 255,
    };
}

export function hslToHex(hsl) {
    return rgbToHex(hslToRgb(hsl));
}

export function relativeLuminance(hex) {
    const rgb = hexToRgb(hex);
    const channel = (value) => {
        const c = value / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

export function contrastRatio(hexA, hexB) {
    const a = relativeLuminance(hexA);
    const b = relativeLuminance(hexB);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Text color (ink or cream) with the best contrast on a given fill. */
export function onColor(fillHex) {
    return contrastRatio(fillHex, COLORS.ink) >= contrastRatio(fillHex, COLORS.cream)
        ? COLORS.ink
        : COLORS.cream;
}

/** Brand fallback: red for fills (wordmark color), gold for small accent text — as on the site. */
export function brandAccent() {
    return {
        source: 'brand',
        text: COLORS.gold,
        fill: COLORS.red,
        onFill: COLORS.cream,
        hue: hexToRgb(COLORS.red),
    };
}

/**
 * Validates a color sampled from the poster and derives a text-safe variant.
 * Rejects candidates that are too dark, too light or desaturated, then lightens the
 * text variant until it reaches WCAG AA against the lightest background behind text.
 */
export function resolveAccent(candidateHex, backgroundHex) {
    if (!candidateHex) {
        return brandAccent();
    }

    const hsl = rgbToHsl(hexToRgb(candidateHex));
    if (hsl.s < 0.28 || hsl.l < 0.18 || hsl.l > 0.86) {
        return brandAccent();
    }

    const saturation = Math.max(hsl.s, 0.45);
    let fillL = Math.min(Math.max(hsl.l, 0.42), 0.62);
    let fill = hslToHex({ h: hsl.h, s: saturation, l: fillL });
    // Fill text (badges, chips) is large/bold, but aim for AA anyway: darken toward cream text.
    while (contrastRatio(fill, onColor(fill)) < AA_TEXT && fillL > 0.3) {
        fillL -= 0.03;
        fill = hslToHex({ h: hsl.h, s: saturation, l: fillL });
    }

    let textL = Math.max(hsl.l, 0.55);
    let text = hslToHex({ h: hsl.h, s: saturation, l: textL });
    while (contrastRatio(text, backgroundHex) < AA_TEXT && textL < 0.86) {
        textL += 0.03;
        text = hslToHex({ h: hsl.h, s: saturation, l: textL });
    }

    const onFill = onColor(fill);
    if (contrastRatio(text, backgroundHex) < AA_TEXT || contrastRatio(fill, onFill) < AA_TEXT) {
        return brandAccent();
    }

    return {
        source: 'poster',
        text: text,
        fill: fill,
        onFill: onFill,
        hue: hexToRgb(fill),
    };
}

/**
 * Flixx design tokens — single source of truth for the brand identity.
 * Consumed by the MUI theme (main.js) and exposed as CSS variables for the card (/card).
 */
export const COLORS = {
    red: '#E50914',
    redDark: '#C40812',
    gold: '#D4A574',
    ink: '#0E0D0C',
    ink2: '#141210',
    ink3: '#090807',
    paper: '#1A1816',
    cream: '#F5F0E8',
    muted: '#9A9288',
    line: 'rgba(154, 146, 136, 0.35)',
};

export const FONTS = {
    display: '"Bebas Neue", "Impact", sans-serif',
    body: '"Figtree", "Helvetica", "Arial", sans-serif',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Figtree:wght@400;500;600;700&display=swap',
};

export const SHAPE = {
    radius: 6,
    radiusChip: 4,
};

export const TRACKING = {
    display: '0.04em',
    label: '0.14em',
};

/** Maps tokens to CSS custom properties (--flx-*). */
export function tokensToCssVars() {
    return {
        '--flx-red': COLORS.red,
        '--flx-red-dark': COLORS.redDark,
        '--flx-gold': COLORS.gold,
        '--flx-ink': COLORS.ink,
        '--flx-ink-2': COLORS.ink2,
        '--flx-ink-3': COLORS.ink3,
        '--flx-paper': COLORS.paper,
        '--flx-cream': COLORS.cream,
        '--flx-muted': COLORS.muted,
        '--flx-line': COLORS.line,
        '--flx-font-display': FONTS.display,
        '--flx-font-body': FONTS.body,
        '--flx-radius': SHAPE.radius + 'px',
        '--flx-radius-chip': SHAPE.radiusChip + 'px',
        '--flx-tracking-display': TRACKING.display,
        '--flx-tracking-label': TRACKING.label,
    };
}

/** Injects the tokens as CSS variables on :root. */
export function applyCssTokens(doc) {
    const vars = tokensToCssVars();
    const css = ':root{' + Object.keys(vars).map((key) => key + ':' + vars[key]).join(';') + '}';
    const style = doc.createElement('style');
    style.setAttribute('data-flx-tokens', '');
    style.textContent = css;
    doc.head.appendChild(style);
}

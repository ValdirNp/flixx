/**
 * Variation axes. Each axis is independent and drawn from its own PRNG sub-stream.
 * Layouts and backgrounds come from their registries, so adding one is a registry change only.
 */
import { LAYOUTS, getLayout } from './layouts';
import { BACKGROUNDS, getBackground } from './backgrounds';
import { rngFor, pick, pickWeighted } from './prng';

export const ACCENT_MODES = [
    { id: 'poster', name: 'Cor do pôster', weight: 3 },
    { id: 'brand', name: 'Cor da marca', weight: 1 },
];

export const RATING_POSITIONS = ['inline', 'corner-left', 'corner-right'];
export const CHIP_STYLES = ['outline', 'filled', 'label'];
export const LOGO_POSITIONS = ['left', 'right', 'center'];

/** Picks every axis for a seed. `previousLayout` is excluded so consecutive days never share a layout. */
export function chooseVariation(seed, previousLayout) {
    const layoutPool = LAYOUTS.filter((layout) => layout.id !== previousLayout);

    return {
        layout: pick(rngFor(seed, 'layout'), layoutPool).id,
        background: pick(rngFor(seed, 'background'), BACKGROUNDS).id,
        accent: pickWeighted(
            rngFor(seed, 'accent'),
            ACCENT_MODES.map((mode) => ({ value: mode.id, weight: mode.weight }))
        ),
        ratingPos: pick(rngFor(seed, 'rating'), RATING_POSITIONS),
        chipStyle: pick(rngFor(seed, 'chips'), CHIP_STYLES),
        logoPos: pick(rngFor(seed, 'logo'), LOGO_POSITIONS),
    };
}

/** Applies ?layout= / ?theme= / ?accent= overrides (ignored when unknown). */
export function applyOverrides(variation, overrides) {
    const next = Object.assign({}, variation);
    if (overrides.layout && getLayout(overrides.layout)) {
        next.layout = overrides.layout;
    }
    if (overrides.theme && getBackground(overrides.theme)) {
        next.background = overrides.theme;
    }
    if (overrides.accent && ACCENT_MODES.some((mode) => mode.id === overrides.accent)) {
        next.accent = overrides.accent;
    }
    return next;
}

export function describeVariation(variation) {
    const layout = getLayout(variation.layout);
    const background = getBackground(variation.background);
    const accent = ACCENT_MODES.find((mode) => mode.id === variation.accent);
    return [
        layout ? layout.name : variation.layout,
        background ? background.name : variation.background,
        accent ? accent.name : variation.accent,
    ].join(' · ');
}

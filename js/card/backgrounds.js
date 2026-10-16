/**
 * Background treatments. Each entry:
 *   id, name         — registry key (?theme=<id>) and label
 *   needsPoster      — falls back to FALLBACK_BACKGROUND when the movie has no poster
 *   probe(ctx)       — lightest realistic color behind text, for WCAG checks
 *   Component(ctx)   — absolutely positioned layers covering the card
 * ctx = { assets, accentFill }
 * Only gradients, opacity and data-URL images: no CSS filters/blend modes (Safari export).
 */
import { COLORS } from '../shared/tokens';
import { hexToRgb, rgbToHex, rgbToHsl, hslToHex, rgba } from './color';
import { getGrainUrl } from './poster';

export const FALLBACK_BACKGROUND = 'beam';

function mix(hexA, hexB, amount) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    return rgbToHex({
        r: a.r + (b.r - a.r) * amount,
        g: a.g + (b.g - a.g) * amount,
        b: a.b + (b.b - a.b) * amount,
    });
}

function gradientBase(assets) {
    const hsl = rgbToHsl(hexToRgb(assets.palette.dominant || COLORS.paper));
    const s = Math.min(hsl.s, 0.45);
    return {
        light: hslToHex({ h: hsl.h, s: s, l: 0.14 }),
        dark: hslToHex({ h: hsl.h, s: s * 0.8, l: 0.05 }),
    };
}

function Grain(props) {
    return (
        <div
            className="fc-layer"
            style={{
                backgroundImage: 'url(' + getGrainUrl() + ')',
                backgroundSize: '180px 180px',
                opacity: props.opacity,
            }}
        />
    );
}

function BlurBackground(props) {
    return (
        <React.Fragment>
            <img className="fc-layer fc-layer-img" src={props.assets.blurUrl} alt="" />
            <div
                className="fc-layer"
                style={{
                    background: 'radial-gradient(ellipse 120% 90% at 50% 40%, rgba(14, 13, 12, 0) 40%, rgba(14, 13, 12, 0.65) 100%)',
                }}
            />
            <Grain opacity={0.5} />
        </React.Fragment>
    );
}

function GradientBackground(props) {
    const base = gradientBase(props.assets);
    return (
        <React.Fragment>
            <div
                className="fc-layer"
                style={{
                    background: [
                        'radial-gradient(ellipse 85% 55% at 12% -5%, ' + rgba(props.accentFill, 0.3) + ', transparent 60%)',
                        'radial-gradient(ellipse 70% 50% at 100% 105%, ' + rgba(props.accentFill, 0.16) + ', transparent 60%)',
                        'linear-gradient(165deg, ' + base.light + ' 0%, ' + base.dark + ' 70%)',
                    ].join(', '),
                }}
            />
            <Grain opacity={0.6} />
        </React.Fragment>
    );
}

function SolidBackground() {
    return (
        <React.Fragment>
            <div className="fc-layer" style={{ background: COLORS.ink2 }} />
            <div
                className="fc-layer"
                style={{
                    background: 'radial-gradient(ellipse 110% 80% at 50% 50%, transparent 55%, rgba(9, 8, 7, 0.7) 100%)',
                }}
            />
            <Grain opacity={1} />
        </React.Fragment>
    );
}

/** The site's own backdrop: red glows, warm gradient and the projector beam. */
function BeamBackground() {
    return (
        <React.Fragment>
            <div
                className="fc-layer"
                style={{
                    background: [
                        'radial-gradient(ellipse 90% 55% at 12% -10%, rgba(229, 9, 20, 0.22), transparent 55%)',
                        'radial-gradient(ellipse 70% 50% at 88% 8%, rgba(212, 165, 116, 0.12), transparent 50%)',
                        'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(229, 9, 20, 0.08), transparent 55%)',
                        'linear-gradient(180deg, #141210 0%, #0E0D0C 45%, #090807 100%)',
                    ].join(', '),
                }}
            />
            <div className="fc-beam" />
            <Grain opacity={0.7} />
        </React.Fragment>
    );
}

export const BACKGROUNDS = [
    {
        id: 'blur',
        name: 'Pôster desfocado',
        needsPoster: true,
        probe: (ctx) => ctx.assets.blurProbe,
        Component: BlurBackground,
    },
    {
        id: 'gradient',
        name: 'Gradiente do pôster',
        needsPoster: false,
        probe: (ctx) => mix(gradientBase(ctx.assets).light, ctx.accentFill, 0.3),
        Component: GradientBackground,
    },
    {
        id: 'solid',
        name: 'Sólido com grain',
        needsPoster: false,
        probe: () => mix(COLORS.ink2, '#FFFFFF', 0.06),
        Component: SolidBackground,
    },
    {
        id: 'beam',
        name: 'Feixe Flixx',
        needsPoster: false,
        probe: () => mix(mix(COLORS.ink2, COLORS.red, 0.22), COLORS.cream, 0.07),
        Component: BeamBackground,
    },
];

export function getBackground(id) {
    return BACKGROUNDS.find((background) => background.id === id) || null;
}

/** Background actually rendered: poster-based treatments degrade to the brand backdrop. */
export function resolveBackground(id, assets) {
    const background = getBackground(id) || getBackground(FALLBACK_BACKGROUND);
    if (background.needsPoster && !assets.hasPoster) {
        return getBackground(FALLBACK_BACKGROUND);
    }
    return background;
}

export { mix };

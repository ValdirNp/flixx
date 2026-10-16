/**
 * The 1080×1350 card. Composition order (bottom → top):
 * background → dim guard → layout bleed → footer scrim → safe-area content → fixed footer.
 */
import { COLORS } from '../shared/tokens';
import { AA_TEXT, brandAccent, contrastRatio, resolveAccent } from './color';
import { resolveBackground, mix } from './backgrounds';
import { getLayout, LAYOUTS } from './layouts';
import { BrandFooter } from './parts';
import { DisplayContext, DEFAULT_DISPLAY } from './display';

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1350;

/** Minimum contrast of the primary text against the background probe before adding a dim layer. */
const PRIMARY_TEXT_TARGET = 7;

/** Resolves colors so that every text role meets WCAG AA on what is actually behind it. */
export function resolveCardColors(model) {
    const layout = getLayout(model.variation.layout) || LAYOUTS[0];
    const background = resolveBackground(model.variation.background, model.assets);
    const candidate = model.variation.accent === 'poster' ? model.assets.palette.vibrant : null;
    const provisionalFill = candidate || COLORS.red;

    let probe = background.probe({ assets: model.assets, accentFill: provisionalFill });
    let dim = 0;
    while (contrastRatio(COLORS.cream, mix(probe, COLORS.ink, dim)) < PRIMARY_TEXT_TARGET && dim < 0.6) {
        dim += 0.05;
    }
    probe = mix(probe, COLORS.ink, dim);

    const textProbe = layout.surface || probe;
    const accent = model.variation.accent === 'poster'
        ? resolveAccent(candidate, textProbe)
        : brandAccent();

    let secondary = COLORS.muted;
    if (contrastRatio(secondary, textProbe) < AA_TEXT) {
        secondary = mix(COLORS.muted, COLORS.cream, 0.5);
    }
    if (contrastRatio(secondary, textProbe) < AA_TEXT) {
        secondary = COLORS.cream;
    }

    return {
        layout: layout,
        background: background,
        accent: accent,
        dim: dim,
        secondary: secondary,
    };
}

export function Card(props) {
    const model = props.model;
    const colors = resolveCardColors(model);
    const layout = colors.layout;
    const Background = colors.background.Component;
    const Bleed = layout.Bleed;
    const Content = layout.Content;

    const style = {
        '--accent': colors.accent.text,
        '--accent-fill': colors.accent.fill,
        '--on-accent': colors.accent.onFill,
        '--text-1': COLORS.cream,
        '--text-2': colors.secondary,
    };

    const layoutProps = {
        movie: model.movie,
        assets: model.assets,
        variation: model.variation,
        seed: model.seed,
        dateKey: model.dateKey,
    };

    return (
        <DisplayContext.Provider value={model.display || DEFAULT_DISPLAY}>
            <div
                className="fc-card"
                ref={props.innerRef}
                style={style}
                data-layout={layout.id}
                data-background={colors.background.id}
                data-accent={colors.accent.source}
            >
                <div className="fc-bg">
                    <Background assets={model.assets} accentFill={colors.accent.fill} />
                    {colors.dim > 0 ? (
                        <div className="fc-layer" style={{ background: 'rgba(14, 13, 12, ' + colors.dim.toFixed(2) + ')' }} />
                    ) : null}
                </div>
                {Bleed ? (
                    <div className="fc-bleed">
                        <Bleed {...layoutProps} />
                    </div>
                ) : null}
                <div className="fc-scrim" />
                <div className="fc-safe">
                    <div className="fc-main">
                        <Content {...layoutProps} />
                    </div>
                    <BrandFooter logoPos={model.variation.logoPos} />
                </div>
            </div>
        </DisplayContext.Provider>
    );
}

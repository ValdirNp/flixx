/**
 * Entry point of the internal /card route (separate bundle: js/card.js).
 */
import { applyCssTokens } from '../shared/tokens';
import { CardApp } from './CardApp';

applyCssTokens(document);

/** Title fitting measures real glyphs, so the brand fonts must be loaded before the first render. */
function waitForFonts() {
    if (!document.fonts || !document.fonts.load) {
        return Promise.resolve();
    }
    const loads = [
        '400 100px "Bebas Neue"',
        '400 26px "Figtree"',
        '500 26px "Figtree"',
        '600 22px "Figtree"',
        '700 22px "Figtree"',
    ].map((font) => document.fonts.load(font, 'ÁÉÇãõ Flixx'));
    const timeout = new Promise((resolve) => setTimeout(resolve, 5000));
    return Promise.race([Promise.all(loads).then(() => document.fonts.ready), timeout]);
}

waitForFonts().then(() => {
    ReactDOM.render(<CardApp />, document.getElementById('app'));
});

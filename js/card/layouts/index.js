/**
 * Layout registry. To add a layout: create a file in this folder exporting
 * { id, name, Content, Bleed?, surface? } and append it below — nothing else changes.
 *
 *   Content  — in-flow content inside the safe area (above the fixed footer)
 *   Bleed    — optional full-card layer under the content (edge-to-edge images)
 *   surface  — optional color the text sits on (defaults to the background probe)
 */
import posterHero from './posterHero';
import sideBySide from './sideBySide';
import strip from './strip';
import typographic from './typographic';
import diagonal from './diagonal';
import ticket from './ticket';

export const LAYOUTS = [
    posterHero,
    sideBySide,
    strip,
    typographic,
    diagonal,
    ticket,
];

export function getLayout(id) {
    return LAYOUTS.find((layout) => layout.id === id) || null;
}

/**
 * Display options: which info the card shows, which text it uses and how the poster is framed.
 * Read from the URL (so every tweak is a shareable link) and provided to the parts via context.
 *
 *   ?hide=kicker,year,runtime,rating,genres   hides those fields
 *   ?text=overview|tagline|custom|none        text block source (default: overview)
 *   ?txt=<texto>                              custom text (with text=custom)
 *   ?fit=cover|contain                        poster: fill (crops) or whole (no crop)
 *   ?px=0..100&py=0..100                      poster focal point (object-position)
 */

export const DISPLAY_FIELDS = [
    { id: 'kicker', label: '“Filme do dia”' },
    { id: 'year', label: 'Ano' },
    { id: 'runtime', label: 'Duração' },
    { id: 'rating', label: 'Nota' },
    { id: 'genres', label: 'Gêneros' },
];

export const TEXT_SOURCES = [
    { id: 'overview', label: 'Sinopse' },
    { id: 'tagline', label: 'Tagline' },
    { id: 'custom', label: 'Personalizado' },
    { id: 'none', label: 'Nenhum' },
];

export const POSTER_FITS = [
    { id: 'cover', label: 'Preencher (corta)' },
    { id: 'contain', label: 'Inteiro (sem corte)' },
];

export const DEFAULT_DISPLAY = {
    hidden: [],
    text: 'overview',
    customText: '',
    fit: 'cover',
    px: null,
    py: null,
};

function readPercent(value) {
    if (value === null || value === '' || !/^\d+(\.\d+)?$/.test(value)) {
        return null;
    }
    return Math.max(0, Math.min(100, Number(value)));
}

export function readDisplay(params) {
    const fields = DISPLAY_FIELDS.map((field) => field.id);
    const text = params.get('text');
    const fit = params.get('fit');
    return {
        hidden: (params.get('hide') || '').split(',').filter((id) => fields.includes(id)),
        text: TEXT_SOURCES.some((source) => source.id === text) ? text : 'overview',
        customText: params.get('txt') || '',
        fit: POSTER_FITS.some((option) => option.id === fit) ? fit : 'cover',
        px: readPercent(params.get('px')),
        py: readPercent(params.get('py')),
    };
}

export function isShown(display, field) {
    return !display.hidden.includes(field);
}

/** The text block content for the current source (may be empty). */
export function cardText(movie, display) {
    if (display.text === 'none') {
        return '';
    }
    if (display.text === 'tagline') {
        return movie.tagline || '';
    }
    if (display.text === 'custom') {
        return display.customText;
    }
    return movie.overview || '';
}

export const DisplayContext = React.createContext(DEFAULT_DISPLAY);

export function useDisplay() {
    return React.useContext(DisplayContext);
}

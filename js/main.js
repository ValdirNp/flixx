const {
    Collapse,
    Container,
    makeStyles,
    createMuiTheme,
    CssBaseline,
    ThemeProvider,
    Typography,
    Box,
    Button,
    Grid,
    FormControl,
    Select,
    MenuItem,
    Slider,
    Chip,
    CircularProgress,
    Input,
} = MaterialUI;

import { COLORS, FONTS, SHAPE, TRACKING } from './shared/tokens';
import {
    CURRENT_YEAR,
    STREAMING_PROVIDERS,
    ORIGINAL_LANGUAGES,
    ORIGIN_COUNTRIES,
    RUNTIME_PRESETS,
    getLanguageName,
    getCountryName,
    getRuntimePreset,
    getGenresForMediaType,
    buildDiscoverParams,
    discoverUrl,
    titleDetailsUrl,
    normalizeTitleDetails,
} from './shared/tmdb';

const MEDIA_TYPES = [
    { id: '', name: 'Filme ou série' },
    { id: 'movie', name: 'Filme' },
    { id: 'tv', name: 'Série' },
];

const MIN_RATINGS = [
    { id: '', name: 'Qualquer nota' },
    { id: '6', name: '6,0+' },
    { id: '6.5', name: '6,5+' },
    { id: '7', name: '7,0+' },
    { id: '7.5', name: '7,5+' },
    { id: '8', name: '8,0+' },
];

const MOOD_KEYWORDS = [
    { id: 9672, name: 'Baseado em fatos reais' },
    { id: 818, name: 'Baseado em livro' },
    { id: 9717, name: 'Baseado em HQ' },
    { id: 210024, name: 'Anime' },
    { id: 9715, name: 'Super-herói' },
    { id: 4379, name: 'Viagem no tempo' },
    { id: 4565, name: 'Distopia' },
    { id: 9882, name: 'Espaço' },
    { id: 9951, name: 'Aliens' },
    { id: 12377, name: 'Zumbi' },
    { id: 3133, name: 'Vampiro' },
    { id: 100, name: 'Assalto / heist' },
    { id: 158718, name: 'Espionagem' },
    { id: 10683, name: 'Amadurecimento' },
    { id: 14544, name: 'Direção feminina' },
    { id: 222243, name: 'Natal' },
    { id: 4344, name: 'Musical' },
];

const TV_STATUSES = [
    { id: '', name: 'Qualquer status' },
    { id: '0', name: 'Em exibição' },
    { id: '3', name: 'Encerrada' },
    { id: '4', name: 'Cancelada' },
];

function getMinRatingLabel(value) {
    const match = MIN_RATINGS.find((item) => item.id === value);
    return match ? match.name : value;
}

function getTvStatusLabel(value) {
    const match = TV_STATUSES.find((item) => item.id === value);
    return match ? match.name : value;
}

function titleMatchesOriginCountry(item, countryCode, isTv) {
    if (!countryCode) {
        return true;
    }

    if (isTv) {
        return (item.origin_country || []).includes(countryCode);
    }

    return true;
}

function pickRandomTitle(titles, countryCode, isTv) {
    const candidates = countryCode
        ? titles.filter((item) => titleMatchesOriginCountry(item, countryCode, isTv))
        : titles;

    if (!candidates.length) {
        return null;
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
}

function getGenreNamesByIds(genreIds, mediaType) {
    const genres = getGenresForMediaType(mediaType);
    return genres
        .filter((genre) => genreIds.includes(genre.id))
        .map((genre) => genre.name)
        .join(', ');
}

const DEFAULT_YEARS = [1990, CURRENT_YEAR];

/** Filters <-> query string, so a reload or a shared link keeps the same search. */
function readFiltersFromUrl(search) {
    const params = new URLSearchParams(search);
    const ids = (key) => (params.get(key) || '')
        .split(',')
        .filter(Boolean)
        .map(Number)
        .filter((value) => Number.isInteger(value));
    const oneOf = (key, list) => {
        const value = params.get(key) || '';
        return list.some((item) => item.id === value) ? value : '';
    };

    const mediaType = oneOf('tipo', MEDIA_TYPES);
    const allowedGenres = getGenresForMediaType(mediaType).map((genre) => genre.id);
    const selectedGenres = ids('generos').filter((id) => allowedGenres.includes(id));
    const from = Number(params.get('de'));
    const to = Number(params.get('ate'));
    const validYear = (year) => Number.isInteger(year) && year >= 1900 && year <= CURRENT_YEAR;
    const years = validYear(from) && validYear(to) && from <= to ? [from, to] : DEFAULT_YEARS;

    return {
        mediaType: mediaType,
        selectedGenres: selectedGenres,
        excludedGenres: ids('sem').filter((id) => allowedGenres.includes(id) && !selectedGenres.includes(id)),
        moodKeywords: ids('clima').filter((id) => MOOD_KEYWORDS.some((keyword) => keyword.id === id)),
        minRating: oneOf('nota', MIN_RATINGS),
        runtimePreset: mediaType === 'tv' ? '' : oneOf('duracao', RUNTIME_PRESETS),
        tvStatus: mediaType === 'movie' ? '' : oneOf('status', TV_STATUSES),
        years: years,
        originalLanguage: oneOf('idioma', ORIGINAL_LANGUAGES),
        originCountry: oneOf('pais', ORIGIN_COUNTRIES),
        selectedProviders: ids('streaming').filter((id) => STREAMING_PROVIDERS.some((provider) => provider.id === id)),
    };
}

const FILTER_PARAMS = ['tipo', 'generos', 'sem', 'clima', 'nota', 'duracao', 'status', 'de', 'ate', 'idioma', 'pais', 'streaming'];

/** Rewrites only the filter params of `currentSearch`; anything else (utm_*, etc.) is kept. */
function filtersToSearch(filters, currentSearch) {
    const params = new URLSearchParams(currentSearch || '');
    FILTER_PARAMS.forEach((key) => params.delete(key));
    const setList = (key, list) => {
        if (list.length) {
            params.set(key, list.join(','));
        }
    };
    const setValue = (key, value) => {
        if (value) {
            params.set(key, value);
        }
    };

    setValue('tipo', filters.mediaType);
    setList('generos', filters.selectedGenres);
    setList('sem', filters.excludedGenres);
    setList('clima', filters.moodKeywords);
    setValue('nota', filters.minRating);
    setValue('duracao', filters.runtimePreset);
    setValue('status', filters.tvStatus);
    if (filters.years[0] !== DEFAULT_YEARS[0] || filters.years[1] !== DEFAULT_YEARS[1]) {
        params.set('de', filters.years[0]);
        params.set('ate', filters.years[1]);
    }
    setValue('idioma', filters.originalLanguage);
    setValue('pais', filters.originCountry);
    setList('streaming', filters.selectedProviders);

    // Commas are safe in a query string: keep list params readable (generos=16,35).
    const value = params.toString().replace(/%2C/g, ',');
    return value ? '?' + value : '';
}

function summarizeNames(names) {
    return names.length <= 2 ? names.join(', ') : names[0] + ' +' + (names.length - 1);
}

/** Active filters that live in the collapsible panel, as removable summary chips. */
function describeAdvancedFilters(filters) {
    const items = [];
    const genres = getGenresForMediaType(filters.mediaType);

    if (filters.excludedGenres.length) {
        const names = genres.filter((genre) => filters.excludedGenres.includes(genre.id)).map((genre) => genre.name);
        items.push({ key: 'sem', label: 'Sem ' + summarizeNames(names) });
    }
    if (filters.moodKeywords.length) {
        const names = MOOD_KEYWORDS.filter((keyword) => filters.moodKeywords.includes(keyword.id)).map((keyword) => keyword.name);
        items.push({ key: 'clima', label: 'Clima: ' + summarizeNames(names) });
    }
    if (filters.minRating) {
        items.push({ key: 'nota', label: 'Nota ' + getMinRatingLabel(filters.minRating) });
    }
    if (filters.runtimePreset) {
        items.push({ key: 'duracao', label: getRuntimePreset(filters.runtimePreset).name });
    }
    if (filters.tvStatus) {
        items.push({ key: 'status', label: getTvStatusLabel(filters.tvStatus) });
    }
    if (filters.years[0] !== DEFAULT_YEARS[0] || filters.years[1] !== DEFAULT_YEARS[1]) {
        items.push({ key: 'periodo', label: filters.years[0] + '–' + filters.years[1] });
    }
    if (filters.originalLanguage) {
        items.push({ key: 'idioma', label: getLanguageName(filters.originalLanguage) });
    }
    if (filters.originCountry) {
        items.push({ key: 'pais', label: getCountryName(filters.originCountry) });
    }

    return items;
}

const theme = createMuiTheme({
    typography: {
        fontFamily: FONTS.body,
        h1: {
            fontFamily: FONTS.display,
            letterSpacing: TRACKING.display,
        },
        h2: {
            fontFamily: FONTS.display,
            letterSpacing: TRACKING.display,
        },
        h3: {
            fontFamily: FONTS.display,
            letterSpacing: '0.03em',
        },
        h5: {
            fontFamily: FONTS.display,
            letterSpacing: '0.03em',
        },
        button: {
            fontFamily: FONTS.body,
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    palette: {
        type: 'dark',
        primary: {
            main: COLORS.red,
        },
        secondary: {
            main: COLORS.gold,
        },
        background: {
            default: COLORS.ink,
            paper: COLORS.paper,
        },
        text: {
            primary: COLORS.cream,
            secondary: COLORS.muted,
        },
        error: {
            main: COLORS.red,
        },
    },
    shape: {
        borderRadius: SHAPE.radius,
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                body: {
                    backgroundColor: '#0E0D0C',
                },
                '::selection': {
                    backgroundColor: 'rgba(229, 9, 20, 0.35)',
                },
            },
        },
        MuiSlider: {
            root: {
                color: '#E50914',
                height: 4,
            },
            thumb: {
                height: 16,
                width: 16,
                backgroundColor: '#F5F0E8',
                border: '2px solid #E50914',
                marginTop: -6,
                marginLeft: -8,
                '&:focus, &:hover, &$active': {
                    boxShadow: '0 0 0 6px rgba(229, 9, 20, 0.16)',
                },
            },
            track: {
                height: 4,
                borderRadius: 2,
            },
            rail: {
                height: 4,
                borderRadius: 2,
                opacity: 0.35,
                backgroundColor: '#9A9288',
            },
            valueLabel: {
                left: 'calc(-50% + 4px)',
                '& *': {
                    background: '#E50914',
                    color: '#F5F0E8',
                },
            },
        },
        MuiSelect: {
            root: {
                color: '#F5F0E8',
            },
            icon: {
                color: '#9A9288',
            },
        },
        MuiInput: {
            underline: {
                '&:before': {
                    borderBottomColor: 'rgba(154, 146, 136, 0.4)',
                },
                '&:hover:not($disabled):before': {
                    borderBottomColor: '#D4A574',
                },
                '&:after': {
                    borderBottomColor: '#E50914',
                },
            },
        },
        MuiMenuItem: {
            root: {
                fontFamily: '"Figtree", sans-serif',
            },
        },
    },
});

const useStyles = makeStyles((muiTheme) => ({
    root: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        color: muiTheme.palette.text.primary,
        backgroundColor: muiTheme.palette.background.default,
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: [
                'radial-gradient(ellipse 90% 55% at 12% -10%, rgba(229, 9, 20, 0.22), transparent 55%)',
                'radial-gradient(ellipse 70% 50% at 88% 8%, rgba(212, 165, 116, 0.12), transparent 50%)',
                'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(229, 9, 20, 0.08), transparent 55%)',
                'linear-gradient(180deg, #141210 0%, #0E0D0C 45%, #090807 100%)',
            ].join(', '),
            zIndex: 0,
            pointerEvents: 'none',
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.45\'/%3E%3C/svg%3E")',
            opacity: 0.045,
            mixBlendMode: 'overlay',
            zIndex: 0,
            pointerEvents: 'none',
        },
    },
    beam: {
        position: 'absolute',
        top: '-10%',
        left: '50%',
        width: 'min(70vw, 720px)',
        height: '55vh',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, rgba(245, 240, 232, 0.07) 0%, rgba(245, 240, 232, 0.02) 40%, transparent 100%)',
        clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: '$beamPulse 8s ease-in-out infinite',
    },
    '@keyframes beamPulse': {
        '0%, 100%': { opacity: 0.55 },
        '50%': { opacity: 1 },
    },
    '@keyframes fadeRise': {
        from: {
            opacity: 0,
            transform: 'translateY(18px)',
        },
        to: {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
    '@keyframes brandIn': {
        from: {
            opacity: 0,
            letterSpacing: '0.35em',
            transform: 'translateY(12px)',
        },
        to: {
            opacity: 1,
            letterSpacing: '0.06em',
            transform: 'translateY(0)',
        },
    },
    main: {
        position: 'relative',
        zIndex: 1,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: muiTheme.spacing(6),
        paddingBottom: muiTheme.spacing(6),
        animation: '$fadeRise 0.7s ease-out',
    },
    brand: {
        fontFamily: '"Bebas Neue", Impact, sans-serif',
        fontSize: 'clamp(4.5rem, 14vw, 7.5rem)',
        lineHeight: 0.9,
        color: '#E50914',
        margin: 0,
        animation: '$brandIn 0.9s ease-out',
    },
    tagline: {
        marginTop: muiTheme.spacing(1.5),
        maxWidth: 420,
        color: muiTheme.palette.text.secondary,
        fontSize: '1.05rem',
        lineHeight: 1.5,
        animation: '$fadeRise 0.8s ease-out 0.1s both',
    },
    filtersPanel: {
        marginTop: muiTheme.spacing(5),
        animation: '$fadeRise 0.85s ease-out 0.15s both',
    },
    filterLabel: {
        display: 'block',
        marginBottom: muiTheme.spacing(1.25),
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: muiTheme.palette.secondary.main,
    },
    formControl: {
        width: '100%',
        marginBottom: muiTheme.spacing(3.5),
    },
    yearsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: muiTheme.spacing(0.5),
    },
    yearValue: {
        fontSize: '0.9rem',
        color: muiTheme.palette.text.primary,
        fontVariantNumeric: 'tabular-nums',
    },
    chipRow: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: muiTheme.spacing(-0.5),
    },
    streamChip: {
        margin: muiTheme.spacing(0.5),
        borderRadius: 4,
        border: '1px solid rgba(154, 146, 136, 0.35)',
        backgroundColor: 'transparent',
        color: muiTheme.palette.text.secondary,
        fontWeight: 500,
        transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.15s ease',
        '&:hover': {
            backgroundColor: 'rgba(245, 240, 232, 0.06)',
            borderColor: 'rgba(212, 165, 116, 0.55)',
        },
        '&:active': {
            transform: 'scale(0.97)',
        },
    },
    streamChipSelected: {
        color: '#F5F0E8',
        borderColor: 'currentColor',
        backgroundColor: 'rgba(245, 240, 232, 0.08)',
    },
    typeChip: {
        margin: muiTheme.spacing(0.5),
        borderRadius: 4,
        border: '1px solid rgba(245, 240, 232, 0.4)',
        backgroundColor: 'rgba(245, 240, 232, 0.08)',
        color: '#F5F0E8',
        fontWeight: 600,
        transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.15s ease',
        '& .MuiChip-label': {
            color: 'inherit',
            paddingLeft: 14,
            paddingRight: 14,
        },
        '&:hover': {
            backgroundColor: 'rgba(245, 240, 232, 0.14)',
            borderColor: 'rgba(245, 240, 232, 0.65)',
        },
        '&:active': {
            transform: 'scale(0.97)',
        },
    },
    typeChipSelected: {
        color: '#F5F0E8',
        borderColor: '#C40812',
        backgroundColor: '#E50914',
        fontWeight: 700,
        '&:hover': {
            backgroundColor: '#C40812',
            borderColor: '#C40812',
        },
    },
    advancedBar: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: muiTheme.spacing(1),
        marginTop: muiTheme.spacing(-1),
        marginBottom: muiTheme.spacing(3),
    },
    advancedToggle: {
        borderColor: 'rgba(154, 146, 136, 0.45)',
        borderRadius: 4,
        color: '#F5F0E8',
        padding: muiTheme.spacing(0.75, 1.75),
        '&:hover': {
            borderColor: '#D4A574',
            backgroundColor: 'rgba(212, 165, 116, 0.08)',
        },
    },
    advancedCount: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 20,
        height: 20,
        marginLeft: muiTheme.spacing(1),
        padding: '0 6px',
        borderRadius: 10,
        backgroundColor: '#E50914',
        color: '#F5F0E8',
        fontSize: '0.75rem',
        fontWeight: 700,
        lineHeight: 1,
    },
    advancedCaret: {
        display: 'inline-block',
        marginLeft: muiTheme.spacing(1),
        color: muiTheme.palette.text.secondary,
        transition: 'transform 0.2s ease',
    },
    advancedCaretOpen: {
        transform: 'rotate(180deg)',
    },
    activeChip: {
        borderRadius: 4,
        border: '1px solid rgba(212, 165, 116, 0.55)',
        backgroundColor: 'rgba(212, 165, 116, 0.1)',
        color: '#F5F0E8',
        fontWeight: 500,
        '& .MuiChip-deleteIcon': {
            color: muiTheme.palette.text.secondary,
            '&:hover': {
                color: '#F5F0E8',
            },
        },
    },
    clearButton: {
        color: muiTheme.palette.text.secondary,
        fontSize: '0.85rem',
        '&:hover': {
            color: '#F5F0E8',
            backgroundColor: 'transparent',
        },
    },
    advancedGrid: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        columnGap: muiTheme.spacing(4),
        paddingTop: muiTheme.spacing(1),
        [muiTheme.breakpoints.up('sm')]: {
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        },
        [muiTheme.breakpoints.up('md')]: {
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        },
    },
    fullRow: {
        gridColumn: '1 / -1',
    },
    actions: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: muiTheme.spacing(2),
        marginTop: muiTheme.spacing(1),
        animation: '$fadeRise 0.9s ease-out 0.2s both',
    },
    suggestButton: {
        minWidth: 200,
        padding: muiTheme.spacing(1.4, 3.5),
        fontSize: '1rem',
        fontWeight: 700,
        borderRadius: 4,
        backgroundColor: '#E50914',
        color: '#F5F0E8',
        boxShadow: 'none',
        transition: 'background-color 0.2s ease, transform 0.15s ease',
        '&:hover': {
            backgroundColor: '#C40812',
            boxShadow: 'none',
        },
        '&:active': {
            transform: 'translateY(1px)',
        },
        '&:disabled': {
            backgroundColor: 'rgba(229, 9, 20, 0.35)',
            color: 'rgba(245, 240, 232, 0.55)',
        },
    },
    hint: {
        color: muiTheme.palette.text.secondary,
        fontSize: '0.85rem',
    },
    errorText: {
        marginTop: muiTheme.spacing(2),
        color: '#E50914',
        fontSize: '0.9rem',
    },
    resultSection: {
        position: 'relative',
        zIndex: 1,
        marginTop: muiTheme.spacing(2),
        marginBottom: muiTheme.spacing(6),
        animation: '$fadeRise 0.55s ease-out',
    },
    resultShell: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderTop: '1px solid rgba(154, 146, 136, 0.22)',
        borderBottom: '1px solid rgba(154, 146, 136, 0.22)',
        background: 'linear-gradient(90deg, rgba(26, 24, 22, 0.92) 0%, rgba(14, 13, 12, 0.75) 100%)',
        [muiTheme.breakpoints.up('md')]: {
            flexDirection: 'row',
            minHeight: 480,
        },
    },
    poster: {
        width: '100%',
        aspectRatio: '2 / 3',
        maxHeight: 520,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundColor: '#1A1816',
        [muiTheme.breakpoints.up('md')]: {
            width: '38%',
            maxWidth: 360,
            maxHeight: 'none',
            alignSelf: 'center',
            flexShrink: 0,
        },
    },
    resultBody: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: muiTheme.spacing(4, 3),
        [muiTheme.breakpoints.up('md')]: {
            padding: muiTheme.spacing(5, 5),
        },
    },
    resultTitle: {
        fontFamily: '"Bebas Neue", Impact, sans-serif',
        fontSize: 'clamp(2rem, 5vw, 3.25rem)',
        lineHeight: 1,
        marginBottom: muiTheme.spacing(1),
        color: '#F5F0E8',
    },
    meta: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: muiTheme.spacing(1, 2.5),
        marginBottom: muiTheme.spacing(2),
        color: muiTheme.palette.text.secondary,
        fontSize: '0.92rem',
    },
    metaAccent: {
        color: muiTheme.palette.secondary.main,
        fontWeight: 600,
    },
    ratingStars: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        letterSpacing: '0.06em',
        color: muiTheme.palette.secondary.main,
        lineHeight: 1,
    },
    ratingStarEmpty: {
        color: 'rgba(154, 146, 136, 0.45)',
    },
    ratingValue: {
        marginLeft: muiTheme.spacing(0.75),
        color: muiTheme.palette.text.secondary,
        fontSize: '0.85rem',
        fontVariantNumeric: 'tabular-nums',
    },
    overview: {
        maxWidth: 560,
        color: muiTheme.palette.text.primary,
        opacity: 0.88,
        lineHeight: 1.65,
        marginBottom: muiTheme.spacing(3),
    },
    providersLabel: {
        marginBottom: muiTheme.spacing(1),
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: muiTheme.palette.secondary.main,
    },
    providerList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: muiTheme.spacing(1),
        marginBottom: muiTheme.spacing(3),
    },
    providerPill: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: muiTheme.spacing(0.6, 1.25),
        borderRadius: 4,
        border: '1px solid rgba(154, 146, 136, 0.35)',
        fontSize: '0.82rem',
        color: '#F5F0E8',
        textDecoration: 'none',
        transition: 'border-color 0.2s ease, background-color 0.2s ease',
        '&:hover': {
            borderColor: '#D4A574',
            backgroundColor: 'rgba(212, 165, 116, 0.08)',
        },
    },
    resultActions: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: muiTheme.spacing(1.5),
    },
    imdbButton: {
        backgroundColor: '#C3A00D',
        color: '#0E0D0C',
        fontWeight: 700,
        borderRadius: 4,
        boxShadow: 'none',
        '&:hover': {
            backgroundColor: '#A8880B',
            boxShadow: 'none',
        },
    },
    homeButton: {
        borderColor: 'rgba(154, 146, 136, 0.45)',
        color: '#F5F0E8',
        borderRadius: 4,
        '&:hover': {
            borderColor: '#D4A574',
            backgroundColor: 'rgba(212, 165, 116, 0.08)',
        },
    },
    footer: {
        position: 'relative',
        zIndex: 1,
        padding: muiTheme.spacing(3, 2),
        marginTop: 'auto',
        borderTop: '1px solid rgba(154, 146, 136, 0.15)',
        backgroundColor: 'rgba(9, 8, 7, 0.65)',
    },
    footerText: {
        color: muiTheme.palette.text.secondary,
        fontSize: '0.85rem',
        textAlign: 'center',
        '& a': {
            color: muiTheme.palette.secondary.main,
            textDecoration: 'none',
            borderBottom: '1px solid transparent',
            transition: 'border-color 0.2s ease',
            '&:hover': {
                borderBottomColor: muiTheme.palette.secondary.main,
            },
        },
    },
    loadingWrap: {
        display: 'flex',
        justifyContent: 'center',
        padding: muiTheme.spacing(6, 0),
    },
}));

function Title() {
    const classes = useStyles();

    return (
        <Box>
            <Typography className={classes.brand} component="h1">
                Flixx
            </Typography>
            <Typography className={classes.tagline}>
                Escolha tipo, gênero, clima, nota e streaming — a gente sorteia o que assistir.
            </Typography>
        </Box>
    );
}

function AdvancedFiltersToggle(props) {
    const classes = useStyles();
    const count = props.activeFilters.length;

    return (
        <div className={classes.advancedBar}>
            <Button
                className={classes.advancedToggle}
                variant="outlined"
                onClick={props.onToggle}
                aria-expanded={props.open}
                aria-controls="advanced-filters"
            >
                {props.open ? 'Menos filtros' : 'Mais filtros'}
                {count ? <span className={classes.advancedCount}>{count}</span> : null}
                <span
                    className={classes.advancedCaret + (props.open ? ' ' + classes.advancedCaretOpen : '')}
                    aria-hidden="true"
                >
                    ▾
                </span>
            </Button>
            {!props.open && props.activeFilters.map((filter) => (
                <Chip
                    key={filter.key}
                    label={filter.label}
                    onDelete={filter.clear}
                    className={classes.activeChip}
                />
            ))}
            {count ? (
                <Button className={classes.clearButton} onClick={props.onClear}>
                    Limpar
                </Button>
            ) : null}
        </div>
    );
}

function Filters(props) {
    const classes = useStyles();
    const genres = getGenresForMediaType(props.mediaType);
    const showRuntime = props.mediaType !== 'tv';
    const showTvStatus = props.mediaType !== 'movie';

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 48 * 4.5 + 8,
                width: 280,
                backgroundColor: '#1A1816',
            },
        },
        getContentAnchorEl: null,
    };

    const handleGenreChange = (event) => {
        const nextGenres = event.target.value;
        props.selectGenre(nextGenres);
        props.setExcludedGenres(props.excludedGenres.filter((id) => !nextGenres.includes(id)));
    };

    const handleExcludedGenreChange = (event) => {
        const nextExcluded = event.target.value;
        props.setExcludedGenres(nextExcluded);
        props.selectGenre(props.selectedGenres.filter((id) => !nextExcluded.includes(id)));
    };

    const handleYearsChange = (event, newValue) => {
        props.setYears(newValue);
    };

    const handleLanguageChange = (event) => {
        props.setOriginalLanguage(event.target.value);
    };

    const handleCountryChange = (event) => {
        props.setOriginCountry(event.target.value);
    };

    const handleMinRatingChange = (event) => {
        props.setMinRating(event.target.value);
    };

    const handleRuntimeChange = (event) => {
        props.setRuntimePreset(event.target.value);
    };

    const handleMoodChange = (event) => {
        props.setMoodKeywords(event.target.value);
    };

    const handleTvStatusChange = (event) => {
        props.setTvStatus(event.target.value);
    };

    const setMediaType = (mediaTypeId) => {
        props.setMediaType(mediaTypeId);
        const allowedIds = getGenresForMediaType(mediaTypeId).map((genre) => genre.id);
        props.selectGenre(props.selectedGenres.filter((id) => allowedIds.includes(id)));
        props.setExcludedGenres(props.excludedGenres.filter((id) => allowedIds.includes(id)));

        if (mediaTypeId === 'tv') {
            props.setRuntimePreset('');
        }

        if (mediaTypeId === 'movie') {
            props.setTvStatus('');
        }
    };

    const toggleProvider = (providerId) => {
        const current = props.selectedProviders;
        if (current.includes(providerId)) {
            props.setProviders(current.filter((id) => id !== providerId));
        } else {
            props.setProviders(current.concat(providerId));
        }
    };

    const selectedGenreNames = getGenreNamesByIds(props.selectedGenres, props.mediaType);
    const excludedGenreNames = getGenreNamesByIds(props.excludedGenres, props.mediaType);
    const selectedMoodNames = MOOD_KEYWORDS
        .filter((keyword) => props.moodKeywords.includes(keyword.id))
        .map((keyword) => keyword.name)
        .join(', ');

    return (
        <div className={classes.filtersPanel}>
            <FormControl className={classes.formControl}>
                <Typography className={classes.filterLabel} id="media-type-label">
                    Tipo
                </Typography>
                <div className={classes.chipRow} role="group" aria-labelledby="media-type-label">
                    {MEDIA_TYPES.map((mediaType) => {
                        const selected = props.mediaType === mediaType.id;
                        return (
                            <Chip
                                key={mediaType.id || 'any'}
                                label={mediaType.name}
                                clickable
                                onClick={() => setMediaType(mediaType.id)}
                                className={
                                    classes.typeChip +
                                    (selected ? ' ' + classes.typeChipSelected : '')
                                }
                            />
                        );
                    })}
                </div>
            </FormControl>

            <FormControl className={classes.formControl}>
                <Typography className={classes.filterLabel} id="genre-label">
                    Gêneros
                </Typography>
                <Select
                    id="genre"
                    multiple
                    displayEmpty
                    value={props.selectedGenres}
                    onChange={handleGenreChange}
                    input={<Input />}
                    MenuProps={MenuProps}
                    renderValue={(selected) => {
                        if (!selected.length) {
                            return <span style={{ color: '#9A9288' }}>Qualquer gênero</span>;
                        }
                        return selectedGenreNames;
                    }}
                >
                    {genres.map((genre) => (
                        <MenuItem
                            key={genre.id}
                            value={genre.id}
                            style={{
                                fontWeight: props.selectedGenres.includes(genre.id) ? 600 : 400,
                            }}
                        >
                            {genre.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
                <Typography className={classes.filterLabel} id="streaming-label">
                    Onde assistir
                </Typography>
                <div className={classes.chipRow} role="group" aria-labelledby="streaming-label">
                    {STREAMING_PROVIDERS.map((provider) => {
                        const selected = props.selectedProviders.includes(provider.id);
                        return (
                            <Chip
                                key={provider.id}
                                label={provider.name}
                                clickable
                                onClick={() => toggleProvider(provider.id)}
                                className={
                                    classes.streamChip +
                                    (selected ? ' ' + classes.streamChipSelected : '')
                                }
                                style={selected ? { color: provider.color, borderColor: provider.color } : undefined}
                            />
                        );
                    })}
                </div>
            </FormControl>
            <AdvancedFiltersToggle
                open={props.advancedOpen}
                onToggle={() => props.setAdvancedOpen(!props.advancedOpen)}
                activeFilters={props.activeAdvancedFilters}
                onClear={props.clearAdvancedFilters}
            />

            <Collapse in={props.advancedOpen} timeout="auto">
                <div className={classes.advancedGrid} id="advanced-filters">
                    <FormControl className={classes.formControl}>
                        <Typography className={classes.filterLabel} id="exclude-genre-label">
                            Excluir gêneros
                        </Typography>
                        <Select
                            id="exclude-genre"
                            multiple
                            displayEmpty
                            value={props.excludedGenres}
                            onChange={handleExcludedGenreChange}
                            input={<Input />}
                            MenuProps={MenuProps}
                            renderValue={(selected) => {
                                if (!selected.length) {
                                    return <span style={{ color: '#9A9288' }}>Nenhum excluído</span>;
                                }
                                return excludedGenreNames;
                            }}
                        >
                            {genres.map((genre) => (
                                <MenuItem
                                    key={'exclude-' + genre.id}
                                    value={genre.id}
                                    style={{
                                        fontWeight: props.excludedGenres.includes(genre.id) ? 600 : 400,
                                    }}
                                >
                                    {genre.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <Typography className={classes.filterLabel} id="mood-label">
                            Clima
                        </Typography>
                        <Select
                            id="mood"
                            multiple
                            displayEmpty
                            value={props.moodKeywords}
                            onChange={handleMoodChange}
                            input={<Input />}
                            MenuProps={MenuProps}
                            renderValue={(selected) => {
                                if (!selected.length) {
                                    return <span style={{ color: '#9A9288' }}>Qualquer clima</span>;
                                }
                                return selectedMoodNames;
                            }}
                        >
                            {MOOD_KEYWORDS.map((keyword) => (
                                <MenuItem
                                    key={keyword.id}
                                    value={keyword.id}
                                    style={{
                                        fontWeight: props.moodKeywords.includes(keyword.id) ? 600 : 400,
                                    }}
                                >
                                    {keyword.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <Typography className={classes.filterLabel} id="min-rating-label">
                            Nota mínima
                        </Typography>
                        <Select
                            id="min-rating"
                            displayEmpty
                            value={props.minRating}
                            onChange={handleMinRatingChange}
                            input={<Input />}
                            MenuProps={MenuProps}
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <span style={{ color: '#9A9288' }}>Qualquer nota</span>;
                                }
                                return getMinRatingLabel(selected);
                            }}
                        >
                            {MIN_RATINGS.map((rating) => (
                                <MenuItem key={rating.id || 'any-rating'} value={rating.id}>
                                    {rating.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {showRuntime ? (
                        <FormControl className={classes.formControl}>
                            <Typography className={classes.filterLabel} id="runtime-label">
                                Duração do filme
                            </Typography>
                            <Select
                                id="runtime"
                                displayEmpty
                                value={props.runtimePreset}
                                onChange={handleRuntimeChange}
                                input={<Input />}
                                MenuProps={MenuProps}
                                renderValue={(selected) => {
                                    const preset = getRuntimePreset(selected);
                                    if (!selected) {
                                        return <span style={{ color: '#9A9288' }}>Qualquer duração</span>;
                                    }
                                    return preset.name;
                                }}
                            >
                                {RUNTIME_PRESETS.map((preset) => (
                                    <MenuItem key={preset.id || 'any-runtime'} value={preset.id}>
                                        {preset.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : null}

                    {showTvStatus ? (
                        <FormControl className={classes.formControl}>
                            <Typography className={classes.filterLabel} id="tv-status-label">
                                Status da série
                            </Typography>
                            <Select
                                id="tv-status"
                                displayEmpty
                                value={props.tvStatus}
                                onChange={handleTvStatusChange}
                                input={<Input />}
                                MenuProps={MenuProps}
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <span style={{ color: '#9A9288' }}>Qualquer status</span>;
                                    }
                                    return getTvStatusLabel(selected);
                                }}
                            >
                                {TV_STATUSES.map((status) => (
                                    <MenuItem key={status.id || 'any-status'} value={status.id}>
                                        {status.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : null}

                    <FormControl className={classes.formControl}>
                        <Typography className={classes.filterLabel} id="language-label">
                            Idioma original
                        </Typography>
                        <Select
                            id="original-language"
                            displayEmpty
                            value={props.originalLanguage}
                            onChange={handleLanguageChange}
                            input={<Input />}
                            MenuProps={MenuProps}
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <span style={{ color: '#9A9288' }}>Qualquer idioma</span>;
                                }
                                return getLanguageName(selected);
                            }}
                        >
                            <MenuItem value="">
                                Qualquer idioma
                            </MenuItem>
                            {ORIGINAL_LANGUAGES.map((language) => (
                                <MenuItem key={language.id} value={language.id}>
                                    {language.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <Typography className={classes.filterLabel} id="country-label">
                            País de origem
                        </Typography>
                        <Select
                            id="origin-country"
                            displayEmpty
                            value={props.originCountry}
                            onChange={handleCountryChange}
                            input={<Input />}
                            MenuProps={MenuProps}
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <span style={{ color: '#9A9288' }}>Qualquer país</span>;
                                }
                                return getCountryName(selected);
                            }}
                        >
                            <MenuItem value="">
                                Qualquer país
                            </MenuItem>
                            {ORIGIN_COUNTRIES.map((country) => (
                                <MenuItem key={country.id} value={country.id}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl className={classes.formControl + ' ' + classes.fullRow}>
                        <Typography className={classes.filterLabel} id="years-label">
                            Período
                        </Typography>
                        <div className={classes.yearsRow}>
                            <span className={classes.yearValue}>{props.years[0]}</span>
                            <span className={classes.yearValue}>{props.years[1]}</span>
                        </div>
                        <Slider
                            value={props.years}
                            onChange={handleYearsChange}
                            valueLabelDisplay="auto"
                            aria-labelledby="years-label"
                            min={1900}
                            step={1}
                            max={CURRENT_YEAR}
                        />
                    </FormControl>

                </div>
            </Collapse>
        </div>
    );
}

function SuggestionButton(props) {
    const classes = useStyles();

    let buttonLabel = 'Sugerir algo';
    if (props.mediaType === 'movie') {
        buttonLabel = 'Sugerir um filme';
    } else if (props.mediaType === 'tv') {
        buttonLabel = 'Sugerir uma série';
    }

    return (
        <div className={classes.actions}>
            <Button
                className={classes.suggestButton}
                variant="contained"
                onClick={props.getSuggestion}
                disabled={props.loading}
            >
                {props.loading ? 'Procurando…' : buttonLabel}
            </Button>
            {!props.hasResult && !props.loading && !props.hasProviders && (
                <Typography className={classes.hint}>
                    Sem filtro de streaming = qualquer plataforma
                </Typography>
            )}
        </div>
    );
}

function RatingStars(props) {
    const classes = useStyles();
    const average = Number(props.average);
    const voteCount = Number(props.voteCount) || 0;

    if (!voteCount || !Number.isFinite(average) || average <= 0) {
        return null;
    }

    const scoreOutOfFive = Math.max(0, Math.min(5, average / 2));
    const filledCount = Math.round(scoreOutOfFive);
    const label = average.toFixed(1).replace('.', ',') + ' de 10';

    return (
        <span className={classes.ratingStars} role="img" aria-label={'Nota ' + label}>
            {[0, 1, 2, 3, 4].map((index) => (
                <span
                    key={index}
                    className={index < filledCount ? undefined : classes.ratingStarEmpty}
                    aria-hidden="true"
                >
                    ★
                </span>
            ))}
            <span className={classes.ratingValue}>{label}</span>
        </span>
    );
}

function formatSeasonsLabel(count) {
    if (!count) {
        return null;
    }
    return count === 1 ? '1 temporada' : count + ' temporadas';
}

function SuggestionResult(props) {
    const classes = useStyles();
    const movie = props.movie;
    const resultRef = React.useRef(null);
    const loadingRef = React.useRef(null);

    React.useEffect(() => {
        if (props.loading && loadingRef.current) {
            loadingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        if (!props.loading && movie && movie.title && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [props.loading, movie]);

    if (props.loading) {
        return (
            <div className={classes.loadingWrap} ref={loadingRef}>
                <CircularProgress color="primary" />
            </div>
        );
    }

    if (!movie || !movie.title) {
        return null;
    }

    const seasonsLabel = movie.media_type === 'tv' ? formatSeasonsLabel(movie.number_of_seasons) : null;

    return (
        <section className={classes.resultSection} ref={resultRef} aria-live="polite">
            <div className={classes.resultShell}>
                <div
                    className={classes.poster}
                    style={{ backgroundImage: 'url(' + movie.poster + ')' }}
                    role="img"
                    aria-label={'Poster de ' + movie.title}
                />
                <div className={classes.resultBody}>
                    <Typography className={classes.resultTitle} component="h2">
                        {movie.title}
                    </Typography>

                    <div className={classes.meta}>
                        <span>{movie.media_label}</span>
                        <span>{movie.release_year}</span>
                        {seasonsLabel ? <span>{seasonsLabel}</span> : null}
                        <RatingStars average={movie.vote_average} voteCount={movie.vote_count} />
                        {movie.genres ? <span>{movie.genres}</span> : null}
                        {movie.original_language_label ? <span>{movie.original_language_label}</span> : null}
                        {movie.origin_country_label ? <span>{movie.origin_country_label}</span> : null}
                    </div>

                    {movie.original_title && movie.original_title !== movie.title ? (
                        <Typography variant="body2" color="textSecondary" paragraph>
                            Nome original: {movie.original_title}
                        </Typography>
                    ) : null}

                    <Typography className={classes.overview}>
                        {movie.overview || 'Sinopse indisponível para este título.'}
                    </Typography>

                    {movie.watch_providers && movie.watch_providers.length > 0 ? (
                        <div>
                            <Typography className={classes.providersLabel}>
                                Disponível em
                            </Typography>
                            <div className={classes.providerList}>
                                {movie.watch_providers.map((provider) => (
                                    <a
                                        key={provider.provider_id}
                                        className={classes.providerPill}
                                        href={movie.watch_link || undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ borderLeft: '3px solid ' + (provider.color || '#D4A574') }}
                                    >
                                        {provider.provider_name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className={classes.resultActions}>
                        {movie.imdb_id ? (
                            <Button
                                className={classes.imdbButton}
                                variant="contained"
                                href={'https://www.imdb.com/title/' + movie.imdb_id}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ver no IMDb
                            </Button>
                        ) : null}
                        {movie.homepage ? (
                            <Button
                                className={classes.homeButton}
                                variant="outlined"
                                href={movie.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Site oficial
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    const classes = useStyles();

    return (
        <Container maxWidth="sm">
            <Typography className={classes.footerText}>
                Feito por{' '}
                <a href="https://github.com/ValdirNp" target="_blank" rel="noopener noreferrer" title="Valdir Pereira">
                    Valdir Pereira
                </a>{' '}
                com React e dados de{' '}
                <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" title="The Movie Database">
                    The Movie Database
                </a>
                . Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.
            </Typography>
        </Container>
    );
}

function getRandomNumber(bottom, top) {
    return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
}

function App() {
    const classes = useStyles();
    const initialFilters = React.useMemo(() => readFiltersFromUrl(window.location.search), []);
    const [suggestedMovie, updateSuggestedMovie] = React.useState(null);
    const [mediaType, setMediaType] = React.useState(initialFilters.mediaType);
    const [selectedGenres, selectGenre] = React.useState(initialFilters.selectedGenres);
    const [excludedGenres, setExcludedGenres] = React.useState(initialFilters.excludedGenres);
    const [moodKeywords, setMoodKeywords] = React.useState(initialFilters.moodKeywords);
    const [minRating, setMinRating] = React.useState(initialFilters.minRating);
    const [runtimePreset, setRuntimePreset] = React.useState(initialFilters.runtimePreset);
    const [tvStatus, setTvStatus] = React.useState(initialFilters.tvStatus);
    const [years, setYears] = React.useState(initialFilters.years);
    const [originalLanguage, setOriginalLanguage] = React.useState(initialFilters.originalLanguage);
    const [originCountry, setOriginCountry] = React.useState(initialFilters.originCountry);
    const [selectedProviders, setProviders] = React.useState(initialFilters.selectedProviders);
    // The panel starts open when the link already carries advanced filters.
    const [advancedOpen, setAdvancedOpen] = React.useState(
        () => describeAdvancedFilters(initialFilters).length > 0
    );
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const filters = {
        mediaType: mediaType,
        selectedGenres: selectedGenres,
        excludedGenres: excludedGenres,
        moodKeywords: moodKeywords,
        minRating: minRating,
        runtimePreset: runtimePreset,
        tvStatus: tvStatus,
        years: years,
        originalLanguage: originalLanguage,
        originCountry: originCountry,
        selectedProviders: selectedProviders,
    };
    const filtersKey = filtersToSearch(filters, '');

    React.useEffect(() => {
        const nextSearch = filtersToSearch(filters, window.location.search);
        if (nextSearch !== window.location.search) {
            window.history.replaceState(null, '', window.location.pathname + nextSearch);
        }
    }, [filtersKey]);

    const clearAdvancedFilter = function (key) {
        switch (key) {
            case 'sem': setExcludedGenres([]); break;
            case 'clima': setMoodKeywords([]); break;
            case 'nota': setMinRating(''); break;
            case 'duracao': setRuntimePreset(''); break;
            case 'status': setTvStatus(''); break;
            case 'periodo': setYears(DEFAULT_YEARS); break;
            case 'idioma': setOriginalLanguage(''); break;
            case 'pais': setOriginCountry(''); break;
            default: break;
        }
    };

    const activeAdvancedFilters = describeAdvancedFilters(filters).map((item) => Object.assign({}, item, {
        clear: () => clearAdvancedFilter(item.key),
    }));

    const clearAdvancedFilters = function () {
        activeAdvancedFilters.forEach((item) => clearAdvancedFilter(item.key));
    };

    const getTitleDetails = function (type, id, requestedOriginCountry) {
        return fetch(titleDetailsUrl(type, id))
            .then((res) => res.json())
            .then((result) => {
                const newSuggestedMovie = normalizeTitleDetails(result, type, requestedOriginCountry);

                updateSuggestedMovie(newSuggestedMovie);
                setLoading(false);
            });
    };

    const trySuggestionFromPage = function (type, listOfTitles, requestedOriginCountry, isTv, attemptIndex) {
        const itemSelected = pickRandomTitle(listOfTitles, requestedOriginCountry, isTv);

        if (!itemSelected) {
            return Promise.reject(new Error(emptyMessageForType(isTv)));
        }

        const remainingTitles = listOfTitles.filter((item) => item.id !== itemSelected.id);

        return getTitleDetails(type, itemSelected.id, requestedOriginCountry).catch((err) => {
            if (err.code === 'COUNTRY_MISMATCH' && attemptIndex < 4 && remainingTitles.length > 0) {
                return trySuggestionFromPage(
                    type,
                    remainingTitles,
                    requestedOriginCountry,
                    isTv,
                    attemptIndex + 1
                );
            }

            throw err;
        });
    };

    const emptyMessageForType = function (isTv) {
        return isTv
            ? 'Nenhuma série encontrada com esses filtros. Tente relaxar nota, clima, status ou streaming.'
            : 'Nenhum filme encontrado com esses filtros. Tente relaxar nota, duração, clima ou streaming.';
    };

    const getSuggestion = function () {
        setLoading(true);
        setError('');

        const type = mediaType || (Math.random() < 0.5 ? 'movie' : 'tv');
        const isTv = type === 'tv';
        const emptyMessage = emptyMessageForType(isTv);

        const params = buildDiscoverParams(type, {
            selectedGenres: selectedGenres,
            excludedGenres: excludedGenres,
            moodKeywords: moodKeywords,
            minRating: minRating,
            runtimePreset: runtimePreset,
            tvStatus: tvStatus,
            years: years,
            originalLanguage: originalLanguage,
            originCountry: originCountry,
            selectedProviders: selectedProviders,
        });

        const firstUrl = discoverUrl(type, params);

        fetch(firstUrl)
            .then((res) => res.json())
            .then((firstPage) => {
                if (!firstPage.results || firstPage.results.length === 0) {
                    throw new Error(emptyMessage);
                }

                const totalPages = Math.min(firstPage.total_pages || 1, 20);
                const page = getRandomNumber(1, totalPages);
                params.page = page;

                const pageUrl = discoverUrl(type, params);
                return fetch(pageUrl).then((res) => res.json());
            })
            .then((result) => {
                const listOfTitles = result.results || [];
                if (listOfTitles.length === 0) {
                    throw new Error(emptyMessage);
                }

                return trySuggestionFromPage(type, listOfTitles, originCountry, isTv, 0);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                updateSuggestedMovie(null);
                setError(err.message || 'Algo deu errado ao buscar a sugestão.');
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <CssBaseline />
                <div className={classes.beam} aria-hidden="true" />
                <Container component="main" className={classes.main} maxWidth="md">
                    <Title />
                    <Filters
                        mediaType={mediaType}
                        setMediaType={setMediaType}
                        selectedGenres={selectedGenres}
                        selectGenre={selectGenre}
                        excludedGenres={excludedGenres}
                        setExcludedGenres={setExcludedGenres}
                        moodKeywords={moodKeywords}
                        setMoodKeywords={setMoodKeywords}
                        minRating={minRating}
                        setMinRating={setMinRating}
                        runtimePreset={runtimePreset}
                        setRuntimePreset={setRuntimePreset}
                        tvStatus={tvStatus}
                        setTvStatus={setTvStatus}
                        years={years}
                        setYears={setYears}
                        originalLanguage={originalLanguage}
                        setOriginalLanguage={setOriginalLanguage}
                        originCountry={originCountry}
                        setOriginCountry={setOriginCountry}
                        selectedProviders={selectedProviders}
                        setProviders={setProviders}
                        advancedOpen={advancedOpen}
                        setAdvancedOpen={setAdvancedOpen}
                        activeAdvancedFilters={activeAdvancedFilters}
                        clearAdvancedFilters={clearAdvancedFilters}
                    />
                    <SuggestionButton
                        getSuggestion={getSuggestion}
                        loading={loading}
                        mediaType={mediaType}
                        hasResult={Boolean(suggestedMovie && suggestedMovie.title)}
                        hasProviders={selectedProviders.length > 0}
                    />
                    {error ? (
                        <Typography className={classes.errorText} role="alert">
                            {error}
                        </Typography>
                    ) : null}
                </Container>
                <Container maxWidth="lg">
                    <SuggestionResult movie={suggestedMovie} loading={loading} />
                </Container>
                <footer className={classes.footer}>
                    <Footer />
                </footer>
            </div>
        </ThemeProvider>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);

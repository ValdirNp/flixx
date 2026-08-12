const {
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

const CURRENT_YEAR = new Date().getFullYear();
const WATCH_REGION = 'BR';

const MEDIA_TYPES = [
    { id: '', name: 'Filme ou série' },
    { id: 'movie', name: 'Filme' },
    { id: 'tv', name: 'Série' },
];

const MOVIE_GENRES = [
    { id: 28, name: 'Ação' },
    { id: 12, name: 'Aventura' },
    { id: 16, name: 'Animação' },
    { id: 35, name: 'Comédia' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentário' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Família' },
    { id: 14, name: 'Fantasia' },
    { id: 36, name: 'História' },
    { id: 27, name: 'Terror' },
    { id: 10402, name: 'Música' },
    { id: 9648, name: 'Mistério' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Ficção científica' },
    { id: 10770, name: 'Cinema TV' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'Guerra' },
    { id: 37, name: 'Faroeste' },
];

const TV_GENRES = [
    { id: 10759, name: 'Ação e aventura' },
    { id: 16, name: 'Animação' },
    { id: 35, name: 'Comédia' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentário' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Família' },
    { id: 10762, name: 'Kids' },
    { id: 9648, name: 'Mistério' },
    { id: 10763, name: 'News' },
    { id: 10764, name: 'Reality' },
    { id: 10765, name: 'Sci-Fi e Fantasy' },
    { id: 10766, name: 'Soap' },
    { id: 10767, name: 'Talk' },
    { id: 10768, name: 'Guerra e política' },
    { id: 37, name: 'Faroeste' },
];

const STREAMING_PROVIDERS = [
    { id: 8, name: 'Netflix', color: '#E50914' },
    { id: 119, name: 'Prime Video', color: '#00A8E1' },
    { id: 337, name: 'Disney+', color: '#113CCF' },
    { id: 384, name: 'HBO Max', color: '#002BE7' },
    { id: 350, name: 'Apple TV+', color: '#555555' },
    { id: 307, name: 'Globoplay', color: '#FB0234' },
    { id: 531, name: 'Paramount+', color: '#0064FF' },
];

const ORIGINAL_LANGUAGES = [
    { id: 'pt', name: 'Português' },
    { id: 'en', name: 'Inglês' },
    { id: 'es', name: 'Espanhol' },
    { id: 'fr', name: 'Francês' },
    { id: 'de', name: 'Alemão' },
    { id: 'it', name: 'Italiano' },
    { id: 'ja', name: 'Japonês' },
    { id: 'ko', name: 'Coreano' },
    { id: 'zh', name: 'Chinês' },
    { id: 'hi', name: 'Hindi' },
    { id: 'ar', name: 'Árabe' },
    { id: 'ru', name: 'Russo' },
    { id: 'tr', name: 'Turco' },
    { id: 'th', name: 'Tailandês' },
    { id: 'sv', name: 'Sueco' },
    { id: 'da', name: 'Dinamarquês' },
    { id: 'no', name: 'Norueguês' },
    { id: 'fi', name: 'Finlandês' },
    { id: 'nl', name: 'Holandês' },
    { id: 'pl', name: 'Polonês' },
    { id: 'cs', name: 'Tcheco' },
    { id: 'hu', name: 'Húngaro' },
    { id: 'ro', name: 'Romeno' },
    { id: 'uk', name: 'Ucraniano' },
    { id: 'el', name: 'Grego' },
    { id: 'he', name: 'Hebraico' },
    { id: 'fa', name: 'Persa' },
    { id: 'id', name: 'Indonésio' },
    { id: 'vi', name: 'Vietnamita' },
    { id: 'tl', name: 'Filipino' },
];

const ORIGIN_COUNTRIES = [
    { id: 'BR', name: 'Brasil' },
    { id: 'US', name: 'Estados Unidos' },
    { id: 'GB', name: 'Reino Unido' },
    { id: 'CA', name: 'Canadá' },
    { id: 'AU', name: 'Austrália' },
    { id: 'MX', name: 'México' },
    { id: 'AR', name: 'Argentina' },
    { id: 'CL', name: 'Chile' },
    { id: 'CO', name: 'Colômbia' },
    { id: 'PT', name: 'Portugal' },
    { id: 'ES', name: 'Espanha' },
    { id: 'FR', name: 'França' },
    { id: 'DE', name: 'Alemanha' },
    { id: 'IT', name: 'Itália' },
    { id: 'BE', name: 'Bélgica' },
    { id: 'NL', name: 'Países Baixos' },
    { id: 'SE', name: 'Suécia' },
    { id: 'NO', name: 'Noruega' },
    { id: 'DK', name: 'Dinamarca' },
    { id: 'FI', name: 'Finlândia' },
    { id: 'IE', name: 'Irlanda' },
    { id: 'CH', name: 'Suíça' },
    { id: 'AT', name: 'Áustria' },
    { id: 'PL', name: 'Polônia' },
    { id: 'CZ', name: 'Tchequia' },
    { id: 'HU', name: 'Hungria' },
    { id: 'RO', name: 'Romênia' },
    { id: 'UA', name: 'Ucrânia' },
    { id: 'RU', name: 'Rússia' },
    { id: 'TR', name: 'Turquia' },
    { id: 'GR', name: 'Grécia' },
    { id: 'IL', name: 'Israel' },
    { id: 'EG', name: 'Egito' },
    { id: 'ZA', name: 'África do Sul' },
    { id: 'IN', name: 'Índia' },
    { id: 'JP', name: 'Japão' },
    { id: 'KR', name: 'Coreia do Sul' },
    { id: 'CN', name: 'China' },
    { id: 'HK', name: 'Hong Kong' },
    { id: 'TW', name: 'Taiwan' },
    { id: 'TH', name: 'Tailândia' },
    { id: 'ID', name: 'Indonésia' },
    { id: 'PH', name: 'Filipinas' },
    { id: 'VN', name: 'Vietnã' },
    { id: 'NZ', name: 'Nova Zelândia' },
];

function getLanguageName(code) {
    const match = ORIGINAL_LANGUAGES.find((item) => item.id === code);
    return match ? match.name : code;
}

function getCountryName(code) {
    const match = ORIGIN_COUNTRIES.find((item) => item.id === code);
    return match ? match.name : code;
}

function getOriginCountryCodes(result) {
    if (result.origin_country && result.origin_country.length) {
        return result.origin_country;
    }

    return (result.production_countries || []).map((country) => country.iso_3166_1);
}

function formatOriginCountryLabel(codes, preferredCode) {
    if (!codes || !codes.length) {
        return null;
    }

    const uniqueCodes = codes.filter((code, index) => codes.indexOf(code) === index);
    const orderedCodes = preferredCode && uniqueCodes.includes(preferredCode)
        ? [preferredCode].concat(uniqueCodes.filter((code) => code !== preferredCode))
        : uniqueCodes;

    return orderedCodes.map(getCountryName).join(', ');
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

const MOVIE_SORT_OPTIONS = [
    'popularity.desc',
    'popularity.asc',
    'release_date.desc',
    'release_date.asc',
    'vote_average.desc',
    'vote_average.asc',
    'vote_count.desc',
    'primary_release_date.desc',
    'primary_release_date.asc',
];

const TV_SORT_OPTIONS = [
    'popularity.desc',
    'popularity.asc',
    'first_air_date.desc',
    'first_air_date.asc',
    'vote_average.desc',
    'vote_average.asc',
    'vote_count.desc',
];

function getGenresForMediaType(mediaType) {
    if (mediaType === 'tv') {
        return TV_GENRES;
    }
    if (mediaType === 'movie') {
        return MOVIE_GENRES;
    }
    return MOVIE_GENRES.concat(
        TV_GENRES.filter((genre) => !MOVIE_GENRES.some((movieGenre) => movieGenre.id === genre.id))
    );
}

function filterGenresForMediaType(selectedGenres, mediaType) {
    const allowedIds = (mediaType === 'tv' ? TV_GENRES : MOVIE_GENRES).map((genre) => genre.id);
    return selectedGenres.filter((id) => allowedIds.includes(id));
}

const theme = createMuiTheme({
    typography: {
        fontFamily: '"Figtree", "Helvetica", "Arial", sans-serif',
        h1: {
            fontFamily: '"Bebas Neue", "Impact", sans-serif',
            letterSpacing: '0.04em',
        },
        h2: {
            fontFamily: '"Bebas Neue", "Impact", sans-serif',
            letterSpacing: '0.04em',
        },
        h3: {
            fontFamily: '"Bebas Neue", "Impact", sans-serif',
            letterSpacing: '0.03em',
        },
        h5: {
            fontFamily: '"Bebas Neue", "Impact", sans-serif',
            letterSpacing: '0.03em',
        },
        button: {
            fontFamily: '"Figtree", "Helvetica", "Arial", sans-serif',
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    palette: {
        type: 'dark',
        primary: {
            main: '#E50914',
        },
        secondary: {
            main: '#D4A574',
        },
        background: {
            default: '#0E0D0C',
            paper: '#1A1816',
        },
        text: {
            primary: '#F5F0E8',
            secondary: '#9A9288',
        },
        error: {
            main: '#E50914',
        },
    },
    shape: {
        borderRadius: 6,
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
                Escolha filme ou série, gênero, idioma, país, ano e streaming — a gente sorteia o que assistir.
            </Typography>
        </Box>
    );
}

function Filters(props) {
    const classes = useStyles();
    const genres = getGenresForMediaType(props.mediaType);

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
        props.selectGenre(event.target.value);
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

    const setMediaType = (mediaTypeId) => {
        props.setMediaType(mediaTypeId);
        const allowedIds = getGenresForMediaType(mediaTypeId).map((genre) => genre.id);
        props.selectGenre(props.selectedGenres.filter((id) => allowedIds.includes(id)));
    };

    const toggleProvider = (providerId) => {
        const current = props.selectedProviders;
        if (current.includes(providerId)) {
            props.setProviders(current.filter((id) => id !== providerId));
        } else {
            props.setProviders(current.concat(providerId));
        }
    };

    const selectedGenreNames = genres
        .filter((genre) => props.selectedGenres.includes(genre.id))
        .map((genre) => genre.name)
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
            {!props.hasResult && !props.loading && (
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

function getProviderMeta(providerId) {
    return STREAMING_PROVIDERS.find((item) => item.id === providerId);
}

function normalizeWatchProviders(providersPayload) {
    if (!providersPayload || !providersPayload.results || !providersPayload.results[WATCH_REGION]) {
        return { providers: [], link: null };
    }

    const region = providersPayload.results[WATCH_REGION];
    const flatrate = region.flatrate || [];
    const knownIds = STREAMING_PROVIDERS.map((item) => item.id);

    const providers = flatrate
        .filter((item) => knownIds.includes(item.provider_id))
        .map((item) => {
            const meta = getProviderMeta(item.provider_id);
            return {
                provider_id: item.provider_id,
                provider_name: meta ? meta.name : item.provider_name,
                color: meta ? meta.color : '#D4A574',
            };
        });

    return {
        providers: providers,
        link: region.link || null,
    };
}

function App() {
    const classes = useStyles();
    const [suggestedMovie, updateSuggestedMovie] = React.useState(null);
    const [mediaType, setMediaType] = React.useState('');
    const [selectedGenres, selectGenre] = React.useState([]);
    const [years, setYears] = React.useState([1990, CURRENT_YEAR]);
    const [originalLanguage, setOriginalLanguage] = React.useState('');
    const [originCountry, setOriginCountry] = React.useState('');
    const [selectedProviders, setProviders] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const getTitleDetails = function (type, id, requestedOriginCountry) {
        const params = {
            language: 'pt-BR',
            append_to_response: type === 'tv' ? 'watch/providers,external_ids' : 'watch/providers',
        };

        const detailsUrl = '/api/tmdb/' + type + '/' + id + '?' + new URLSearchParams(params).toString();

        return fetch(detailsUrl)
            .then((res) => res.json())
            .then((result) => {
                if (result.status_code) {
                    throw new Error(result.status_message || 'Não foi possível carregar o título.');
                }

                const watchInfo = normalizeWatchProviders(result['watch/providers']);
                const isTv = type === 'tv';
                const title = isTv ? result.name : result.title;
                const originalTitle = isTv ? result.original_name : result.original_title;
                const dateField = isTv ? result.first_air_date : result.release_date;
                const imdbId = isTv
                    ? (result.external_ids && result.external_ids.imdb_id) || null
                    : result.imdb_id || null;
                const originCountryCodes = getOriginCountryCodes(result);

                if (requestedOriginCountry && !originCountryCodes.includes(requestedOriginCountry)) {
                    const mismatchError = new Error('COUNTRY_MISMATCH');
                    mismatchError.code = 'COUNTRY_MISMATCH';
                    throw mismatchError;
                }

                const newSuggestedMovie = Object.assign({}, result, {
                    title: title,
                    original_title: originalTitle,
                    media_type: type,
                    media_label: isTv ? 'Série' : 'Filme',
                    release_year: dateField ? dateField.split('-', 1)[0] : '—',
                    number_of_seasons: isTv ? result.number_of_seasons || null : null,
                    genres: (result.genres || []).map((elem) => elem.name).join(', '),
                    original_language_label: result.original_language
                        ? getLanguageName(result.original_language)
                        : null,
                    origin_country_label: formatOriginCountryLabel(
                        originCountryCodes,
                        requestedOriginCountry
                    ),
                    poster: result.poster_path
                        ? 'https://image.tmdb.org/t/p/w500/' + result.poster_path
                        : 'https://placehold.co/500x750/1A1816/9A9288?text=Sem+imagem',
                    watch_providers: watchInfo.providers,
                    watch_link: watchInfo.link,
                    imdb_id: imdbId,
                });

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
            ? 'Nenhuma série encontrada com esses filtros. Tente ampliar o período ou mudar idioma, país ou streaming.'
            : 'Nenhum filme encontrado com esses filtros. Tente ampliar o período ou mudar idioma, país ou streaming.';
    };

    const getSuggestion = function () {
        setLoading(true);
        setError('');

        const type = mediaType || (Math.random() < 0.5 ? 'movie' : 'tv');
        const isTv = type === 'tv';
        const discoverUrl = '/api/tmdb/discover/' + type;
        const sortOptions = isTv ? TV_SORT_OPTIONS : MOVIE_SORT_OPTIONS;
        const genresForQuery = filterGenresForMediaType(selectedGenres, type);
        const emptyMessage = emptyMessageForType(isTv);

        let minYear = 1900;
        let maxYear = CURRENT_YEAR;

        if (years.length === 2) {
            minYear = years[0];
            maxYear = years[1];
        }

        const params = {
            language: 'pt-BR',
            sort_by: sortOptions[Math.floor(Math.random() * sortOptions.length)],
            include_adult: false,
            page: 1,
            'vote_count.gte': 20,
        };

        if (!isTv) {
            params.include_video = false;
            params['primary_release_date.gte'] = minYear + '-01-01';
            params['primary_release_date.lte'] = maxYear + '-12-31';
        } else {
            params['first_air_date.gte'] = minYear + '-01-01';
            params['first_air_date.lte'] = maxYear + '-12-31';
        }

        if (genresForQuery.length > 0) {
            params.with_genres = genresForQuery.join(',');
        }

        if (originalLanguage) {
            params.with_original_language = originalLanguage;
        }

        if (originCountry) {
            params.with_origin_country = originCountry;
        }

        if (selectedProviders.length > 0) {
            params.with_watch_providers = selectedProviders.join('|');
            params.watch_region = WATCH_REGION;
            params.with_watch_monetization_types = 'flatrate';
        }

        const firstUrl = discoverUrl + '?' + new URLSearchParams(params).toString();

        fetch(firstUrl)
            .then((res) => res.json())
            .then((firstPage) => {
                if (!firstPage.results || firstPage.results.length === 0) {
                    throw new Error(emptyMessage);
                }

                const totalPages = Math.min(firstPage.total_pages || 1, 20);
                const page = getRandomNumber(1, totalPages);
                params.page = page;

                const pageUrl = discoverUrl + '?' + new URLSearchParams(params).toString();
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
                        years={years}
                        setYears={setYears}
                        originalLanguage={originalLanguage}
                        setOriginalLanguage={setOriginalLanguage}
                        originCountry={originCountry}
                        setOriginCountry={setOriginCountry}
                        selectedProviders={selectedProviders}
                        setProviders={setProviders}
                    />
                    <SuggestionButton
                        getSuggestion={getSuggestion}
                        loading={loading}
                        mediaType={mediaType}
                        hasResult={Boolean(suggestedMovie && suggestedMovie.title)}
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

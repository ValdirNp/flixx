/**
 * TMDB catalog + query/normalization logic shared by the main page and the /card route.
 */
export const CURRENT_YEAR = new Date().getFullYear();
export const WATCH_REGION = 'BR';
export const TMDB_PROXY = '/api/tmdb/';

export const MOVIE_GENRES = [
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

export const TV_GENRES = [
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

export const STREAMING_PROVIDERS = [
    { id: 8, name: 'Netflix', color: '#E50914' },
    { id: 119, name: 'Prime Video', color: '#00A8E1' },
    { id: 337, name: 'Disney+', color: '#113CCF' },
    { id: 384, name: 'HBO Max', color: '#002BE7' },
    { id: 350, name: 'Apple TV+', color: '#555555' },
    { id: 307, name: 'Globoplay', color: '#FB0234' },
    { id: 531, name: 'Paramount+', color: '#0064FF' },
];

export const ORIGINAL_LANGUAGES = [
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

export const ORIGIN_COUNTRIES = [
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

export const RUNTIME_PRESETS = [
    { id: '', name: 'Qualquer duração', min: null, max: null },
    { id: 'short', name: 'Até 90 min', min: null, max: 90 },
    { id: 'medium', name: '90–120 min', min: 90, max: 120 },
    { id: 'long', name: '120–150 min', min: 120, max: 150 },
    { id: 'epic', name: 'Mais de 150 min', min: 150, max: null },
];

export const MOVIE_SORT_OPTIONS = [
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

export const TV_SORT_OPTIONS = [
    'popularity.desc',
    'popularity.asc',
    'first_air_date.desc',
    'first_air_date.asc',
    'vote_average.desc',
    'vote_average.asc',
    'vote_count.desc',
];

export function getLanguageName(code) {
    const match = ORIGINAL_LANGUAGES.find((item) => item.id === code);
    return match ? match.name : code;
}

export function getCountryName(code) {
    const match = ORIGIN_COUNTRIES.find((item) => item.id === code);
    return match ? match.name : code;
}

export function getRuntimePreset(value) {
    return RUNTIME_PRESETS.find((item) => item.id === value) || RUNTIME_PRESETS[0];
}

export function getOriginCountryCodes(result) {
    if (result.origin_country && result.origin_country.length) {
        return result.origin_country;
    }

    return (result.production_countries || []).map((country) => country.iso_3166_1);
}

export function formatOriginCountryLabel(codes, preferredCode) {
    if (!codes || !codes.length) {
        return null;
    }

    const uniqueCodes = codes.filter((code, index) => codes.indexOf(code) === index);
    const orderedCodes = preferredCode && uniqueCodes.includes(preferredCode)
        ? [preferredCode].concat(uniqueCodes.filter((code) => code !== preferredCode))
        : uniqueCodes;

    return orderedCodes.map(getCountryName).join(', ');
}

export function getGenresForMediaType(mediaType) {
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

export function filterGenresForMediaType(selectedGenres, mediaType) {
    const allowedIds = (mediaType === 'tv' ? TV_GENRES : MOVIE_GENRES).map((genre) => genre.id);
    return selectedGenres.filter((id) => allowedIds.includes(id));
}

export function getProviderMeta(providerId) {
    return STREAMING_PROVIDERS.find((item) => item.id === providerId);
}

export function normalizeWatchProviders(providersPayload) {
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

/**
 * Builds the /discover query from the page filters.
 * `random` lets callers inject a seeded PRNG (defaults to Math.random); `filters.sortBy`
 * pins the sort order, `filters.minVotes` overrides the minimum vote count and
 * `filters.onlyStreaming` keeps only titles on some subscription streaming in WATCH_REGION.
 */
export function buildDiscoverParams(type, filters, random) {
    const rand = random || Math.random;
    const isTv = type === 'tv';
    const sortOptions = isTv ? TV_SORT_OPTIONS : MOVIE_SORT_OPTIONS;
    const genresForQuery = filterGenresForMediaType(filters.selectedGenres || [], type);
    const excludedForQuery = filterGenresForMediaType(filters.excludedGenres || [], type);
    const moodKeywords = filters.moodKeywords || [];
    const selectedProviders = filters.selectedProviders || [];
    const years = filters.years || [];

    let minYear = 1900;
    let maxYear = CURRENT_YEAR;

    if (years.length === 2) {
        minYear = years[0];
        maxYear = years[1];
    }

    const params = {
        language: 'pt-BR',
        sort_by: filters.sortBy || sortOptions[Math.floor(rand() * sortOptions.length)],
        include_adult: false,
        page: 1,
        'vote_count.gte': filters.minVotes || 20,
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

    if (excludedForQuery.length > 0) {
        params.without_genres = excludedForQuery.join(',');
    }

    if (moodKeywords.length > 0) {
        params.with_keywords = moodKeywords.join('|');
    }

    if (filters.minRating) {
        params['vote_average.gte'] = filters.minRating;
    }

    if (!isTv && filters.runtimePreset) {
        const runtime = getRuntimePreset(filters.runtimePreset);
        if (runtime.min !== null) {
            params['with_runtime.gte'] = runtime.min;
        }
        if (runtime.max !== null) {
            params['with_runtime.lte'] = runtime.max;
        }
    }

    if (isTv && filters.tvStatus) {
        params.with_status = filters.tvStatus;
    }

    if (filters.originalLanguage) {
        params.with_original_language = filters.originalLanguage;
    }

    if (filters.originCountry) {
        params.with_origin_country = filters.originCountry;
    }

    if (selectedProviders.length > 0) {
        params.with_watch_providers = selectedProviders.join('|');
        params.watch_region = WATCH_REGION;
        params.with_watch_monetization_types = 'flatrate';
    } else if (filters.onlyStreaming) {
        params.watch_region = WATCH_REGION;
        params.with_watch_monetization_types = 'flatrate';
    }

    return params;
}

export function discoverUrl(type, params) {
    return TMDB_PROXY + 'discover/' + type + '?' + new URLSearchParams(params).toString();
}

export function titleDetailsUrl(type, id) {
    const params = {
        language: 'pt-BR',
        append_to_response: type === 'tv' ? 'watch/providers,external_ids' : 'watch/providers',
    };

    return TMDB_PROXY + type + '/' + id + '?' + new URLSearchParams(params).toString();
}

/**
 * Turns a raw TMDB details payload into the shape rendered by the result view.
 * Throws an error with code COUNTRY_MISMATCH when the title doesn't match the requested country.
 */
export function normalizeTitleDetails(result, type, requestedOriginCountry) {
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

    return Object.assign({}, result, {
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
}

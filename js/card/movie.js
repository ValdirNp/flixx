/**
 * Resolves a plan slot (or an explicit TMDB id) into a normalized movie, reusing the
 * site's discover params and details normalization.
 */
import {
    WATCH_REGION,
    buildDiscoverParams,
    discoverUrl,
    titleDetailsUrl,
    normalizeTitleDetails,
} from '../shared/tmdb';
import { CARD_FILTERS } from './daily';

function getJson(url) {
    return fetch(url).then((res) => res.json());
}

/** All subscription providers in BR (the site keeps only its known list; the caption wants every one). */
function allFlatrateProviders(result) {
    const payload = result['watch/providers'];
    const region = payload && payload.results && payload.results[WATCH_REGION];
    return ((region && region.flatrate) || []).map((item) => item.provider_name);
}

export function fetchMovieById(id) {
    return getJson(titleDetailsUrl('movie', id)).then((result) => {
        const movie = normalizeTitleDetails(result, 'movie', '');
        movie.all_providers = allFlatrateProviders(result);
        return movie;
    });
}

function discoverPage(year, page) {
    const params = buildDiscoverParams(CARD_FILTERS.mediaType, {
        years: [year, year],
        minRating: CARD_FILTERS.minRating,
        minVotes: CARD_FILTERS.minVotes,
        sortBy: CARD_FILTERS.sortBy,
        onlyStreaming: CARD_FILTERS.onlyStreaming,
    });
    params.page = page;
    return getJson(discoverUrl(CARD_FILTERS.mediaType, params));
}

export function resolveMovieIdForSlot(slot) {
    return discoverPage(slot.year, slot.page)
        .then((result) => {
            const list = result.results || [];
            if (list.length || slot.page === 1) {
                return list;
            }
            return discoverPage(slot.year, 1).then((first) => first.results || []);
        })
        .then((list) => {
            if (!list.length) {
                throw new Error('Nenhum filme encontrado para ' + slot.year + '.');
            }
            return list[slot.index % list.length].id;
        });
}

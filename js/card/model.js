/**
 * URL params → card request → resolved card model.
 *
 *   ?date=YYYY-MM-DD   day to render (default: today in America/Sao_Paulo)
 *   ?seed=<text>       free seed ("Sortear outro"); ignores the daily schedule
 *   ?movie=<tmdb id>   forces the movie (layout/theme still come from the plan)
 *   ?layout=<id>       forces a layout       (see layouts/index.js)
 *   ?theme=<id>        forces a background   (blur | gradient | solid | beam)
 *   ?accent=<id>       forces the accent     (poster | brand)
 *   ?rating= ?chips= ?logo=   force the detail axes (see variation.js)
 *   display options (hide, text, txt, fit, px, py): see display.js
 *   ?gallery=1|random|matrix|stress  review grids (see Gallery.js); &n= count, &cols= columns
 */
import { todayKey, isValidDateKey } from './date';
import { planForDate, planForSeed, CARD_FILTERS, SLOT_PAGES, SLOT_PAGE_SIZE } from './daily';
import { hashString } from './prng';
import { applyOverrides } from './variation';
import { fetchMovieById, resolveMovieIdForSlot } from './movie';
import { loadPosterAssets } from './poster';
import { readDisplay, DEFAULT_DISPLAY } from './display';

/** Keyed by the pool definition, so changing the card filters drops the stale daily picks. */
const DAILY_CACHE_PREFIX = 'flixx-card:'
    + hashString(JSON.stringify([CARD_FILTERS, SLOT_PAGES, SLOT_PAGE_SIZE])).toString(36) + ':';

export function readRequest(search) {
    const params = new URLSearchParams(search);
    const date = params.get('date');
    const movie = params.get('movie');
    return {
        dateKey: isValidDateKey(date) ? date : todayKey(),
        seed: params.get('seed') || null,
        movieId: movie && /^\d+$/.test(movie) ? movie : null,
        overrides: {
            layout: params.get('layout'),
            theme: params.get('theme'),
            accent: params.get('accent'),
            rating: params.get('rating'),
            chips: params.get('chips'),
            logo: params.get('logo'),
        },
        display: readDisplay(params),
        gallery: params.get('gallery'),
        count: Number(params.get('n')) || 0,
        cols: Math.min(Number(params.get('cols')) || 0, 8),
    };
}

export function planForRequest(request) {
    return request.seed
        ? planForSeed(request.seed, request.dateKey)
        : planForDate(request.dateKey);
}

function readDailyCache(dateKey) {
    try {
        return window.localStorage.getItem(DAILY_CACHE_PREFIX + dateKey);
    } catch (err) {
        return null;
    }
}

function writeDailyCache(dateKey, movieId) {
    try {
        window.localStorage.setItem(DAILY_CACHE_PREFIX + dateKey, String(movieId));
    } catch (err) {
        // Storage unavailable (private mode): the deterministic pick still applies.
    }
}

/**
 * The daily pick is deterministic; the per-device cache only shields it from TMDB
 * reordering the discover results during the day.
 */
function resolveMovieId(request, plan) {
    if (request.movieId) {
        return Promise.resolve(request.movieId);
    }
    const isDaily = !request.seed;
    const cached = isDaily ? readDailyCache(request.dateKey) : null;
    if (cached) {
        return Promise.resolve(cached);
    }
    return resolveMovieIdForSlot(plan.slot).then((id) => {
        if (isDaily) {
            writeDailyCache(request.dateKey, id);
        }
        return id;
    });
}

export function resolveCardModel(request) {
    const plan = planForRequest(request);
    return resolveMovieId(request, plan)
        .then(fetchMovieById)
        .then((movie) => loadPosterAssets(movie.poster_path).then((assets) => ({
            plan: plan,
            seed: plan.seed,
            dateKey: request.dateKey,
            movie: movie,
            assets: assets,
            variation: applyOverrides(plan.variation, request.overrides || {}),
            display: request.display || DEFAULT_DISPLAY,
        })));
}

export function buildSearch(params) {
    const search = new URLSearchParams();
    Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
            search.set(key, params[key]);
        }
    });
    const value = search.toString();
    return value ? '?' + value : '';
}

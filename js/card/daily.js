/**
 * Deterministic daily plan. A day's movie is a "slot" (release year, page, index) in a
 * stable TMDB discover query, so repetition can be avoided arithmetically: the schedule is
 * replayed day by day from EPOCH, keeping the last NO_REPEAT_DAYS slots and the previous
 * layout — no backend, no extra requests.
 */
import { addDays, daysBetween, yearOf } from './date';
import { rngFor, randomInt } from './prng';
import { chooseVariation } from './variation';

export const EPOCH = '2026-01-01';
export const NO_REPEAT_DAYS = 30;

/** Discover filters for the card (reuses the site's filter model). */
export const CARD_FILTERS = {
    mediaType: 'movie',
    minRating: '6.5',
    minVotes: 300,
    sortBy: 'vote_count.desc',
    minYear: 1980,
};

export const SLOT_PAGES = 2;
export const SLOT_PAGE_SIZE = 20;

export function seedForDate(dateKey) {
    return 'flixx:' + dateKey;
}

function slotKey(slot) {
    return slot.year + '-' + slot.page + '-' + slot.index;
}

/** Latest eligible year is the one before the card date, so the pool is closed and stable. */
function drawSlot(rng, dateKey) {
    return {
        year: randomInt(rng, CARD_FILTERS.minYear, yearOf(dateKey) - 1),
        page: randomInt(rng, 1, SLOT_PAGES),
        index: randomInt(rng, 0, SLOT_PAGE_SIZE - 1),
    };
}

function drawUniqueSlot(seed, dateKey, recentKeys) {
    const rng = rngFor(seed, 'movie');
    let slot = drawSlot(rng, dateKey);
    for (let attempt = 0; attempt < 50 && recentKeys.includes(slotKey(slot)); attempt++) {
        slot = drawSlot(rng, dateKey);
    }
    return slot;
}

/** Plan for an arbitrary seed ("Sortear outro" / ?seed=): no history constraints. */
export function planForSeed(seed, dateKey) {
    return {
        seed: seed,
        dateKey: dateKey,
        slot: drawUniqueSlot(seed, dateKey, []),
        variation: chooseVariation(seed, null),
    };
}

/** Plan for a calendar day, honoring the no-repeat rules against the previous days. */
export function planForDate(dateKey) {
    if (daysBetween(EPOCH, dateKey) < 0) {
        const previous = planForSeed(seedForDate(addDays(dateKey, -1)), addDays(dateKey, -1));
        const seed = seedForDate(dateKey);
        return {
            seed: seed,
            dateKey: dateKey,
            slot: drawUniqueSlot(seed, dateKey, [slotKey(previous.slot)]),
            variation: chooseVariation(seed, previous.variation.layout),
        };
    }

    const recentKeys = [];
    let previousLayout = null;
    let plan = null;
    let day = EPOCH;

    while (daysBetween(day, dateKey) >= 0) {
        const seed = seedForDate(day);
        const slot = drawUniqueSlot(seed, day, recentKeys);
        const variation = chooseVariation(seed, previousLayout);
        plan = { seed: seed, dateKey: day, slot: slot, variation: variation };

        recentKeys.push(slotKey(slot));
        if (recentKeys.length > NO_REPEAT_DAYS) {
            recentKeys.shift();
        }
        previousLayout = variation.layout;
        day = addDays(day, 1);
    }

    return plan;
}

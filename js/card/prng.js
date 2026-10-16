/**
 * Seeded PRNG helpers. Every variation axis draws from its own sub-stream
 * (rngFor(seed, 'layout'), rngFor(seed, 'bg'), …) so adding options to one axis
 * never reshuffles the others.
 */

/** xmur3 string hash → 32-bit seed. */
export function hashString(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
}

/** mulberry32: fast 32-bit PRNG returning floats in [0, 1). */
export function mulberry32(seed) {
    let a = seed >>> 0;
    return function next() {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function rngFor(seed, axis) {
    return mulberry32(hashString(String(seed) + '::' + axis));
}

export function randomInt(rng, min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
}

export function pick(rng, list) {
    return list[Math.floor(rng() * list.length)];
}

/** Weighted pick: items are { value, weight }. */
export function pickWeighted(rng, items) {
    const total = items.reduce((sum, item) => sum + item.weight, 0);
    let roll = rng() * total;
    for (let i = 0; i < items.length; i++) {
        roll -= items[i].weight;
        if (roll < 0) {
            return items[i].value;
        }
    }
    return items[items.length - 1].value;
}

export function randomSeed() {
    const bytes = new Uint32Array(2);
    if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(bytes);
    } else {
        bytes[0] = Math.floor(Math.random() * 4294967296);
        bytes[1] = Math.floor(Math.random() * 4294967296);
    }
    return bytes[0].toString(36) + bytes[1].toString(36).slice(0, 3);
}

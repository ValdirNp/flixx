export const CARD_TIME_ZONE = 'America/Sao_Paulo';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Today's date (YYYY-MM-DD) in the São Paulo time zone. */
export function todayKey() {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: CARD_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date());
    const get = (type) => parts.find((part) => part.type === type).value;
    return get('year') + '-' + get('month') + '-' + get('day');
}

export function isValidDateKey(value) {
    if (!value || !DATE_PATTERN.test(value)) {
        return false;
    }
    const date = new Date(value + 'T00:00:00Z');
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Date arithmetic in UTC so DST never skips or repeats a day. */
export function addDays(dateKey, amount) {
    const date = new Date(dateKey + 'T00:00:00Z');
    date.setUTCDate(date.getUTCDate() + amount);
    return date.toISOString().slice(0, 10);
}

export function daysBetween(fromKey, toKey) {
    const from = Date.parse(fromKey + 'T00:00:00Z');
    const to = Date.parse(toKey + 'T00:00:00Z');
    return Math.round((to - from) / 86400000);
}

export function yearOf(dateKey) {
    return Number(dateKey.slice(0, 4));
}

/** 2026-10-15 → 15/10/2026 */
export function formatDateBR(dateKey) {
    const parts = dateKey.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
}

import { SITE_URL, formatRating, genreNames } from './parts';

/** Instagram limits: 2200 characters per caption, 5 hashtags per post. */
export const CAPTION_MAX_LENGTH = 2200;
export const MAX_HASHTAGS = 5;

const BRAND_HASHTAGS = ['#flixx', '#filmedodia', '#dicadefilme'];
const GENRE_HASHTAG_SLOTS = 2;
const FILLER_HASHTAGS = ['#oqueassistir', '#cinema', '#filmes'];

const GENRE_HASHTAGS = {
    'Ação': '#filmedeacao',
    'Aventura': '#filmedeaventura',
    'Animação': '#animacao',
    'Comédia': '#comedia',
    'Crime': '#filmedecrime',
    'Documentário': '#documentario',
    'Drama': '#drama',
    'Família': '#filmeemfamilia',
    'Fantasia': '#fantasia',
    'História': '#filmehistorico',
    'Terror': '#filmedeterror',
    'Música': '#filmemusical',
    'Mistério': '#misterio',
    'Romance': '#filmederomance',
    'Ficção científica': '#ficcaocientifica',
    'Cinema TV': '#filmedetv',
    'Thriller': '#suspense',
    'Guerra': '#filmedeguerra',
    'Faroeste': '#faroeste',
};

/** Exactly 5 hashtags: brand tags + up to 2 genre tags, topped up with generic ones. */
export function buildHashtags(movie) {
    const tags = BRAND_HASHTAGS.slice();
    genreNames(movie, 3).forEach((name) => {
        const tag = GENRE_HASHTAGS[name];
        if (tag && !tags.includes(tag) && tags.length < BRAND_HASHTAGS.length + GENRE_HASHTAG_SLOTS) {
            tags.push(tag);
        }
    });
    FILLER_HASHTAGS.forEach((tag) => {
        if (tags.length < MAX_HASHTAGS && !tags.includes(tag)) {
            tags.push(tag);
        }
    });
    return tags.slice(0, MAX_HASHTAGS);
}

/**
 * Drops trailing sentences until the text fits, so the synopsis always ends on a
 * full sentence. Only a single sentence longer than the budget gets cut at a word.
 */
function fitSynopsis(text, maxLength) {
    const clean = (text || '').replace(/\s+/g, ' ').trim();
    if (clean.length <= maxLength) {
        return clean;
    }
    const sentences = clean.match(/[^.!?…]+(?:[.!?…]+["'”»)]*|$)/g) || [clean];
    let fitted = '';
    for (const sentence of sentences) {
        const next = (fitted + sentence).trim();
        if (next.length > maxLength) {
            break;
        }
        fitted = next + ' ';
    }
    fitted = fitted.trim();
    if (fitted) {
        return fitted;
    }
    const slice = clean.slice(0, maxLength - 1);
    const lastSpace = slice.lastIndexOf(' ');
    return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).replace(/[\s.,;:!?…–—-]+$/, '') + '…';
}

export function buildCaption(movie) {
    const head = [];
    const year = movie.release_year && movie.release_year !== '—' ? ' (' + movie.release_year + ')' : '';
    head.push('🎬 ' + movie.title + year);

    const genres = genreNames(movie, 3);
    if (genres.length) {
        head.push('🎭 ' + genres.join(' · '));
    }

    const rating = formatRating(movie);
    if (rating) {
        head.push('⭐ ' + rating + '/10 no TMDB');
    }

    const tail = [];
    const providers = movie.all_providers || [];
    if (providers.length) {
        tail.push('', '📺 Onde assistir: ' + providers.slice(0, 4).join(', '));
    }

    tail.push('', '🎲 Não sabe o que ver hoje? Sorteie o seu filme em ' + SITE_URL + ' (link na bio)');
    tail.push('', buildHashtags(movie).join(' '));

    // The synopsis gets whatever room is left under Instagram's caption limit.
    const fixedLength = head.join('\n').length + tail.join('\n').length + 4;
    const synopsis = fitSynopsis(movie.overview, CAPTION_MAX_LENGTH - fixedLength);
    const lines = synopsis ? head.concat('', synopsis, tail) : head.concat(tail);

    return lines.join('\n');
}

export function slugify(text) {
    return (text || 'filme')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'filme';
}

export function pngFileName(dateKey, movie) {
    return 'flixx-' + dateKey + '-' + slugify(movie.title) + '.png';
}

export function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (ok) {
            resolve();
        } else {
            reject(new Error('Não foi possível copiar.'));
        }
    });
}

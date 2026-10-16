import { SITE_URL, shortenText, formatRating, genreNames } from './parts';

export const CAPTION_SYNOPSIS_MAX = 220;

const BRAND_HASHTAGS = ['#flixx', '#filmedodia', '#dicadefilme', '#oqueassistir'];
const FILLER_HASHTAGS = ['#cinema', '#filmes'];

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

/** 5–8 hashtags: fixed brand tags + up to 3 genre tags, topped up with generic ones. */
export function buildHashtags(movie) {
    const tags = BRAND_HASHTAGS.slice();
    genreNames(movie, 3).forEach((name) => {
        const tag = GENRE_HASHTAGS[name];
        if (tag && !tags.includes(tag)) {
            tags.push(tag);
        }
    });
    FILLER_HASHTAGS.forEach((tag) => {
        if (tags.length < 6) {
            tags.push(tag);
        }
    });
    return tags.slice(0, 8);
}

export function buildCaption(movie) {
    const lines = [];
    const year = movie.release_year && movie.release_year !== '—' ? ' (' + movie.release_year + ')' : '';
    lines.push('🎬 ' + movie.title + year);

    const genres = genreNames(movie, 3);
    if (genres.length) {
        lines.push('🎭 ' + genres.join(' · '));
    }

    const rating = formatRating(movie);
    if (rating) {
        lines.push('⭐ ' + rating + '/10 no TMDB');
    }

    const synopsis = shortenText(movie.overview, CAPTION_SYNOPSIS_MAX);
    if (synopsis) {
        lines.push('', synopsis);
    }

    const providers = movie.all_providers || [];
    if (providers.length) {
        lines.push('', '📺 Onde assistir: ' + providers.slice(0, 4).join(', '));
    }

    lines.push('', '🎲 Não sabe o que ver hoje? Sorteie o seu filme em ' + SITE_URL + ' (link na bio)');
    lines.push('', buildHashtags(movie).join(' '));

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

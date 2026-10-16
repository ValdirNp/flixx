/**
 * Building blocks shared by every layout. They encode the fixed hierarchy:
 * title > year/rating > genres > synopsis > Flixx brand.
 * Optional fields honor the display options (display.js); the footer never does.
 */
import { useDisplay, isShown, cardText } from './display';

export const SITE_URL = 'flixx.netlify.app';

/** Cuts text at a whole word, appending an ellipsis when shortened. */
export function shortenText(text, maxLength) {
    const clean = (text || '').replace(/\s+/g, ' ').trim();
    if (clean.length <= maxLength) {
        return clean;
    }
    const slice = clean.slice(0, maxLength - 1);
    const lastSpace = slice.lastIndexOf(' ');
    const cut = lastSpace > maxLength * 0.6 ? slice.slice(0, lastSpace) : slice;
    return cut.replace(/[\s.,;:!?…–—-]+$/, '') + '…';
}

export function formatRating(movie) {
    const average = Number(movie.vote_average);
    if (!movie.vote_count || !Number.isFinite(average) || average <= 0) {
        return null;
    }
    return average.toFixed(1).replace('.', ',');
}

export function formatRuntime(minutes) {
    if (!minutes) {
        return null;
    }
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (!hours) {
        return rest + 'min';
    }
    return hours + 'h' + (rest ? ' ' + String(rest).padStart(2, '0') + 'min' : '');
}

export function genreNames(movie, limit) {
    return (movie.genres || '')
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)
        .slice(0, limit || 3);
}

/**
 * Shrinks font-size from `max` to `min` until the text fits `maxLines` lines and/or `maxHeight`
 * without horizontal overflow. Below `min`, breaks long words and clamps lines instead.
 */
function fitElement(el, opts) {
    const lineHeight = opts.lineHeight;
    el.style.webkitLineClamp = '';
    el.classList.remove('fc-clamp');
    el.style.overflowWrap = 'normal';

    let size = opts.max;
    const limit = () => {
        const byLines = opts.maxLines ? size * lineHeight * opts.maxLines : Infinity;
        return Math.min(byLines, opts.maxHeight || Infinity) + 1;
    };
    const fits = () => el.scrollHeight <= limit() && el.scrollWidth <= el.clientWidth + 1;

    el.style.fontSize = size + 'px';
    while (size > opts.min && !fits()) {
        size = Math.max(opts.min, size - 2);
        el.style.fontSize = size + 'px';
    }

    // A single word wider than the box (e.g. a one-word title) may go below min before breaking mid-word.
    const floor = Math.round(opts.min * 0.7);
    while (size > floor && el.scrollWidth > el.clientWidth + 1) {
        size = Math.max(floor, size - 2);
        el.style.fontSize = size + 'px';
    }

    if (!fits()) {
        el.style.overflowWrap = 'anywhere';
        const lines = Math.max(1, Math.floor((limit() - 1) / (size * lineHeight)));
        el.classList.add('fc-clamp');
        el.style.webkitLineClamp = String(lines);
    }
}

export function FitText(props) {
    const ref = React.useRef(null);
    const Tag = props.as || 'div';
    const lineHeight = props.lineHeight || 0.92;

    React.useLayoutEffect(() => {
        if (ref.current) {
            fitElement(ref.current, {
                max: props.max,
                min: props.min,
                maxLines: props.maxLines,
                maxHeight: props.maxHeight,
                lineHeight: lineHeight,
            });
        }
    }, [props.children, props.max, props.min, props.maxLines, props.maxHeight, lineHeight]);

    return (
        <Tag
            ref={ref}
            className={props.className}
            style={Object.assign({ lineHeight: lineHeight, fontSize: props.max }, props.style)}
        >
            {props.children}
        </Tag>
    );
}

export function Kicker(props) {
    const display = useDisplay();
    if (!isShown(display, 'kicker')) {
        return null;
    }
    return (
        <div className={'fc-kicker' + (props.boxed ? ' fc-kicker--boxed' : '')} style={props.style}>
            {props.children || 'Filme do dia'}
        </div>
    );
}

export function Title(props) {
    return (
        <FitText
            as="h1"
            className="fc-title"
            max={props.max}
            min={props.min}
            maxLines={props.maxLines}
            maxHeight={props.maxHeight}
            lineHeight={props.lineHeight}
            style={props.style}
        >
            {props.movie.title}
        </FitText>
    );
}

export function InlineRating(props) {
    const rating = formatRating(props.movie);
    if (!rating) {
        return null;
    }
    return (
        <span className="fc-inline-rating">
            <span className="fc-star" aria-hidden="true">★</span>
            <strong>{rating}</strong>
            <span className="fc-dim">/10</span>
        </span>
    );
}

/** Year · runtime · (inline rating). `showRating` is false when the rating is a corner badge. */
export function MetaRow(props) {
    const display = useDisplay();
    const runtime = isShown(display, 'runtime') ? formatRuntime(props.movie.runtime) : null;
    const items = [];
    if (isShown(display, 'year')) {
        items.push(<span key="year" className="fc-year">{props.movie.release_year}</span>);
    }
    if (runtime) {
        items.push(<span key="runtime">{runtime}</span>);
    }
    if (props.showRating && isShown(display, 'rating') && formatRating(props.movie)) {
        items.push(<InlineRating key="rating" movie={props.movie} />);
    }
    if (!items.length) {
        return null;
    }

    return (
        <div className={'fc-meta' + (props.center ? ' fc-center' : '')} style={props.style}>
            {items.reduce((acc, item, index) => {
                if (index > 0) {
                    acc.push(<span key={'sep-' + index} className="fc-sep" aria-hidden="true">•</span>);
                }
                acc.push(item);
                return acc;
            }, [])}
        </div>
    );
}

export function GenreChips(props) {
    const display = useDisplay();
    const names = genreNames(props.movie, props.limit);
    if (!names.length || !isShown(display, 'genres')) {
        return null;
    }
    const style = props.chipStyle || 'outline';

    return (
        <div
            className={'fc-chips fc-chips--' + style + (props.center ? ' fc-center' : '')}
            style={props.style}
        >
            {names.map((name, index) => (
                <React.Fragment key={name}>
                    {style === 'label' && index > 0 ? (
                        <span className="fc-chip-sep" aria-hidden="true">/</span>
                    ) : null}
                    <span className="fc-chip">{name}</span>
                </React.Fragment>
            ))}
        </div>
    );
}

const TRAILING_PUNCTUATION = /[\s.,;:!?…–—-]+$/;

/**
 * Longest whole-word prefix of `text` (with an ellipsis when cut) that fits `lines` lines of `el`.
 * Measures on a hidden clone so React keeps ownership of the real text node.
 */
function fitParagraph(el, text, lines) {
    const clone = el.cloneNode(false);
    clone.style.position = 'absolute';
    clone.style.visibility = 'hidden';
    clone.style.left = '0';
    clone.style.top = '0';
    clone.style.width = el.clientWidth + 'px';
    clone.style.display = 'block';
    clone.style.webkitLineClamp = 'none';
    el.parentNode.appendChild(clone);

    const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight);
    const maxHeight = lines * lineHeight + 2;
    const fits = (value) => {
        clone.textContent = value;
        return clone.scrollHeight <= maxHeight;
    };

    let result = text;
    if (!fits(text)) {
        const words = text.split(' ');
        let lo = 1;
        let hi = words.length - 1;
        result = words[0] + '…';
        while (lo <= hi) {
            const mid = Math.floor((lo + hi) / 2);
            const candidate = words.slice(0, mid).join(' ').replace(TRAILING_PUNCTUATION, '') + '…';
            if (fits(candidate)) {
                result = candidate;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
    }

    el.parentNode.removeChild(clone);
    return result;
}

/** Text block (synopsis, tagline or custom text): fills up to `lines` lines, cut at a whole word. */
export function Synopsis(props) {
    const display = useDisplay();
    const ref = React.useRef(null);
    const full = cardText(props.movie, display).replace(/\s+/g, ' ').trim();
    const [shown, setShown] = React.useState(full);

    React.useLayoutEffect(() => {
        if (ref.current && full) {
            setShown(fitParagraph(ref.current, full, props.lines));
        }
    }, [full, props.lines]);

    if (!full) {
        return null;
    }
    return (
        <p
            ref={ref}
            className={'fc-synopsis' + (props.center ? ' fc-center' : '')}
            style={Object.assign({ WebkitLineClamp: props.lines }, props.style)}
        >
            {shown}
        </p>
    );
}

export function RatingBadge(props) {
    const display = useDisplay();
    const rating = formatRating(props.movie);
    if (!rating || !isShown(display, 'rating')) {
        return null;
    }
    return (
        <div className="fc-badge" style={props.style}>
            <div className="fc-badge-value">{rating}</div>
            <div className="fc-badge-label">★ Nota</div>
        </div>
    );
}

/** Typographic stand-in when TMDB has no poster. Font sizes scale with the frame width; `decorative` drops the text. */
export function PosterFallback(props) {
    const width = props.width;
    if (props.decorative) {
        // Bleed layouts already show the title huge: keep the stand-in purely graphic.
        return <div className="fc-poster-fallback fc-poster-fallback--decorative" />;
    }
    return (
        <div className="fc-poster-fallback" style={{ padding: Math.round(width * 0.08) }}>
            <div className="fc-wordmark" style={{ fontSize: Math.round(width * 0.12) }}>Flixx</div>
            <FitText
                className="fc-title"
                max={Math.round(width * 0.2)}
                min={Math.round(width * 0.08)}
                maxLines={5}
            >
                {props.movie.title}
            </FitText>
            <div className="fc-year" style={{ fontSize: Math.round(width * 0.07) }}>
                {props.movie.release_year}
            </div>
        </div>
    );
}

/**
 * Poster frame. `badge` = 'corner-left' | 'corner-right' | null places the rating seal on the poster.
 */
export function PosterFrame(props) {
    const badgeSide = props.badge === 'corner-left' ? 'left' : 'right';
    const badgeStyle = { top: 18 };
    badgeStyle[badgeSide] = 18;

    return (
        <div
            className={'fc-poster' + (props.className ? ' ' + props.className : '')}
            style={Object.assign({ width: props.width, height: props.height }, props.style)}
        >
            {props.assets.hasPoster ? (
                <PosterImage assets={props.assets} />
            ) : (
                <PosterFallback movie={props.movie} width={props.width} />
            )}
            {props.badge ? <RatingBadge movie={props.movie} style={badgeStyle} /> : null}
        </div>
    );
}

/**
 * Poster image filling its (positioned) container, framed by the display options:
 * fit=cover crops around the focal point (px/py); fit=contain shows the whole poster over its blur.
 * `defaultX`/`defaultY` are the layout's focal point when the user hasn't set one.
 */
export function PosterImage(props) {
    const display = useDisplay();
    const x = display.px === null ? (props.defaultX || 50) : display.px;
    const y = display.py === null ? (props.defaultY || 50) : display.py;
    const position = x + '% ' + y + '%';

    if (display.fit === 'contain') {
        return (
            <div className="fc-media">
                <img className="fc-media-img" src={props.assets.blurUrl || props.assets.posterUrl} alt="" style={{ objectFit: 'cover' }} />
                <img className="fc-media-img" src={props.assets.posterUrl} alt="" style={{ objectFit: 'contain', objectPosition: position }} />
            </div>
        );
    }

    return (
        <div className="fc-media">
            <img className="fc-media-img" src={props.assets.posterUrl} alt="" style={{ objectFit: 'cover', objectPosition: position }} />
        </div>
    );
}

/** Fixed footer: wordmark, URL and TMDB attribution. `logoPos` only rearranges, never hides. */
export function BrandFooter(props) {
    const wordmark = <div key="wordmark" className="fc-wordmark fc-footer-wordmark">Flixx</div>;
    const url = <div key="url" className="fc-url">{SITE_URL}</div>;
    const tmdb = <div key="tmdb" className="fc-tmdb">Dados: TMDB</div>;

    let content;
    if (props.logoPos === 'center') {
        content = [
            <div key="l" className="fc-footer-side">{url}</div>,
            wordmark,
            <div key="r" className="fc-footer-side fc-right">{tmdb}</div>,
        ];
    } else {
        const info = (
            <div key="info" className={'fc-footer-info' + (props.logoPos === 'right' ? '' : ' fc-right')}>
                {url}
                {tmdb}
            </div>
        );
        content = props.logoPos === 'right' ? [info, wordmark] : [wordmark, info];
    }

    return <footer className="fc-footer">{content}</footer>;
}

/**
 * Building blocks shared by every layout. They encode the fixed hierarchy:
 * title > year/rating > genres > synopsis > Flixx brand.
 */

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
    const runtime = formatRuntime(props.movie.runtime);
    const items = [<span key="year" className="fc-year">{props.movie.release_year}</span>];
    if (runtime) {
        items.push(<span key="runtime">{runtime}</span>);
    }
    if (props.showRating && formatRating(props.movie)) {
        items.push(<InlineRating key="rating" movie={props.movie} />);
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
    const names = genreNames(props.movie, props.limit);
    if (!names.length) {
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

export function Synopsis(props) {
    const text = shortenText(props.movie.overview, props.maxLength);
    if (!text) {
        return null;
    }
    return (
        <p
            className={'fc-synopsis' + (props.center ? ' fc-center' : '')}
            style={Object.assign({ WebkitLineClamp: props.lines }, props.style)}
        >
            {text}
        </p>
    );
}

export function RatingBadge(props) {
    const rating = formatRating(props.movie);
    if (!rating) {
        return null;
    }
    return (
        <div className="fc-badge" style={props.style}>
            <div className="fc-badge-value">{rating}</div>
            <div className="fc-badge-label">★ Nota</div>
        </div>
    );
}

/** Typographic stand-in when TMDB has no poster. Font sizes scale with the frame width. */
export function PosterFallback(props) {
    const width = props.width;
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
                <img src={props.assets.posterUrl} alt="" />
            ) : (
                <PosterFallback movie={props.movie} width={props.width} />
            )}
            {props.badge ? <RatingBadge movie={props.movie} style={badgeStyle} /> : null}
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

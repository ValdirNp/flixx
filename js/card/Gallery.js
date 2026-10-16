/**
 * Review grids (?gallery=…):
 *   1       next N days of the real schedule (default 12) — checks variety and day-to-day rules
 *   random  N random seeds
 *   matrix  every layout × background for one movie (accent alternates)
 *   stress  synthetic edge cases (long title, no poster/synopsis/rating, muted poster) × every layout
 */
import { LAYOUTS } from './layouts';
import { BACKGROUNDS } from './backgrounds';
import { ACCENT_MODES, RATING_POSITIONS, CHIP_STYLES, LOGO_POSITIONS, describeVariation } from './variation';
import { addDays, formatDateBR } from './date';
import { randomSeed } from './prng';
import { resolveCardModel, buildSearch } from './model';
import { NO_POSTER_ASSETS, loadSyntheticPosterAssets } from './poster';
import { ScaledCard } from './Preview';

const CONCURRENCY = 3;

function runQueue(tasks, onResult) {
    let index = 0;
    const worker = () => {
        if (index >= tasks.length) {
            return Promise.resolve();
        }
        const current = index++;
        return tasks[current]()
            .then((value) => onResult(current, { model: value }))
            .catch((err) => onResult(current, { error: err.message || String(err) }))
            .then(worker);
    };
    const workers = [];
    for (let i = 0; i < CONCURRENCY; i++) {
        workers.push(worker());
    }
    return Promise.all(workers);
}

const STRESS_MOVIES = [
    {
        id: 900001,
        title: 'O Estranho Mundo de Jack e a Incrível Jornada pelo Reino Perdido das Sombras Eternas',
        release_year: '2003',
        runtime: 167,
        vote_average: 7.9,
        vote_count: 5400,
        genres: 'Ficção científica, Aventura, Animação',
        overview: 'Uma sinopse propositalmente enorme para testar quebras: depois de perder tudo numa tempestade que engoliu a cidade inteira, uma cartógrafa obstinada atravessa desertos, mares congelados e montanhas que mudam de lugar à noite, guiada apenas por um mapa incompleto deixado pela avó e por um corvo que parece entender cada palavra que ela diz em voz alta.',
        poster: { hue: 205 },
    },
    {
        id: 900002,
        title: 'Sem Pôster',
        release_year: '—',
        runtime: null,
        vote_average: 0,
        vote_count: 0,
        genres: '',
        overview: '',
        poster: null,
    },
    {
        id: 900003,
        title: 'Up',
        release_year: '2009',
        runtime: 96,
        vote_average: 8.3,
        vote_count: 19000,
        genres: 'Drama',
        overview: 'Pôster dessaturado: o acento deve cair no fallback da marca.',
        poster: { hue: 0, muted: true },
    },
    {
        id: 900004,
        title: 'Supercalifragilisticexpialidocious',
        release_year: '1964',
        runtime: 139,
        vote_average: 0,
        vote_count: 0,
        genres: 'Comédia, Família',
        overview: 'Título com uma única palavra muito longa e sem nota.',
        poster: { hue: 52 },
    },
];

function stressTasks() {
    const tasks = [];
    LAYOUTS.forEach((layout, layoutIndex) => {
        STRESS_MOVIES.forEach((movie, movieIndex) => {
            const i = layoutIndex * STRESS_MOVIES.length + movieIndex;
            tasks.push(() => {
                const assetsPromise = movie.poster
                    ? loadSyntheticPosterAssets(movie.poster.hue, movie.title.slice(0, 12), movie.poster.muted)
                    : Promise.resolve(NO_POSTER_ASSETS);
                return assetsPromise.then((assets) => ({
                    seed: 'stress-' + i,
                    dateKey: '2026-01-01',
                    movie: movie,
                    assets: assets,
                    variation: {
                        layout: layout.id,
                        background: BACKGROUNDS[(layoutIndex + movieIndex) % BACKGROUNDS.length].id,
                        accent: ACCENT_MODES[i % ACCENT_MODES.length].id,
                        ratingPos: RATING_POSITIONS[i % RATING_POSITIONS.length],
                        chipStyle: CHIP_STYLES[(i + layoutIndex) % CHIP_STYLES.length],
                        logoPos: LOGO_POSITIONS[(i + movieIndex) % LOGO_POSITIONS.length],
                    },
                }));
            });
        });
    });
    return { tasks: tasks, links: tasks.map(() => null) };
}

function matrixTasks(request) {
    const base = resolveCardModel(Object.assign({}, request, { overrides: {} }));
    const tasks = [];
    const links = [];
    LAYOUTS.forEach((layout) => {
        BACKGROUNDS.forEach((background, bgIndex) => {
            const accent = ACCENT_MODES[(tasks.length + bgIndex) % ACCENT_MODES.length].id;
            tasks.push(() => base.then((model) => Object.assign({}, model, {
                variation: Object.assign({}, model.variation, {
                    layout: layout.id,
                    background: background.id,
                    accent: accent,
                }),
            })));
            links.push({ date: request.dateKey, seed: request.seed, movie: request.movieId, layout: layout.id, theme: background.id, accent: accent });
        });
    });
    return { tasks: tasks, links: links };
}

function scheduleTasks(request, random) {
    const count = Math.min(request.count || 12, 36);
    const tasks = [];
    const links = [];
    for (let i = 0; i < count; i++) {
        const sub = random
            ? { dateKey: request.dateKey, seed: randomSeed(), movieId: null, overrides: {} }
            : { dateKey: addDays(request.dateKey, i), seed: null, movieId: null, overrides: {} };
        tasks.push(() => resolveCardModel(sub));
        links.push(random ? { seed: sub.seed } : { date: sub.dateKey });
    }
    return { tasks: tasks, links: links };
}

export function Gallery(props) {
    const request = props.request;
    const [items, setItems] = React.useState([]);

    React.useEffect(() => {
        let cancelled = false;
        let spec;
        if (request.gallery === 'stress') {
            spec = stressTasks();
        } else if (request.gallery === 'matrix') {
            spec = matrixTasks(request);
        } else {
            spec = scheduleTasks(request, request.gallery === 'random');
        }

        setItems(spec.links.map((link) => ({ link: link, model: null, error: '' })));
        runQueue(spec.tasks, (index, result) => {
            if (cancelled) {
                return;
            }
            setItems((current) => current.map((item, i) => (
                i === index ? Object.assign({}, item, { model: result.model || null, error: result.error || '' }) : item
            )));
        });

        return () => {
            cancelled = true;
        };
    }, []);

    let previousLayout = null;

    return (
        <div
            className="fp-gallery"
            style={request.cols ? { gridTemplateColumns: 'repeat(' + request.cols + ', minmax(0, 1fr))' } : undefined}
        >
            {items.map((item, index) => {
                const model = item.model;
                const repeatsLayout = request.gallery === '1' && model && model.variation.layout === previousLayout;
                if (model) {
                    previousLayout = model.variation.layout;
                }
                const href = item.link ? window.location.pathname + buildSearch(item.link) : null;
                const body = (
                    <React.Fragment>
                        {model ? (
                            <ScaledCard model={model} />
                        ) : (
                            <div className={'fp-status' + (item.error ? ' fp-error' : '')}>
                                {item.error || 'Carregando…'}
                            </div>
                        )}
                        <div className="fp-gallery-caption">
                            {model ? (
                                <React.Fragment>
                                    <strong>{request.gallery === '1' ? formatDateBR(model.dateKey) : model.seed}</strong>
                                    {' · '}{model.movie.title}
                                    <br />
                                    {describeVariation(model.variation)}
                                    {repeatsLayout ? ' ⚠ layout repetido' : ''}
                                </React.Fragment>
                            ) : '#' + (index + 1)}
                        </div>
                    </React.Fragment>
                );
                return href ? (
                    <a key={index} className="fp-gallery-item" href={href}>{body}</a>
                ) : (
                    <div key={index} className="fp-gallery-item">{body}</div>
                );
            })}
        </div>
    );
}


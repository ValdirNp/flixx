import { applyOverrides, describeVariation } from './variation';
import { formatDateBR } from './date';
import { randomSeed } from './prng';
import { readRequest, resolveCardModel, buildSearch } from './model';
import { buildCaption, pngFileName, copyText } from './caption';
import { exportCardPng, downloadBlob, canShareFiles, shareBlob } from './export';
import { ScaledCard } from './Preview';
import { Gallery } from './Gallery';
import { Controls } from './Controls';

/** Params that pick the data (movie); everything else only re-renders the same card. */
const DATA_PARAMS = ['date', 'seed', 'movie'];

function useLocationSearch() {
    const [search, setSearch] = React.useState(window.location.search);

    React.useEffect(() => {
        const onPop = () => setSearch(window.location.search);
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    /** New history entry with exactly these params. */
    const navigate = (params) => {
        const next = buildSearch(params);
        window.history.pushState(null, '', window.location.pathname + next);
        setSearch(next);
    };

    /** Merges a patch into the current params (null removes) without a new history entry. */
    const update = (patch) => {
        const params = new URLSearchParams(window.location.search);
        Object.keys(patch).forEach((key) => {
            if (patch[key] === null || patch[key] === undefined || patch[key] === '') {
                params.delete(key);
            } else {
                params.set(key, patch[key]);
            }
        });
        const value = params.toString();
        const next = value ? '?' + value : '';
        window.history.replaceState(null, '', window.location.pathname + next);
        setSearch(next);
    };

    return [search, navigate, update];
}

function SingleCard(props) {
    const request = props.request;
    const urlParams = new URLSearchParams(props.search);
    const urlDate = urlParams.get('date');
    const dataKey = DATA_PARAMS.map((key) => urlParams.get(key) || '').join('|');
    const cardRef = React.useRef(null);
    const [state, setState] = React.useState({ status: 'loading', base: null, error: '' });
    const [busy, setBusy] = React.useState('');
    const [notice, setNotice] = React.useState('');
    const [viewportHeight, setViewportHeight] = React.useState(window.innerHeight);

    React.useEffect(() => {
        const onResize = () => setViewportHeight(window.innerHeight);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    React.useEffect(() => {
        let cancelled = false;
        setState({ status: 'loading', base: null, error: '' });
        resolveCardModel(request)
            .then((base) => {
                if (!cancelled) {
                    setState({ status: 'ready', base: base, error: '' });
                }
            })
            .catch((err) => {
                console.error(err);
                if (!cancelled) {
                    setState({ status: 'error', base: null, error: err.message || 'Falha ao montar o card.' });
                }
            });
        return () => {
            cancelled = true;
        };
    }, [dataKey]);

    // Variation and display come from the current URL on every render: controls never refetch.
    const model = state.base ? Object.assign({}, state.base, {
        variation: applyOverrides(state.base.plan.variation, request.overrides),
        display: request.display,
    }) : null;
    const caption = model ? buildCaption(model.movie) : '';
    const isOverride = Array.from(urlParams.keys()).some((key) => key !== 'date' && key !== 'gallery');

    const flash = (message) => {
        setNotice(message);
        setTimeout(() => setNotice(''), 3500);
    };

    const runExport = (action) => {
        if (!cardRef.current || busy) {
            return;
        }
        setBusy(action);
        exportCardPng(cardRef.current)
            .then((blob) => {
                const fileName = pngFileName(model.dateKey, model.movie);
                if (action === 'share') {
                    return shareBlob(blob, fileName, caption).then(() => flash('Compartilhado.'));
                }
                downloadBlob(blob, fileName);
                flash('PNG 1080×1350 gerado: ' + fileName);
                return null;
            })
            .catch((err) => {
                if (err && err.name === 'AbortError') {
                    return;
                }
                console.error(err);
                flash('Erro ao exportar: ' + (err.message || err));
            })
            .then(() => setBusy(''));
    };

    const copyCaption = () => {
        copyText(caption)
            .then(() => flash('Legenda copiada.'))
            .catch(() => flash('Não deu para copiar — selecione o texto abaixo.'));
    };

    const copyLink = () => {
        copyText(window.location.href)
            .then(() => flash('Link desta versão copiado.'))
            .catch(() => flash('Não deu para copiar o link.'));
    };

    // A new movie keeps the "what to show" choices, but not text/framing tuned for the old one.
    const shuffle = () => props.navigate({ date: urlDate, seed: randomSeed(), hide: urlParams.get('hide') });
    const backToDaily = () => props.navigate({ date: urlDate });
    const desktop = window.innerWidth > 900;

    return (
        <div className="fp-layout">
            <div className="fp-preview-col">
                {state.status === 'loading' ? <div className="fp-status">Montando o card…</div> : null}
                {state.status === 'error' ? (
                    <div className="fp-status fp-error" role="alert">{state.error}</div>
                ) : null}
                {model ? (
                    <ScaledCard model={model} cardRef={cardRef} maxHeight={desktop ? viewportHeight - 40 : null} />
                ) : null}
            </div>

            <aside className="fp-panel">
                <div className="fp-label">Card</div>
                <p className="fp-meta">
                    <strong>{formatDateBR(request.dateKey)}</strong>
                    {request.seed ? ' · seed ' + request.seed : ' · filme do dia'}
                    {model ? (
                        <React.Fragment>
                            <br />
                            {model.movie.title} ({model.movie.release_year}) · TMDB {model.movie.id}
                            <br />
                            {describeVariation(model.variation)}
                        </React.Fragment>
                    ) : null}
                </p>

                <button type="button" className="fp-button fp-button--primary" onClick={() => runExport('download')} disabled={!model || Boolean(busy)}>
                    {busy === 'download' ? 'Gerando PNG…' : 'Baixar PNG'}
                </button>
                {canShareFiles() ? (
                    <button type="button" className="fp-button" onClick={() => runExport('share')} disabled={!model || Boolean(busy)}>
                        {busy === 'share' ? 'Preparando…' : 'Compartilhar imagem'}
                    </button>
                ) : null}
                <div className="fp-button-row">
                    <button type="button" className="fp-button" onClick={copyCaption} disabled={!model}>
                        Copiar legenda
                    </button>
                    <button type="button" className="fp-button" onClick={copyLink}>
                        Copiar link
                    </button>
                </div>
                <div className="fp-button-row">
                    <button type="button" className="fp-button" onClick={shuffle}>
                        Sortear outro
                    </button>
                    <button type="button" className="fp-button" onClick={backToDaily} disabled={!isOverride}>
                        Voltar ao do dia
                    </button>
                </div>
                <div className="fp-notice" aria-live="polite">{notice}</div>

                {model ? (
                    <Controls
                        request={request}
                        movie={model.movie}
                        hasPoster={model.assets.hasPoster}
                        plannedVariation={state.base.plan.variation}
                        variation={model.variation}
                        update={props.update}
                    />
                ) : null}

                <div className="fp-label">Legenda</div>
                <textarea className="fp-caption" readOnly value={caption} aria-label="Legenda do post" />
            </aside>
        </div>
    );
}

export function CardApp() {
    const [search, navigate, update] = useLocationSearch();
    const request = readRequest(search);
    const dateParam = new URLSearchParams(search).get('date');

    return (
        <div className="fp-page">
            <header className="fp-header">
                <h1 className="fp-brand">Flixx<span>card do dia</span></h1>
                <nav className="fp-nav">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate({ date: dateParam }); }}>Card</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate({ date: dateParam, gallery: '1' }); }}>Próximos dias</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate({ gallery: 'random' }); }}>Seeds aleatórias</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate({ date: dateParam, gallery: 'matrix' }); }}>Matriz</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate({ gallery: 'stress' }); }}>Stress</a>
                </nav>
            </header>
            {request.gallery ? (
                <Gallery key={search} request={request} />
            ) : (
                <SingleCard request={request} search={search} navigate={navigate} update={update} />
            )}
        </div>
    );
}

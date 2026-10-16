/**
 * Live controls for the single-card view. Every change is written to the URL (replaceState),
 * so the preview updates instantly and the current link reproduces exactly this version.
 * "Automático" removes the param and falls back to what the seed picked.
 */
import { LAYOUTS, getLayout } from './layouts';
import { BACKGROUNDS, getBackground } from './backgrounds';
import {
    ACCENT_MODES,
    RATING_POSITIONS,
    CHIP_STYLES,
    LOGO_POSITIONS,
    RATING_LABELS,
    CHIP_LABELS,
    LOGO_LABELS,
} from './variation';
import { DISPLAY_FIELDS, TEXT_SOURCES, POSTER_FITS } from './display';
import { shortenText } from './parts';

function AxisSelect(props) {
    const auto = props.options.find((option) => option.id === props.planned);
    return (
        <label className="fp-field">
            <span>{props.label}</span>
            <select
                className="fp-select"
                value={props.value || ''}
                onChange={(e) => props.onChange(e.target.value || null)}
            >
                <option value="">Automático · {auto ? auto.name : props.planned}</option>
                {props.options.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                ))}
            </select>
        </label>
    );
}

function toOptions(ids, labels) {
    return ids.map((id) => ({ id: id, name: labels[id] }));
}

function Segmented(props) {
    return (
        <div className="fp-seg" role="group" aria-label={props.label}>
            {props.options.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    className={'fp-seg-item' + (props.value === option.id ? ' is-active' : '')}
                    onClick={() => props.onChange(option.id)}
                    disabled={option.disabled}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

export function Controls(props) {
    const request = props.request;
    const display = request.display;
    const planned = props.plannedVariation;
    const movie = props.movie;
    const update = props.update;
    const layout = getLayout(props.variation.layout);
    const defaultY = (layout && layout.posterFocusY) || 50;

    const toggleField = (id) => {
        const hidden = display.hidden.includes(id)
            ? display.hidden.filter((item) => item !== id)
            : display.hidden.concat(id);
        update({ hide: hidden.join(',') || null });
    };

    const setText = (source) => {
        const patch = { text: source === 'overview' ? null : source };
        if (source === 'custom' && !display.customText) {
            patch.txt = shortenText(movie.overview || movie.tagline || '', 200);
        }
        update(patch);
    };

    return (
        <div className="fp-controls">
            <div className="fp-label">Variação</div>
            <AxisSelect
                label="Layout"
                options={LAYOUTS.map((item) => ({ id: item.id, name: item.name }))}
                planned={planned.layout}
                value={request.overrides.layout}
                onChange={(value) => update({ layout: value })}
            />
            <AxisSelect
                label="Fundo"
                options={BACKGROUNDS.map((item) => ({ id: item.id, name: item.name }))}
                planned={planned.background}
                value={request.overrides.theme}
                onChange={(value) => update({ theme: value })}
            />
            <AxisSelect
                label="Cor de acento"
                options={ACCENT_MODES}
                planned={planned.accent}
                value={request.overrides.accent}
                onChange={(value) => update({ accent: value })}
            />
            <AxisSelect
                label="Nota"
                options={toOptions(RATING_POSITIONS, RATING_LABELS)}
                planned={planned.ratingPos}
                value={request.overrides.rating}
                onChange={(value) => update({ rating: value })}
            />
            <AxisSelect
                label="Gêneros"
                options={toOptions(CHIP_STYLES, CHIP_LABELS)}
                planned={planned.chipStyle}
                value={request.overrides.chips}
                onChange={(value) => update({ chips: value })}
            />
            <AxisSelect
                label="Rodapé"
                options={toOptions(LOGO_POSITIONS, LOGO_LABELS)}
                planned={planned.logoPos}
                value={request.overrides.logo}
                onChange={(value) => update({ logo: value })}
            />
            {getBackground(planned.background) && getBackground(planned.background).needsPoster && !props.hasPoster ? (
                <p className="fp-hint">Sem pôster: o fundo desfocado cai no “Feixe Flixx”.</p>
            ) : null}

            <div className="fp-label">Mostrar no card</div>
            <div className="fp-checks">
                {DISPLAY_FIELDS.map((field) => (
                    <label key={field.id} className={'fp-check' + (display.hidden.includes(field.id) ? '' : ' is-on')}>
                        <input
                            type="checkbox"
                            checked={!display.hidden.includes(field.id)}
                            onChange={() => toggleField(field.id)}
                        />
                        {field.label}
                    </label>
                ))}
            </div>
            <p className="fp-hint">Título, logo, URL e “Dados: TMDB” são fixos.</p>

            <div className="fp-label">Texto</div>
            <Segmented
                label="Fonte do texto"
                value={display.text}
                onChange={setText}
                options={TEXT_SOURCES.map((source) => ({
                    id: source.id,
                    label: source.label,
                    disabled: source.id === 'tagline' && !movie.tagline,
                }))}
            />
            {display.text === 'tagline' || !movie.tagline ? (
                <p className="fp-hint">
                    {movie.tagline ? 'Tagline: “' + movie.tagline + '”' : 'Este filme não tem tagline em pt-BR.'}
                </p>
            ) : null}
            {display.text === 'custom' ? (
                <textarea
                    className="fp-caption fp-custom-text"
                    value={display.customText}
                    onChange={(e) => update({ txt: e.target.value || null })}
                    aria-label="Texto personalizado do card"
                />
            ) : null}
            <p className="fp-hint">O texto é cortado numa palavra inteira quando não cabe nas linhas do layout.</p>

            <div className="fp-label">Pôster</div>
            <Segmented
                label="Enquadramento"
                value={display.fit}
                onChange={(value) => update({ fit: value === 'cover' ? null : value })}
                options={POSTER_FITS}
            />
            <label className="fp-field">
                <span>Posição horizontal · {display.px === null ? 50 : display.px}%</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={display.px === null ? 50 : display.px}
                    onChange={(e) => update({ px: e.target.value })}
                />
            </label>
            <label className="fp-field">
                <span>Posição vertical · {display.py === null ? defaultY : display.py}%</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={display.py === null ? defaultY : display.py}
                    onChange={(e) => update({ py: e.target.value })}
                />
            </label>
            <p className="fp-hint">
                A posição só muda algo onde o pôster é recortado (faixa vertical, split diagonal) ou no modo “Inteiro”.
            </p>
            <button type="button" className="fp-button fp-button--small" onClick={() => update({ fit: null, px: null, py: null })}>
                Resetar pôster
            </button>
        </div>
    );
}

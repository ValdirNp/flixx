import { COLORS } from '../../shared/tokens';
import { formatDateBR } from '../date';
import { rngFor, randomInt } from '../prng';
import { Title, MetaRow, GenreChips, Synopsis, PosterFrame } from '../parts';

/** Seeded "seat" so the stub changes daily but stays stable for a given card. */
function seatFor(seed) {
    const rng = rngFor(seed, 'ticket-seat');
    return {
        room: randomInt(rng, 1, 9),
        row: 'ABCDEFGHJK'.charAt(randomInt(rng, 0, 9)),
        seat: randomInt(rng, 1, 24),
    };
}

function Content(props) {
    const inline = props.variation.ratingPos === 'inline';
    const seat = seatFor(props.seed);

    return (
        <div className="fc-col fc-col-middle">
            <div className="fc-ticket">
                <div className="fc-ticket-head">
                    <span>Admite 1 · Filme do dia</span>
                    <span>Nº {String(props.movie.id || 0).padStart(7, '0')}</span>
                </div>
                <div className="fc-row" style={{ padding: 36, height: 522, boxSizing: 'border-box' }}>
                    <PosterFrame
                        movie={props.movie}
                        assets={props.assets}
                        width={300}
                        height={450}
                        badge={inline ? null : props.variation.ratingPos}
                    />
                    <div className="fc-col" style={{ flex: 1, minWidth: 0, paddingLeft: 36, justifyContent: 'center' }}>
                        <Title movie={props.movie} max={104} min={50} maxLines={4} maxHeight={300} />
                        <MetaRow movie={props.movie} showRating={inline} style={{ marginTop: 16 }} />
                        <GenreChips movie={props.movie} chipStyle={props.variation.chipStyle} style={{ marginTop: 16 }} />
                    </div>
                </div>
                <div className="fc-ticket-perforation" />
                <div className="fc-ticket-stub">
                    <Synopsis movie={props.movie} lines={4} />
                    <div className="fc-ticket-info">
                        <span><b>Sessão</b> {formatDateBR(props.dateKey)}</span>
                        <span><b>Sala</b> {seat.room}</span>
                        <span><b>Fila</b> {seat.row}</span>
                        <span><b>Poltrona</b> {seat.seat}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default {
    id: 'ticket',
    name: 'Ingresso',
    // Text sits on the ticket paper, so contrast is checked against it.
    surface: COLORS.paper,
    Content: Content,
};

import { Kicker, Title, MetaRow, GenreChips, Synopsis, PosterFrame } from '../parts';

function Content(props) {
    const inline = props.variation.ratingPos === 'inline';
    return (
        <div className="fc-col fc-col-middle">
            <Kicker />
            <Title movie={props.movie} max={190} min={84} maxLines={4} maxHeight={560} style={{ marginTop: 18 }} />
            <div className="fc-rule" style={{ marginTop: 28 }} />
            <div className="fc-row" style={{ marginTop: 40 }}>
                <PosterFrame
                    movie={props.movie}
                    assets={props.assets}
                    width={250}
                    height={375}
                    className="fc-poster--print"
                    badge={inline ? null : props.variation.ratingPos}
                />
                <div className="fc-col" style={{ flex: 1, minWidth: 0, paddingLeft: 52 }}>
                    <MetaRow movie={props.movie} showRating={inline} />
                    <GenreChips movie={props.movie} chipStyle={props.variation.chipStyle} style={{ marginTop: 16 }} />
                    <Synopsis movie={props.movie} lines={6} style={{ marginTop: 20 }} />
                </div>
            </div>
        </div>
    );
}

export default {
    id: 'typographic',
    name: 'Capa tipográfica',
    Content: Content,
};

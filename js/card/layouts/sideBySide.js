import { Kicker, Title, MetaRow, GenreChips, Synopsis, PosterFrame } from '../parts';

function Content(props) {
    const inline = props.variation.ratingPos === 'inline';
    return (
        <div className="fc-col fc-col-middle">
            <Kicker style={{ marginBottom: 28 }} />
            <div className="fc-row">
                <PosterFrame
                    movie={props.movie}
                    assets={props.assets}
                    width={430}
                    height={645}
                    badge={inline ? null : props.variation.ratingPos}
                />
                <div className="fc-col" style={{ flex: 1, minWidth: 0, paddingLeft: 48 }}>
                    <Title movie={props.movie} max={120} min={56} maxLines={4} maxHeight={430} />
                    <MetaRow movie={props.movie} showRating={inline} style={{ marginTop: 18 }} />
                    <GenreChips movie={props.movie} chipStyle={props.variation.chipStyle} style={{ marginTop: 18 }} />
                    <Synopsis movie={props.movie} lines={7} style={{ marginTop: 22 }} />
                </div>
            </div>
        </div>
    );
}

export default {
    id: 'side-by-side',
    name: 'Pôster + texto',
    Content: Content,
};

import { Kicker, Title, MetaRow, GenreChips, Synopsis, RatingBadge, PosterFallback } from '../parts';

/** Poster across the top with a diagonal cut and an accent stripe along the edge. */
function Bleed(props) {
    return (
        <React.Fragment>
            <div className="fc-diagonal-accent" />
            <div className="fc-diagonal-poster">
                {props.assets.hasPoster ? (
                    <img className="fc-layer-img" src={props.assets.posterUrl} alt="" style={{ objectPosition: '50% 22%' }} />
                ) : (
                    <PosterFallback movie={props.movie} width={1080} />
                )}
                <div
                    className="fc-layer"
                    style={{ background: 'linear-gradient(180deg, rgba(14, 13, 12, 0.55) 0%, rgba(14, 13, 12, 0) 28%)' }}
                />
            </div>
        </React.Fragment>
    );
}

function Content(props) {
    const inline = props.variation.ratingPos === 'inline';
    const badgeStyle = props.variation.ratingPos === 'corner-left'
        ? { left: 0, top: 78 }
        : { right: 0, top: 0 };

    return (
        <div className="fc-col fc-fill" style={{ position: 'relative' }}>
            <div><Kicker boxed /></div>
            <div style={{ flex: 1 }} />
            <Title movie={props.movie} max={116} min={56} maxLines={2} />
            <MetaRow movie={props.movie} showRating={inline} style={{ marginTop: 16 }} />
            <GenreChips movie={props.movie} chipStyle={props.variation.chipStyle} style={{ marginTop: 16 }} />
            <Synopsis movie={props.movie} maxLength={150} lines={3} style={{ marginTop: 18 }} />
            {inline ? null : <RatingBadge movie={props.movie} style={badgeStyle} />}
        </div>
    );
}

export default {
    id: 'diagonal',
    name: 'Split diagonal',
    Bleed: Bleed,
    Content: Content,
};

import { Kicker, Title, MetaRow, GenreChips, Synopsis, RatingBadge, PosterFallback, PosterImage } from '../parts';

/** Full-height poster strip on the right, darkened toward the text side. */
function Bleed(props) {
    return (
        <div className="fc-strip">
            {props.assets.hasPoster ? (
                <PosterImage assets={props.assets} />
            ) : (
                <PosterFallback movie={props.movie} width={497} decorative />
            )}
            <div
                className="fc-layer"
                style={{
                    background: [
                        'linear-gradient(180deg, rgba(14, 13, 12, 0) 72%, rgba(14, 13, 12, 0.9) 92%)',
                        'linear-gradient(90deg, rgba(14, 13, 12, 0.9) 0%, rgba(14, 13, 12, 0.45) 45%, rgba(14, 13, 12, 0.2) 100%)',
                    ].join(', '),
                }}
            />
            <div className="fc-strip-edge" />
        </div>
    );
}

function Content(props) {
    const inline = props.variation.ratingPos === 'inline';
    const badgeStyle = props.variation.ratingPos === 'corner-left'
        ? { right: 0, bottom: 0 }
        : { right: 0, top: 0 };

    return (
        <div className="fc-col fc-fill" style={{ position: 'relative', justifyContent: 'space-between' }}>
            <Kicker />
            <div>
                <Title
                    movie={props.movie}
                    max={210}
                    min={100}
                    maxLines={3}
                    maxHeight={590}
                    style={{ textShadow: '0 6px 40px rgba(0, 0, 0, 0.55)' }}
                />
                <div style={{ width: 470 }}>
                    <MetaRow movie={props.movie} showRating={inline} style={{ marginTop: 22 }} />
                    <GenreChips movie={props.movie} chipStyle={props.variation.chipStyle} style={{ marginTop: 16 }} />
                    <Synopsis movie={props.movie} lines={6} style={{ marginTop: 18 }} />
                </div>
            </div>
            {inline ? null : <RatingBadge movie={props.movie} style={badgeStyle} />}
        </div>
    );
}

export default {
    id: 'strip',
    name: 'Faixa vertical',
    Bleed: Bleed,
    Content: Content,
};

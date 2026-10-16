import { Kicker, Title, MetaRow, GenreChips, Synopsis, PosterFrame } from '../parts';

function Content(props) {
    const inline = props.variation.ratingPos === 'inline';
    return (
        <div className="fc-col fc-col-center">
            <Kicker style={{ marginBottom: 22 }} />
            <PosterFrame
                movie={props.movie}
                assets={props.assets}
                width={440}
                height={660}
                badge={inline ? null : props.variation.ratingPos}
            />
            <Title movie={props.movie} max={92} min={52} maxLines={2} style={{ marginTop: 30, textAlign: 'center', width: '100%' }} />
            <MetaRow movie={props.movie} showRating={inline} center style={{ marginTop: 14 }} />
            <GenreChips movie={props.movie} chipStyle={props.variation.chipStyle} center style={{ marginTop: 16 }} />
            <Synopsis movie={props.movie} lines={2} center style={{ marginTop: 18, maxWidth: 860 }} />
        </div>
    );
}

export default {
    id: 'poster-hero',
    name: 'Pôster em destaque',
    Content: Content,
};

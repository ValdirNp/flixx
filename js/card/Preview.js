import { Card, CARD_WIDTH, CARD_HEIGHT } from './Card';

/**
 * Responsive preview: the card always renders at 1080×1350 and is scaled with a CSS transform
 * on a wrapper, so exporting the inner node yields the real size.
 */
export function ScaledCard(props) {
    const wrapRef = React.useRef(null);
    const [scale, setScale] = React.useState(0.3);

    React.useLayoutEffect(() => {
        const measure = () => {
            if (!wrapRef.current) {
                return;
            }
            const width = wrapRef.current.clientWidth;
            let next = width / CARD_WIDTH;
            if (props.maxHeight) {
                next = Math.min(next, props.maxHeight / CARD_HEIGHT);
            }
            setScale(Math.min(1, next));
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [props.maxHeight]);

    return (
        <div ref={wrapRef} className="fp-stage-wrap">
            <div className="fp-stage" style={{ width: CARD_WIDTH * scale, height: CARD_HEIGHT * scale }}>
                <div className="fp-scaler" style={{ transform: 'scale(' + scale + ')' }}>
                    <Card model={props.model} innerRef={props.cardRef} />
                </div>
            </div>
        </div>
    );
}

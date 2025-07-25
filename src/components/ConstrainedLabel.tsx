export type ConstrainedLabelProp = {
    title : string;
};

export default function ConstrainedLabel( props : ConstrainedLabelProp ) {
    return (
        <span className="constrained-label" title={props.title} aria-label={props.title}>{ props.title }</span>
    );
}
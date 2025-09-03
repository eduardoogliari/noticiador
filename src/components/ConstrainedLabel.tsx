import styles from './ConstrainedLabel.module.css';

export type ConstrainedLabelProp = {
    title : string;
};

export default function ConstrainedLabel( props : ConstrainedLabelProp ) {
    return (
        <span
            className={styles["constrained-label"]}
            title={props.title}
            aria-label={props.title}
        >
            { props.title }
        </span>
    );
}
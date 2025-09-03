import { useState } from "react";
import styles from './ExpandableGroup.module.css';

export type ExpandableGroup = {
    title : string;
    children? : React.ReactNode;
};

export default function ExpandableGroup( props : ExpandableGroup ) {
    const [showContents, setShowContents] = useState(true);

    return (
        <div className={styles["expandable-group"]}>
            <div className={styles["expandable-group-header"]}>
                <span title={props.title}>{props.title}</span>
                <button onClick={() => setShowContents( !showContents )}>{ showContents ? '-' : '+' }</button>
            </div>
            { (showContents)? props.children : <></> }
        </div>
    );
}
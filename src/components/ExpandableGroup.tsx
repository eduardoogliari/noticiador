import { useState } from "react";

export type ExpandableGroup = {
    title : string;
    children? : React.ReactNode;
};

export default function ExpandableGroup( props : ExpandableGroup ) {
    const [showContents, setShowContents] = useState(true);

    return (
        <div className="expandable-group">
            <div className="expandable-group-header">
                <span title={props.title}>{props.title}</span>
                <button onClick={() => setShowContents( !showContents )}>{ showContents ? '-' : '+' }</button>
            </div>
            { (showContents)? props.children : <></> }
        </div>
    );
}
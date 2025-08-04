export type ToolbarProp = {
    onClickAddSubscription : () => void;
};

export default function Toolbar( props : ToolbarProp ) {
    return (
        <div className="toolbar">
            <button className="toolbar-button" onClick={props.onClickAddSubscription}>➕ New Feed</button>
        </div>
    );
}
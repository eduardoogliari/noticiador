export type ToolbarProp = {
    onClickAddSubscription : () => void;
    refreshAllFeeds: () => void;
};

export default function Toolbar( props : ToolbarProp ) {
    return (
        <div className="toolbar">
            <button className="toolbar-button" onClick={props.onClickAddSubscription}>➕ New Feed</button>
            <span className='v-separator'></span>
            <button onClick={props.refreshAllFeeds}>Refresh all</button>
            {/* <button>Mark all as read</button> */}
            {/* <button>Send feed bin</button> */}
        </div>
    );
}
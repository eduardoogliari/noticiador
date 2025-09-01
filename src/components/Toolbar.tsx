export type ToolbarProp = {
    onClickAddSubscription : () => void;
    refreshAllFeeds: () => void;
};

export default function Toolbar( props : ToolbarProp ) {
    return (
        <div className="toolbar">
            <button
                className="toolbar-button"
                onClick={props.onClickAddSubscription}
            >
                <img className="toolbar-button-icon" src={'../icons/add.svg'} ></img>
                <span>New Feed</span>
            </button>

            <span className='v-separator'></span>

            <button
                className="toolbar-button"
                onClick={props.refreshAllFeeds}
            >
                <img className="toolbar-button-icon" src={'../icons/reload.svg'} ></img>
                <span>Refresh All</span>
            </button>

        </div>
    );
}
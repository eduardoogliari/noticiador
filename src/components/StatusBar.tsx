export type StatusBarProp = {
    onToggleSidePanelClick: () => void;
    isHidden: boolean;
};

export default function StatusBar( props: StatusBarProp ) {
    return (
        <div className={"status-bar"}>
            <button
                className="status-bar-button"
                onClick={props.onToggleSidePanelClick}
                title="Toggle side panel"
                aria-label="Toggle side panel"
            >
                <img
                    className="status-bar-icon"
                    src="../icons/side_panel.svg"
                ></img>
            </button>
        </div>
    );
}
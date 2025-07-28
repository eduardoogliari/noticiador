export type StatusBarProp = {
    onToggleSidePanelClick: () => void;
    isHidden: boolean;
};

export default function StatusBar( props: StatusBarProp ) {
    return (
        <div className={"status-bar"}>
            <button onClick={props.onToggleSidePanelClick}>[-]</button>
        </div>
    );
}
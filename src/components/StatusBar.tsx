import styles from './StatusBar.module.css';

export type StatusBarProp = {
    onToggleSidePanelClick: () => void;
    isHidden: boolean;
};

export default function StatusBar( props: StatusBarProp ) {
    return (
        <div className={styles['status-bar']}>
            <button
                className={styles["status-bar-button"]}
                onClick={props.onToggleSidePanelClick}
                title="Toggle side panel"
                aria-label="Toggle side panel"
            >
                <img
                    className={styles["status-bar-icon"]}
                    src="../icons/side_panel.svg"
                ></img>
            </button>
        </div>
    );
}
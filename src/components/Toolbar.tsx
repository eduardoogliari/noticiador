import styles from './Toolbar.module.css';

export type ToolbarProp = {
    onClickAddSubscription : () => void;
    refreshAllFeeds: () => void;
};

export default function Toolbar( props : ToolbarProp ) {
    return (
        <div className={styles["toolbar"]}>
            <button
                className={styles["toolbar-button"]}
                onClick={props.onClickAddSubscription}
            >
                <img className={styles["toolbar-button-icon"]} src={'../icons/add.svg'} ></img>
                <span>New Feed</span>
            </button>

            <span className='v-separator'></span>

            <button
                className={styles["toolbar-button"]}
                onClick={props.refreshAllFeeds}
            >
                <img className={styles["toolbar-button-icon"]} src={'../icons/reload.svg'} ></img>
                <span>Refresh All</span>
            </button>

        </div>
    );
}
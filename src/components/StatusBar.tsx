import { useTranslation } from 'react-i18next';
import styles from './StatusBar.module.css';

export type StatusBarProp = {
    onToggleSidePanelClick: () => void;
    isHidden: boolean;
};

export default function StatusBar( props: StatusBarProp ) {
    const { t } = useTranslation();

    return (
        <div className={styles['status-bar']}>
            <button
                className={styles["status-bar-button"]}
                onClick={props.onToggleSidePanelClick}
                title={ (props.isHidden) ? t('hint_status_bar_show_left_panel') : t('hint_status_bar_hide_left_panel') }
                aria-label={ (props.isHidden) ? t('hint_status_bar_show_left_panel') : t('hint_status_bar_hide_left_panel') }
            >
                <img
                    className={styles["status-bar-icon"]}
                    src="../icons/side_panel.svg"
                ></img>
            </button>
        </div>
    );
}
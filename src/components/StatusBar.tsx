import { useTranslation } from 'react-i18next';
import styles from './StatusBar.module.css';
import { forwardRef, useImperativeHandle, useState } from 'react';

export type StatusBarHandle = {
  clearHoveredUrl: () => void;
  setHoveredUrl: (url: string) => void;
};

export type StatusBarProp = {
    onToggleSidePanelClick: () => void;
    isHidden: boolean;
};

const StatusBar = forwardRef<StatusBarHandle, StatusBarProp>((props, ref) => {
    const { t } = useTranslation();

    const [url, setURL] = useState("");

    useImperativeHandle(ref, () => ({
        clearHoveredUrl() {
            setURL("");
        },
        setHoveredUrl(url: string) {
            setURL(url);
        }
    }));

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

            <span className='v-separator'></span>

            <span className={styles['status-bar-url']}>{url}</span>
        </div>
    );
});

export default StatusBar;
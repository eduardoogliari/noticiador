import styles from './Toolbar.module.css';
import {useTranslation} from 'react-i18next';

export type ToolbarProp = {
    onClickAddSubscription : () => void;
    refreshAllFeeds: () => void;
};

export default function Toolbar( props : ToolbarProp ) {
    const { t } = useTranslation();

    return (
        <div className={styles["toolbar"]}>
            <button
                className={styles["toolbar-button"]}
                onClick={props.onClickAddSubscription}
                title={t('hint_toolbar_new_feed')}
                aria-label={t('hint_toolbar_new_feed')}
            >
                <img className={styles["toolbar-button-icon"]} src={'../icons/add.svg'} ></img>
                <span>{t('toolbar_new_feed')}</span>
            </button>

            <span className='v-separator'></span>

            <button
                className={styles["toolbar-button"]}
                onClick={props.refreshAllFeeds}
                title={t('hint_toolbar_refresh_all')}
                aria-label={t('hint_toolbar_refresh_all')}
            >
                <img className={styles["toolbar-button-icon"]} src={'../icons/reload.svg'} ></img>
                <span>{t('toolbar_refresh_all')}</span>
            </button>

        </div>
    );
}
import { useEffect, useRef, useState } from "react";
import { FeedItem } from "../types/feed-item";
import styles from './ConfirmEmptyBinModal.module.css';
import { useTranslation } from "react-i18next";

export default function ConfirmEmptyBinModal() {
    const { t } = useTranslation();
    const defaultButton = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        defaultButton.current?.focus();
    }, []);

    return (
        <>
            <div className={styles["empty-bin-modal-container"]}>
                <div>
                    {t('modal_confirm_empty_bin_message')}
                </div>

                <div className="h-separator"></div>

                <div className={styles["empty-bin-modal-buttons"]}>
                    <button
                        onClick={ async () => {
                            const binItems : FeedItem[] = await window.rssAPI.getFeedBinItems();
                            window.rssAPI.deleteFeedItems( binItems.map( (item) => item.id ) );
                            window.rssAPI.signalFeedBinChanged();
                            window.electronApi.closeModal();}
                        }
                    >{t('modal_button_delete')}</button>

                    <button
                        ref={defaultButton}
                        onClick={() => {
                            window.electronApi.closeModal();
                        }}>{t('modal_button_cancel')}</button>
                </div>
            </div>
        </>
    );
}
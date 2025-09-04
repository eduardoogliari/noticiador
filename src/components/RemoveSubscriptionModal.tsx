import { useEffect, useRef, useState } from "react";
import { ModalData } from "../types/modal-data";
import { ModalType } from "../types/modal-type";
import styles from './RemoveSubscriptionModal.module.css';
import { Trans, useTranslation } from "react-i18next";

export default function RemoveSubscriptionModal() {
    const { t } = useTranslation();
    const [subId, setSubId] = useState(-1);
    const [subName, setSubName] = useState('');
    const defaultButton = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        window.electronApi.onModalData( (data: ModalData) => {
            if( data.type === ModalType.ConfirmDeleteSubscription && data.data ) {
                setSubId( data.data.subId );
                setSubName( data.data.subName );
            }
        });

        defaultButton.current?.focus();
    }, []);

    return (
        <>
            <div className={styles["remove-sub-modal-container"]}>
                <div>
                    <Trans
                        i18nKey="modal_confirm_subscription_delete_message"
                        values={{ name: subName }}
                        components={{ strong: <strong /> }}
                    />
                </div>

                <div className="h-separator"></div>

                <div className={styles["remove-sub-modal-buttons"]}>
                    <button
                        onClick={ async () => {
                            await window.rssAPI.deleteSubscriptions( [subId] );
                            window.rssAPI.signalSubscriptionsChanged();
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
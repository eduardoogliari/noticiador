import { useEffect, useRef, useState } from "react";
import { ModalData } from "../types/modal-data";
import { ModalType } from "../types/modal-type";
import styles from './RemoveSubscriptionModal.module.css';

export default function RemoveSubscriptionModal() {
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
                    Delete subscription <strong>{`${subName}`}</strong>?
                </div>

                <div className="h-separator"></div>

                <div className={styles["remove-sub-modal-buttons"]}>
                    <button
                        onClick={ async () => {
                            await window.rssAPI.deleteSubscriptions( [subId] );
                            window.rssAPI.signalSubscriptionsChanged();
                            window.electronApi.closeModal();}
                        }
                    >Delete</button>

                    <button
                        ref={defaultButton}
                        onClick={() => {
                            window.electronApi.closeModal();
                        }}>Cancel</button>
                </div>
            </div>
        </>
    );
}
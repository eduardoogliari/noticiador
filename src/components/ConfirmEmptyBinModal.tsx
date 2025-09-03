import { useEffect, useRef, useState } from "react";
import { FeedItem } from "../types/feed-item";
import styles from './ConfirmEmptyBinModal.module.css';

export default function ConfirmEmptyBinModal() {
        const defaultButton = useRef<HTMLButtonElement>(null);

        useEffect(() => {
            defaultButton.current?.focus();
        }, []);

        return (
            <>
                <div className={styles["empty-bin-modal-container"]}>
                    <div>
                        Permanently delete all items from the Feed Bin? This action cannot be undone.
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